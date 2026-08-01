import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { EventEmitter, once } from 'node:events';
import {
    mkdtempSync,
    rmSync,
    writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createInterface } from 'node:readline';
import test from 'node:test';

import {
    createSanityWatchSupervisor,
    createStableJsonGate,
    terminateProcessTree,
} from './watch-sanity-typegen-lib.mjs';

class FakeChild extends EventEmitter {
    constructor(pid) {
        super();
        this.pid = pid;
        this.exitCode = null;
        this.signalCode = null;
        this.killCalls = [];
    }

    kill(signal) {
        this.killCalls.push(signal);
        this.signalCode = signal;
        queueMicrotask(() => this.emit('close', null, signal));
        return true;
    }
}

function createLogger() {
    return {
        error() {},
        log() {},
    };
}

async function waitFor(predicate, timeoutMs = 2_000) {
    const deadline = Date.now() + timeoutMs;
    while (!predicate()) {
        if (Date.now() >= deadline) {
            throw new Error('Timed out waiting for condition');
        }
        await new Promise((resolve) => setTimeout(resolve, 10));
    }
}

function processExists(pid) {
    try {
        process.kill(pid, 0);
        return true;
    } catch (error) {
        return error.code === 'EPERM';
    }
}

function killIgnoringMissing(pid) {
    try {
        process.kill(pid, 'SIGKILL');
    } catch (error) {
        if (error.code !== 'ESRCH') throw error;
    }
}

test('stable JSON gate rejects partial and changing schema files', () => {
    const directory = mkdtempSync(join(tmpdir(), 'sanity-schema-'));
    const schemaPath = join(directory, 'schema.json');
    const gate = createStableJsonGate({ requiredStablePolls: 3 });

    try {
        writeFileSync(schemaPath, '{"types":');
        assert.equal(gate.check(schemaPath), false);

        writeFileSync(schemaPath, 'not-json');
        assert.equal(gate.check(schemaPath), false);

        writeFileSync(schemaPath, '{"types":[]}');
        assert.equal(gate.check(schemaPath), false);
        assert.equal(gate.check(schemaPath), false);

        writeFileSync(schemaPath, '{"types":[{"name":"article"}]}');
        assert.equal(gate.check(schemaPath), false);
        assert.equal(gate.check(schemaPath), false);
        assert.equal(gate.check(schemaPath), true);
    } finally {
        rmSync(directory, { recursive: true });
    }
});

test('SIGINT during schema polling cancels polling and never starts typegen', async () => {
    const signals = new EventEmitter();
    const children = [];
    const terminated = [];
    const spawnProcess = () => {
        const child = new FakeChild(1_000 + children.length);
        children.push(child);
        return child;
    };
    const terminateTree = async (child) => {
        terminated.push(child.pid);
        child.emit('close', null, 'SIGTERM');
        return true;
    };
    const supervisor = createSanityWatchSupervisor({
        logger: createLogger(),
        pollIntervalMs: 5,
        schemaPath: join(tmpdir(), 'missing-sanity-schema.json'),
        signals,
        spawnProcess,
        terminateTree,
    });

    signals.emit('SIGINT');
    assert.equal(await supervisor.done, 0);
    await new Promise((resolve) => setTimeout(resolve, 30));

    assert.equal(children.length, 1);
    assert.deepEqual(terminated, [1_000]);
    assert.strictEqual(supervisor.shutdown(0), supervisor.shutdown(1));
});

test('spawn failure shuts the supervisor down with a nonzero exit', async () => {
    const spawnProcess = () => {
        const child = new FakeChild(undefined);
        queueMicrotask(() => {
            child.emit('error', new Error('spawn failed'));
            child.emit('close', null, null);
        });
        return child;
    };
    const supervisor = createSanityWatchSupervisor({
        logger: createLogger(),
        schemaPath: join(tmpdir(), 'missing-sanity-schema.json'),
        spawnProcess,
        terminateTree: async () => true,
    });

    assert.equal(await supervisor.done, 1);
});

test('unexpected successful child exit becomes a supervisor failure', async () => {
    const child = new FakeChild(2_000);
    const supervisor = createSanityWatchSupervisor({
        logger: createLogger(),
        schemaPath: join(tmpdir(), 'missing-sanity-schema.json'),
        spawnProcess: () => child,
        terminateTree: async () => true,
    });

    child.emit('exit', 0, null);
    child.emit('close', 0, null);

    assert.equal(await supervisor.done, 1);
});

test('POSIX termination kills a resistant descendant after the leader closes', async () => {
    const leader = new FakeChild(4_200);
    let groupAlive = true;
    const signals = [];
    const killProcess = (pid, signal) => {
        signals.push([pid, signal]);

        if (signal === 'SIGTERM') {
            leader.exitCode = 0;
            queueMicrotask(() => leader.emit('close', 0, 'SIGTERM'));
            return;
        }
        if (signal === 'SIGKILL') {
            groupAlive = false;
            return;
        }
        if (signal === 0 && !groupAlive) {
            const error = new Error('process group is gone');
            error.code = 'ESRCH';
            throw error;
        }
    };

    const terminated = await terminateProcessTree(leader, {
        finalWaitMs: 20,
        gracePeriodMs: 1,
        killProcess,
        platform: 'linux',
    });

    assert.equal(terminated, true);
    assert.deepEqual(signals, [
        [-4_200, 'SIGTERM'],
        [-4_200, 0],
        [-4_200, 'SIGKILL'],
        [-4_200, 0],
    ]);
});

test('process-tree termination rejects non-positive and unsafe PIDs', async () => {
    for (const pid of [0, -1, Number.MAX_SAFE_INTEGER + 1, 1.5]) {
        const terminated = await terminateProcessTree(new FakeChild(pid), {
            platform: 'win32',
            spawnProcess: () => {
                throw new Error('invalid PID must not spawn a command');
            },
        });
        assert.equal(terminated, false);
    }
});

test('Windows taskkill timeout is bounded and falls back without hanging', async () => {
    const leader = new FakeChild(4_300);
    const taskkillChildren = [];
    const fallbackKills = [];
    const spawnProcess = () => {
        const taskkill = new FakeChild(5_000 + taskkillChildren.length);
        taskkillChildren.push(taskkill);
        return taskkill;
    };
    const killProcess = (pid, signal) => {
        if (signal === 0) {
            const error = new Error('process is gone');
            error.code = 'ESRCH';
            throw error;
        }
        fallbackKills.push([pid, signal]);
        leader.signalCode = signal;
        queueMicrotask(() => leader.emit('close', null, signal));
    };

    const outcome = await Promise.race([
        terminateProcessTree(leader, {
            captureDescendantPids: async () => {
                const error = new Error('PowerShell unavailable');
                error.code = 'ENOENT';
                throw error;
            },
            commandTimeoutMs: 5,
            finalWaitMs: 20,
            killProcess,
            platform: 'win32',
            spawnProcess,
        }),
        new Promise((resolve) => setTimeout(() => resolve('timed out'), 100)),
    ]);

    assert.equal(outcome, false);
    assert.equal(taskkillChildren.length, 2);
    assert.deepEqual(
        taskkillChildren.map((child) => child.killCalls),
        [['SIGKILL'], ['SIGKILL']]
    );
    assert.deepEqual(fallbackKills, [[4_300, 'SIGKILL']]);
});

test('shutdown resolves with failure when child close never arrives', async () => {
    const child = new FakeChild(4_400);
    const supervisor = createSanityWatchSupervisor({
        logger: createLogger(),
        schemaPath: join(tmpdir(), 'missing-sanity-schema.json'),
        shutdownTimeoutMs: 10,
        spawnProcess: () => child,
        terminateTree: async () => true,
    });

    const result = await Promise.race([
        supervisor.shutdown(0),
        new Promise((resolve) => setTimeout(() => resolve('timed out'), 100)),
    ]);

    assert.equal(result, 1);
    assert.strictEqual(supervisor.shutdown(0), supervisor.shutdown(0));
});

test('shutdown resolves with failure when tree termination never settles', async () => {
    const child = new FakeChild(4_500);
    const supervisor = createSanityWatchSupervisor({
        logger: createLogger(),
        schemaPath: join(tmpdir(), 'missing-sanity-schema.json'),
        shutdownTimeoutMs: 10,
        spawnProcess: () => child,
        terminateTree: () => new Promise(() => {}),
    });

    const result = await Promise.race([
        supervisor.shutdown(0),
        new Promise((resolve) => setTimeout(() => resolve('timed out'), 100)),
    ]);

    assert.equal(result, 1);
});

test('shutdown treats an undefined termination result as failure', async () => {
    const signals = new EventEmitter();
    const child = new FakeChild(4_600);
    const supervisor = createSanityWatchSupervisor({
        logger: createLogger(),
        schemaPath: join(tmpdir(), 'missing-sanity-schema.json'),
        shutdownTimeoutMs: 20,
        signals,
        spawnProcess: () => child,
        terminateTree: async () => {
            child.emit('close', null, 'SIGTERM');
            return undefined;
        },
    });

    signals.emit('SIGINT');

    assert.equal(await supervisor.done, 1);
});

test('Windows fallback kills captured descendants bottom-up after taskkill fails', async () => {
    const leader = new FakeChild(4_700);
    const alive = new Set([4_700, 4_701, 4_702]);
    const killed = [];
    const spawnProcess = () => {
        const command = new FakeChild(5_100);
        queueMicrotask(() => {
            command.emit('error', new Error('taskkill unavailable'));
            command.emit('close', 1, null);
        });
        return command;
    };
    const killProcess = (pid, signal) => {
        if (signal === 0) {
            if (alive.has(pid)) return;
            const error = new Error('process is gone');
            error.code = 'ESRCH';
            throw error;
        }
        assert.equal(signal, 'SIGKILL');
        killed.push(pid);
        alive.delete(pid);
        if (pid === leader.pid) {
            leader.signalCode = signal;
            queueMicrotask(() => leader.emit('close', null, signal));
        }
    };

    const terminated = await terminateProcessTree(leader, {
        captureDescendantPids: async () => [4_701, 4_702],
        commandTimeoutMs: 10,
        finalWaitMs: 20,
        killProcess,
        platform: 'win32',
        spawnProcess,
    });

    assert.equal(terminated, true);
    assert.deepEqual(killed, [4_702, 4_701, 4_700]);
    assert.deepEqual([...alive], []);
});

test('Windows fallback rescans dead parent seeds and kills a late child', async () => {
    const leader = new FakeChild(7_000);
    const alive = new Set([7_000, 7_001]);
    const parents = new Map([[7_001, 7_000]]);
    const killed = [];
    let lateChildSpawned = false;
    let clock = 0;
    const spawnProcess = () => {
        const command = new FakeChild(7_100);
        queueMicrotask(() => {
            command.emit('error', new Error('taskkill unavailable'));
            command.emit('close', 1, null);
        });
        return command;
    };
    const captureDescendantPids = async (seedPids) => {
        const seeds = new Set(
            Array.isArray(seedPids) ? seedPids : [seedPids]
        );
        const discovered = [];
        let added;
        do {
            added = false;
            for (const pid of alive) {
                if (seeds.has(pid)) continue;
                const parentPid = parents.get(pid);
                if (seeds.has(parentPid)) {
                    seeds.add(pid);
                    discovered.push(pid);
                    added = true;
                }
            }
        } while (added);
        return discovered;
    };
    const killProcess = (pid, signal) => {
        if (signal === 0) {
            if (alive.has(pid)) return;
            const error = new Error('process is gone');
            error.code = 'ESRCH';
            throw error;
        }
        killed.push(pid);
        alive.delete(pid);
        if (pid === 7_001 && !lateChildSpawned) {
            lateChildSpawned = true;
            parents.set(7_002, 7_001);
            alive.add(7_002);
        }
        if (pid === leader.pid) {
            leader.signalCode = signal;
            queueMicrotask(() => leader.emit('close', null, signal));
        }
    };

    const terminated = await terminateProcessTree(leader, {
        captureDescendantPids,
        commandTimeoutMs: 10,
        fallbackPollIntervalMs: 5,
        fallbackTimeoutMs: 100,
        finalWaitMs: 20,
        killProcess,
        now: () => clock,
        platform: 'win32',
        requiredStableScans: 2,
        spawnProcess,
        wait: async (milliseconds) => {
            clock += milliseconds;
        },
    });

    assert.equal(terminated, true);
    assert.deepEqual(killed, [7_001, 7_000, 7_002]);
    assert.deepEqual([...alive], []);
});

test('Windows fallback times out when descendants fork continuously', async () => {
    const leader = new FakeChild(7_200);
    const alive = new Set([7_200, 7_201]);
    const parents = new Map([[7_201, 7_200]]);
    let nextPid = 7_202;
    let clock = 0;
    const spawnProcess = () => {
        const command = new FakeChild(7_300);
        queueMicrotask(() => {
            command.emit('error', new Error('taskkill unavailable'));
            command.emit('close', 1, null);
        });
        return command;
    };
    const captureDescendantPids = async (seedPids) => {
        const seeds = new Set(
            Array.isArray(seedPids) ? seedPids : [seedPids]
        );
        const discovered = [];
        let added;
        do {
            added = false;
            for (const pid of alive) {
                if (seeds.has(pid)) continue;
                if (seeds.has(parents.get(pid))) {
                    seeds.add(pid);
                    discovered.push(pid);
                    added = true;
                }
            }
        } while (added);
        return discovered;
    };
    const killProcess = (pid, signal) => {
        if (signal === 0) {
            if (alive.has(pid)) return;
            const error = new Error('process is gone');
            error.code = 'ESRCH';
            throw error;
        }
        alive.delete(pid);
        if (pid !== leader.pid) {
            const childPid = nextPid;
            nextPid += 1;
            parents.set(childPid, pid);
            alive.add(childPid);
        } else {
            leader.signalCode = signal;
            queueMicrotask(() => leader.emit('close', null, signal));
        }
    };

    const terminated = await terminateProcessTree(leader, {
        captureDescendantPids,
        commandTimeoutMs: 10,
        fallbackPollIntervalMs: 5,
        fallbackTimeoutMs: 20,
        finalWaitMs: 20,
        killProcess,
        now: () => clock,
        platform: 'win32',
        requiredStableScans: 2,
        spawnProcess,
        wait: async (milliseconds) => {
            clock += milliseconds;
        },
    });

    assert.equal(terminated, false);
    assert.equal(alive.size > 0, true);
    assert.equal(clock, 20);
});

test('Windows fallback returns false and supervisor fails when a descendant survives', async () => {
    const leader = new FakeChild(4_800);
    const alive = new Set([4_800, 4_801]);
    const spawnProcess = () => {
        const command = new FakeChild(5_200);
        queueMicrotask(() => {
            command.emit('error', new Error('taskkill permission denied'));
            command.emit('close', 1, null);
        });
        return command;
    };
    const killProcess = (pid, signal) => {
        if (signal === 0) {
            if (alive.has(pid)) return;
            const error = new Error('process is gone');
            error.code = 'ESRCH';
            throw error;
        }
        if (pid === 4_801) {
            const error = new Error('access denied');
            error.code = 'EPERM';
            throw error;
        }
        alive.delete(pid);
        if (pid === leader.pid) {
            leader.signalCode = signal;
            queueMicrotask(() => leader.emit('close', null, signal));
        }
    };
    const terminateTree = (child) =>
        terminateProcessTree(child, {
            captureDescendantPids: async () => [4_801],
            commandTimeoutMs: 10,
            finalWaitMs: 20,
            killProcess,
            platform: 'win32',
            spawnProcess,
        });
    const terminated = await terminateTree(leader);

    assert.equal(terminated, false);
    assert.deepEqual([...alive], [4_801]);

    const signals = new EventEmitter();
    const supervisorChild = new FakeChild(4_900);
    const supervisor = createSanityWatchSupervisor({
        logger: createLogger(),
        schemaPath: join(tmpdir(), 'missing-sanity-schema.json'),
        signals,
        spawnProcess: () => supervisorChild,
        terminateTree: async (child) => {
            child.emit('close', null, 'SIGTERM');
            return terminated;
        },
    });
    signals.emit('SIGINT');

    assert.equal(await supervisor.done, 1);
});

test('process-tree termination leaves no child process behind', async () => {
    const parentSource = [
        "const {spawn} = require('node:child_process')",
        "const child = spawn(process.execPath, ['-e', 'setInterval(() => {}, 1000)'], {stdio: 'ignore'})",
        'console.log(child.pid)',
        'setInterval(() => {}, 1000)',
    ].join(';');
    const parent = spawn(process.execPath, ['-e', parentSource], {
        detached: process.platform !== 'win32',
        stdio: ['ignore', 'pipe', 'inherit'],
    });
    const lines = createInterface({ input: parent.stdout });
    const [pidLine] = await once(lines, 'line');
    lines.close();
    const childPid = Number(pidLine);
    assert.equal(Number.isSafeInteger(childPid), true);

    try {
        assert.equal(processExists(parent.pid), true);
        assert.equal(processExists(childPid), true);

        await terminateProcessTree(parent, { gracePeriodMs: 2_000 });
        await waitFor(
            () => !processExists(parent.pid) && !processExists(childPid),
            4_000
        );

        assert.equal(processExists(parent.pid), false);
        assert.equal(processExists(childPid), false);
    } finally {
        killIgnoringMissing(parent.pid);
        killIgnoringMissing(childPid);
    }
});
