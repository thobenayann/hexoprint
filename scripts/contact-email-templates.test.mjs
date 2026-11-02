import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const source = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

test('the confirmation email never echoes visitor input', async () => {
  const tpl = await source('src/components/emails/contact-form-confirmation-email.tsx');
  assert.doesNotMatch(tpl, /firstName|lastName|description/);
  assert.match(tpl, /getOptionLabel\(PROJECT_TYPES, /);
  assert.match(tpl, /Bonjour,/);
});
