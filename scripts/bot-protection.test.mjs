import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const source = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

test('both public routes are protected before any work', async () => {
  const client = await source('src/instrumentation-client.ts');
  assert.match(client, /path: '\/api\/contact',\s*method: 'POST'/);
  assert.match(client, /path: '\/api\/upload',\s*method: 'POST'/);
  assert.match(await source('next.config.ts'), /withBotId\(nextConfig\)/);
  for (const [file, firstWork] of [['src/app/api/contact/route.ts', 'request.json()'], ['src/app/api/upload/route.ts', 'request.formData()']]) {
    const route = await source(file);
    const check = route.indexOf('await checkBotId()');
    assert.ok(check >= 0 && check < route.indexOf(firstWork), file);
    assert.match(route, /status: 403/);
  }
});
