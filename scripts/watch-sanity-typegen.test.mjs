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
        terminateTree: async () => {},
    });

    assert.equal(await supervisor.done, 1);
});

test('unexpected successful child exit becomes a supervisor failure', async () => {
    const child = new FakeChild(2_000);
    const supervisor = createSanityWatchSupervisor({
        logger: createLogger(),
        schemaPath: join(tmpdir(), 'missing-sanity-schema.json'),
        spawnProcess: () => child,
        terminateTree: async () => {},
    });

    child.emit('exit', 0, null);
    child.emit('close', 0, null);

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
    const chunks = [];
    parent.stdout.on('data', (chunk) => chunks.push(chunk));
    await once(parent.stdout, 'data');
    const childPid = Number(Buffer.concat(chunks).toString().trim());

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
        if (processExists(parent.pid)) parent.kill('SIGKILL');
        if (processExists(childPid)) process.kill(childPid, 'SIGKILL');
    }
});
