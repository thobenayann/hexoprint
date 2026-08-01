import { spawn } from 'node:child_process';
import { existsSync, readFileSync, statSync, unlinkSync } from 'node:fs';

function delay(milliseconds) {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

function childHasStopped(child) {
    return child.exitCode != null || child.signalCode != null;
}

function isMissingProcess(error) {
    return error?.code === 'ESRCH';
}

async function waitForChildToStop(child, timeoutMs) {
    if (childHasStopped(child)) return true;

    let onClose;
    const closed = new Promise((resolve) => {
        onClose = () => resolve(true);
        child.once('close', onClose);
    });
    const stopped = await Promise.race([
        closed,
        delay(timeoutMs).then(() => false),
    ]);

    if (!stopped) child.removeListener('close', onClose);
    return stopped;
}

function runProcess(spawnProcess, command, args, timeoutMs) {
    return new Promise((resolve) => {
        let settled = false;
        let child;
        try {
            child = spawnProcess(command, args, {
                stdio: 'ignore',
                windowsHide: true,
            });
        } catch {
            resolve(false);
            return;
        }

        let timer;
        const finish = (result) => {
            if (settled) return;
            settled = true;
            clearTimeout(timer);
            child.removeListener('error', onError);
            child.removeListener('close', onClose);
            resolve(result);
        };
        const onError = () => finish(false);
        const onClose = (code) => finish(code === 0);

        child.once('error', onError);
        child.once('close', onClose);
        timer = setTimeout(() => {
            try {
                child.kill('SIGKILL');
            } catch (error) {
                if (!isMissingProcess(error)) {
                    finish(false);
                    return;
                }
            }
            finish(false);
        }, timeoutMs);
    });
}

function signalProcessGroup(pid, signal, killProcess) {
    try {
        killProcess(-pid, signal);
        return true;
    } catch (error) {
        if (isMissingProcess(error)) return false;
        if (signal === 0 && error?.code === 'EPERM') return true;
        throw error;
    }
}

async function waitForProcessGroupToStop(
    pid,
    timeoutMs,
    killProcess
) {
    const deadline = Date.now() + timeoutMs;

    while (signalProcessGroup(pid, 0, killProcess)) {
        if (Date.now() >= deadline) return false;
        await delay(Math.min(25, Math.max(1, deadline - Date.now())));
    }
    return true;
}

function settleWithin(promise, timeoutMs) {
    return new Promise((resolve) => {
        let settled = false;
        const finish = (result) => {
            if (settled) return;
            settled = true;
            clearTimeout(timer);
            resolve(result);
        };
        const timer = setTimeout(
            () => finish({ status: 'timeout' }),
            timeoutMs
        );

        Promise.resolve(promise).then(
            (value) => finish({ status: 'fulfilled', value }),
            (error) => finish({ error, status: 'rejected' })
        );
    });
}

export function createStableJsonGate({
    readFile = readFileSync,
    requiredStablePolls = 3,
    stat = statSync,
} = {}) {
    let lastSignature;
    let stablePolls = 0;

    return {
        check(path) {
            try {
                const before = stat(path);
                const source = readFile(path, 'utf8');
                JSON.parse(source);
                const after = stat(path);

                if (
                    before.size !== after.size ||
                    before.mtimeMs !== after.mtimeMs
                ) {
                    lastSignature = undefined;
                    stablePolls = 0;
                    return false;
                }

                const signature = `${after.size}:${after.mtimeMs}`;
                if (signature === lastSignature) {
                    stablePolls += 1;
                } else {
                    lastSignature = signature;
                    stablePolls = 1;
                }

                return stablePolls >= requiredStablePolls;
            } catch {
                lastSignature = undefined;
                stablePolls = 0;
                return false;
            }
        },
    };
}

export async function terminateProcessTree(
    child,
    {
        commandTimeoutMs = 2_000,
        finalWaitMs = 2_000,
        gracePeriodMs = 2_000,
        killProcess = process.kill,
        platform = process.platform,
        spawnProcess = spawn,
    } = {}
) {
    if (!child?.pid) return true;

    if (platform === 'win32') {
        for (let attempt = 0; attempt < 2; attempt += 1) {
            const killed = await runProcess(
                spawnProcess,
                'taskkill.exe',
                ['/PID', String(child.pid), '/T', '/F'],
                commandTimeoutMs
            );
            if (killed) {
                return waitForChildToStop(child, finalWaitMs);
            }
        }

        if (!childHasStopped(child)) {
            try {
                child.kill('SIGKILL');
            } catch (error) {
                if (!isMissingProcess(error)) throw error;
            }
        }
        await waitForChildToStop(child, finalWaitMs);
        return false;
    }

    signalProcessGroup(child.pid, 'SIGTERM', killProcess);
    await delay(gracePeriodMs);

    if (signalProcessGroup(child.pid, 0, killProcess)) {
        signalProcessGroup(child.pid, 'SIGKILL', killProcess);
    }
    const groupStopped = await waitForProcessGroupToStop(
        child.pid,
        finalWaitMs,
        killProcess
    );
    const leaderStopped = await waitForChildToStop(child, finalWaitMs);
    return groupStopped && leaderStopped;
}

export function createSanityWatchSupervisor({
    logger = console,
    pollIntervalMs = 100,
    sanityBin,
    schemaPath,
    schemaTimeoutMs = 30_000,
    shutdownTimeoutMs = 7_000,
    signals = process,
    spawnProcess = spawn,
    stablePolls = 3,
    terminateTree = terminateProcessTree,
} = {}) {
    const children = new Map();
    const gate = createStableJsonGate({
        requiredStablePolls: stablePolls,
    });
    let pollTimer;
    let requestedExitCode = 0;
    let resolveDone;
    let shutdownPromise;
    let shuttingDown = false;
    const done = new Promise((resolve) => {
        resolveDone = resolve;
    });

    const onSignal = () => {
        void shutdown(0);
    };

    function removeSignalHandlers() {
        signals.removeListener('SIGINT', onSignal);
        signals.removeListener('SIGTERM', onSignal);
    }

    function shutdown(exitCode = 0) {
        if (exitCode !== 0 && requestedExitCode === 0) {
            requestedExitCode = exitCode;
        }
        if (shutdownPromise) return shutdownPromise;

        shuttingDown = true;
        if (pollTimer) {
            clearInterval(pollTimer);
            pollTimer = undefined;
        }
        removeSignalHandlers();

        shutdownPromise = (async () => {
            const records = [...children.values()];
            const terminationResults = await Promise.all(
                records.map(({ child }) =>
                    settleWithin(
                        Promise.resolve().then(() => terminateTree(child)),
                        shutdownTimeoutMs
                    )
                )
            );
            const closeResults = await Promise.all(
                records.map(({ closed }) =>
                    settleWithin(closed, shutdownTimeoutMs)
                )
            );

            if (
                terminationResults.some(
                    (result) =>
                        result.status !== 'fulfilled' ||
                        result.value === false
                ) ||
                closeResults.some((result) => result.status !== 'fulfilled')
            ) {
                requestedExitCode = 1;
                logger.error(
                    '[Sanity TypeGen] Timed out or failed while stopping child processes.'
                );
            }
            resolveDone(requestedExitCode);
            return requestedExitCode;
        })();
        return shutdownPromise;
    }

    function startSanity(args, label) {
        if (shuttingDown) return undefined;

        let child;
        try {
            child = spawnProcess(process.execPath, [sanityBin, ...args], {
                detached: process.platform !== 'win32',
                stdio: 'inherit',
            });
        } catch (error) {
            logger.error(`[Sanity TypeGen] Failed to start ${label}:`, error);
            void shutdown(1);
            return undefined;
        }

        let resolveClosed;
        let failureReported = false;
        const closed = new Promise((resolve) => {
            resolveClosed = resolve;
        });
        children.set(child, { child, closed });

        const reportFailure = (error) => {
            if (failureReported || shuttingDown) return;
            failureReported = true;
            logger.error(`[Sanity TypeGen] ${label} stopped unexpectedly.`, error);
            void shutdown(1);
        };

        child.once('error', reportFailure);
        child.once('exit', (code, signal) => {
            if (!shuttingDown) {
                reportFailure(
                    new Error(
                        `exit code ${code ?? 'null'}, signal ${signal ?? 'none'}`
                    )
                );
            }
        });
        child.once('close', () => {
            children.delete(child);
            resolveClosed();
        });

        return child;
    }

    signals.once('SIGINT', onSignal);
    signals.once('SIGTERM', onSignal);

    try {
        if (existsSync(schemaPath)) unlinkSync(schemaPath);
    } catch (error) {
        logger.error('[Sanity TypeGen] Failed to remove stale schema:', error);
        void shutdown(1);
        return { done, shutdown };
    }

    const extractor = startSanity(
        ['schema', 'extract', '--watch'],
        'schema extraction'
    );
    if (!extractor || shuttingDown) return { done, shutdown };

    const schemaDeadline = Date.now() + schemaTimeoutMs;
    pollTimer = setInterval(() => {
        if (shuttingDown) return;

        if (gate.check(schemaPath)) {
            clearInterval(pollTimer);
            pollTimer = undefined;
            if (!shuttingDown) {
                startSanity(
                    ['typegen', 'generate', '--watch'],
                    'type generation'
                );
            }
            return;
        }

        if (Date.now() >= schemaDeadline) {
            logger.error('[Sanity TypeGen] Timed out waiting for stable schema JSON.');
            void shutdown(1);
        }
    }, pollIntervalMs);

    return { done, shutdown };
}
