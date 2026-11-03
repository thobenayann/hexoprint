import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const source = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

test('the image optimizer no longer accepts SVG', async () => {
  assert.doesNotMatch(await source('next.config.ts'), /dangerouslyAllowSVG/);
});

test('production keeps error, warn and info logs', async () => {
  assert.match(await source('next.config.ts'),
    /removeConsole:\s*process\.env\.NODE_ENV === 'production'\s*\?\s*\{\s*exclude: \['error', 'warn', 'info'\]\s*\}\s*:\s*false/);
});
