import { spawn } from 'node:child_process';
import { existsSync, statSync, unlinkSync } from 'node:fs';
import { resolve } from 'node:path';

const schemaPath = resolve('schema.json');
const sanityBin = resolve('node_modules', 'sanity', 'bin', 'sanity');
const children = new Set();
let shuttingDown = false;

if (existsSync(schemaPath)) {
    unlinkSync(schemaPath);
}

function stop(exitCode) {
    if (shuttingDown) return;
    shuttingDown = true;

    for (const child of children) {
        child.kill('SIGTERM');
    }

    process.exitCode = exitCode;
}

function startSanity(args, label) {
    const child = spawn(process.execPath, [sanityBin, ...args], {
        stdio: 'inherit',
    });

    children.add(child);
    child.once('exit', (code) => {
        children.delete(child);
        if (!shuttingDown) {
            console.error(`[Sanity TypeGen] ${label} stopped unexpectedly.`);
            stop(code ?? 1);
        }
    });

    return child;
}

process.once('SIGINT', () => stop(0));
process.once('SIGTERM', () => stop(0));

startSanity(['schema', 'extract', '--watch'], 'Schema extraction');

const schemaDeadline = Date.now() + 30_000;
const schemaPoll = setInterval(() => {
    if (existsSync(schemaPath) && statSync(schemaPath).size > 0) {
        clearInterval(schemaPoll);
        startSanity(['typegen', 'generate', '--watch'], 'Type generation');
        return;
    }

    if (Date.now() >= schemaDeadline) {
        clearInterval(schemaPoll);
        console.error('[Sanity TypeGen] Timed out waiting for schema.json.');
        stop(1);
    }
}, 100);
