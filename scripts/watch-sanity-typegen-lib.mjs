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

function runProcessWithOutput(spawnProcess, command, args, timeoutMs) {
    return new Promise((resolve) => {
        let child;
        try {
            child = spawnProcess(command, args, {
                stdio: ['ignore', 'pipe', 'ignore'],
                windowsHide: true,
            });
        } catch (error) {
            resolve({ error, ok: false, stdout: '' });
            return;
        }

        let settled = false;
        let stdout = '';
        const finish = (result) => {
            if (settled) return;
            settled = true;
            clearTimeout(timer);
            child.removeListener('error', onError);
            child.removeListener('close', onClose);
            child.stdout?.removeListener('data', onData);
            resolve({ stdout, ...result });
        };
        const onData = (chunk) => {
            stdout += chunk.toString();
            if (stdout.length > 1_000_000) {
                try {
                    child.kill('SIGKILL');
                } catch (error) {
                    if (!isMissingProcess(error)) {
                        finish({ error, ok: false });
                        return;
                    }
                }
                finish({
                    error: new Error('Process output exceeded one megabyte.'),
                    ok: false,
                });
            }
        };
        const onError = (error) => finish({ error, ok: false });
        const onClose = (code) => finish({ ok: code === 0 });
        const timer = setTimeout(() => {
            try {
                child.kill('SIGKILL');
            } catch (error) {
                if (!isMissingProcess(error)) {
                    finish({ error, ok: false });
                    return;
                }
            }
            finish({
                error: new Error('Process timed out.'),
                ok: false,
            });
        }, timeoutMs);

        if (!child.stdout) {
            finish({
                error: new Error('Process stdout is unavailable.'),
                ok: false,
            });
            return;
        }
        child.stdout.on('data', onData);
        child.once('error', onError);
        child.once('close', onClose);
    });
}

async function captureWindowsDescendantPids(
    seedPids,
    spawnProcess,
    timeoutMs
) {
    const seedList = seedPids.join(', ');
    const script = [
        "$ErrorActionPreference = 'Stop'",
        `$seedProcessIds = @(${seedList})`,
        '$processes = @(Get-CimInstance Win32_Process | Select-Object ProcessId, ParentProcessId)',
        '$known = @{}',
        '$seedProcessIds | ForEach-Object { $known[[int]$_] = $true }',
        '$ordered = @()',
        'do { $added = $false; foreach ($process in $processes) { $candidateId = [int]$process.ProcessId; $parentId = [int]$process.ParentProcessId; if ($known.ContainsKey($parentId) -and -not $known.ContainsKey($candidateId)) { $known[$candidateId] = $true; $ordered += $candidateId; $added = $true } } } while ($added)',
        '$ordered -join [Environment]::NewLine',
    ].join('; ');
    const result = await runProcessWithOutput(
        spawnProcess,
        'powershell.exe',
        ['-NoProfile', '-NonInteractive', '-Command', script],
        timeoutMs
    );

    if (!result.ok) {
        throw result.error ?? new Error('Unable to capture Windows descendants.');
    }
    if (!result.stdout.trim()) return [];

    return result.stdout
        .split(/\r?\n/)
        .filter(Boolean)
        .map((line) => {
            const pid = Number(line.trim());
            if (!Number.isSafeInteger(pid) || pid <= 0) {
                throw new Error(`Invalid descendant PID: ${line}`);
            }
            return pid;
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

function signalProcess(pid, signal, killProcess) {
    try {
        killProcess(pid, signal);
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

function normalizeDescendantPids(pids) {
    if (!Array.isArray(pids)) {
        throw new TypeError('Windows descendant capture must return an array.');
    }

    const seen = new Set();
    const normalized = [];
    for (const pid of pids) {
        if (!Number.isSafeInteger(pid) || pid <= 0) {
            throw new TypeError(`Invalid Windows descendant PID: ${pid}`);
        }
        if (!seen.has(pid)) {
            seen.add(pid);
            normalized.push(pid);
        }
    }
    return normalized;
}

function killKnownProcessesBottomUp(orderedPids, killProcess) {
    let succeeded = true;
    for (let index = orderedPids.length - 1; index >= 0; index -= 1) {
        const pid = orderedPids[index];
        try {
            if (signalProcess(pid, 0, killProcess)) {
                signalProcess(pid, 'SIGKILL', killProcess);
            }
        } catch {
            succeeded = false;
        }
    }
    return succeeded;
}

function forceKillKnownProcessesBottomUp(orderedPids, killProcess) {
    for (let index = orderedPids.length - 1; index >= 0; index -= 1) {
        try {
            signalProcess(orderedPids[index], 'SIGKILL', killProcess);
        } catch {
            // The caller still fails closed after every best-effort kill is tried.
        }
    }
}

function allKnownProcessesStopped(orderedPids, killProcess) {
    for (const pid of orderedPids) {
        if (signalProcess(pid, 0, killProcess)) return false;
    }
    return true;
}

async function terminateWindowsTreeAtFixedPoint({
    captureDescendantPids,
    captureTimeoutMs,
    killProcess,
    leaderPid,
    now,
    pollIntervalMs,
    requiredStableScans,
    timeoutMs,
    wait,
}) {
    if (
        !Number.isSafeInteger(timeoutMs) ||
        timeoutMs <= 0 ||
        !Number.isSafeInteger(pollIntervalMs) ||
        pollIntervalMs <= 0 ||
        !Number.isSafeInteger(requiredStableScans) ||
        requiredStableScans <= 0
    ) {
        return false;
    }

    const deadline = now() + timeoutMs;
    const knownPids = new Set([leaderPid]);
    const orderedPids = [leaderPid];
    let stableScans = 0;
    const maximumScans =
        Math.ceil(timeoutMs / pollIntervalMs) + requiredStableScans;

    for (let scan = 0; scan < maximumScans && now() < deadline; scan += 1) {
        const remainingMs = deadline - now();
        const captureResult = await settleWithin(
            Promise.resolve().then(() =>
                captureDescendantPids([...knownPids])
            ),
            Math.max(1, Math.min(captureTimeoutMs, remainingMs))
        );

        let capturedPids;
        try {
            if (captureResult.status !== 'fulfilled') {
                throw captureResult.error ?? new Error('Capture timed out.');
            }
            capturedPids = normalizeDescendantPids(captureResult.value);
        } catch {
            forceKillKnownProcessesBottomUp(orderedPids, killProcess);
            return false;
        }

        let discoveredNewPid = false;
        for (const pid of capturedPids) {
            if (!knownPids.has(pid)) {
                knownPids.add(pid);
                orderedPids.push(pid);
                discoveredNewPid = true;
            }
        }

        if (!killKnownProcessesBottomUp(orderedPids, killProcess)) {
            return false;
        }

        let allStopped;
        try {
            allStopped = allKnownProcessesStopped(orderedPids, killProcess);
        } catch {
            return false;
        }

        if (allStopped && !discoveredNewPid) {
            stableScans += 1;
            if (stableScans >= requiredStableScans) return true;
        } else {
            stableScans = 0;
        }

        const waitMs = Math.min(pollIntervalMs, deadline - now());
        if (waitMs <= 0) break;
        try {
            await wait(waitMs);
        } catch {
            return false;
        }
    }

    return false;
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
        captureDescendantPids,
        commandTimeoutMs = 2_000,
        fallbackPollIntervalMs = 50,
        fallbackTimeoutMs = 8_000,
        finalWaitMs = 2_000,
        gracePeriodMs = 2_000,
        killProcess = process.kill,
        now = Date.now,
        platform = process.platform,
        requiredStableScans = 3,
        spawnProcess = spawn,
        wait = delay,
    } = {}
) {
    if (!child) return true;
    if (!Number.isSafeInteger(child.pid) || child.pid <= 0) return false;

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

        const capture = captureDescendantPids ??
            ((seedPids) =>
                captureWindowsDescendantPids(
                    seedPids,
                    spawnProcess,
                    commandTimeoutMs
                ));
        return terminateWindowsTreeAtFixedPoint({
            captureDescendantPids: capture,
            captureTimeoutMs: commandTimeoutMs,
            killProcess,
            leaderPid: child.pid,
            now,
            pollIntervalMs: fallbackPollIntervalMs,
            requiredStableScans,
            timeoutMs: fallbackTimeoutMs,
            wait,
        });
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
    shutdownTimeoutMs = 15_000,
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
                        result.value !== true
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
