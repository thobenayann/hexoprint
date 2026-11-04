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

test('security headers apply to every route and Server Actions config is gone', async () => {
  const cfg = await source('next.config.ts');
  for (const [key, value] of [
    ['X-Frame-Options', 'SAMEORIGIN'],
    ['Referrer-Policy', 'strict-origin-when-cross-origin'],
    ['Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=()'],
    ['Strict-Transport-Security', 'max-age=63072000; includeSubDomains'],
    ['X-Content-Type-Options', 'nosniff'],
  ]) assert.match(cfg, new RegExp(`key: '${key}',\\s*value: '${value.replace(/[()]/g, '\\$&')}'`), key);
  assert.doesNotMatch(cfg, /serverActions/);
  assert.doesNotMatch(cfg, /preload/);
});

// Le test ci-dessus passerait aussi grâce au bloc /studio pour deux des cinq
// en-têtes : celui-ci vérifie qu'ils sont bien dans le bloc de toutes les routes
test('all five security headers sit in the block that matches every route', async () => {
  const cfg = await source('next.config.ts');
  const start = cfg.indexOf("source: '/(.*)'");
  assert.notEqual(start, -1, "a block with source '/(.*)' exists");
  const global = cfg.slice(start);
  for (const key of ['X-Frame-Options', 'Referrer-Policy', 'Permissions-Policy',
    'Strict-Transport-Security', 'X-Content-Type-Options']) {
    assert.match(global, new RegExp(`key: '${key}'`), key);
  }
});
