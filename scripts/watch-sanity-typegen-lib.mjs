import { spawn } from 'node:child_process';
import { existsSync, readFileSync, statSync, unlinkSync } from 'node:fs';

function delay(milliseconds) {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

function childHasStopped(child) {
    return child.exitCode !== null || child.signalCode !== null;
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

function runProcess(spawnProcess, command, args) {
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
        const finish = (result) => {
            if (settled) return;
            settled = true;
            resolve(result);
        };

        child.once('error', () => finish(false));
        child.once('close', (code) => finish(code === 0));
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
        gracePeriodMs = 2_000,
        platform = process.platform,
        spawnProcess = spawn,
    } = {}
) {
    if (!child?.pid || childHasStopped(child)) return;

    if (platform === 'win32') {
        const killed = await runProcess(spawnProcess, 'taskkill.exe', [
            '/PID',
            String(child.pid),
            '/T',
            '/F',
        ]);
        if (!killed && !childHasStopped(child)) {
            try {
                child.kill('SIGKILL');
            } catch (error) {
                if (error.code !== 'ESRCH') throw error;
            }
        }
        await waitForChildToStop(child, gracePeriodMs);
        return;
    }

    try {
        process.kill(-child.pid, 'SIGTERM');
    } catch (error) {
        if (error.code !== 'ESRCH') throw error;
    }
    if (await waitForChildToStop(child, gracePeriodMs)) return;

    try {
        process.kill(-child.pid, 'SIGKILL');
    } catch (error) {
        if (error.code !== 'ESRCH') throw error;
    }
    await waitForChildToStop(child, gracePeriodMs);
}

export function createSanityWatchSupervisor({
    logger = console,
    pollIntervalMs = 100,
    sanityBin,
    schemaPath,
    schemaTimeoutMs = 30_000,
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
            await Promise.allSettled(
                records.map(({ child }) => terminateTree(child))
            );
            await Promise.allSettled(records.map(({ closed }) => closed));
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
