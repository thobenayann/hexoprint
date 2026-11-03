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

test('the admin template renders from safe segments and the verdict', async () => {
  const tpl = await source('src/components/emails/contact-form-admin-email.tsx');
  assert.match(tpl, /const isClean = screening\.verdict === 'clean';/);
  assert.match(tpl, /toSafeSegments\(/);
  assert.match(tpl, /SUSPECT_BANNER_TITLE/);
  assert.match(tpl, /\{isClean && file\.url && \(/);
  assert.doesNotMatch(tpl, /function get(ProjectType|Budget|Deadline)Label/);
});

test('the email service applies the envelope', async () => {
  const svc = await source('src/lib/email-service.ts');
  assert.match(svc, /buildAdminEnvelope\(screening, formData\.email\)/);
  assert.match(svc, /replyTo: envelope\.replyTo/);
  assert.match(svc, /text: buildAdminEmailText\(/);
  assert.match(svc, /if \(envelope\.sendConfirmation\)/);
});

test('the admin template renders file names with the file name rules', async () => {
  const tpl = await source('src/components/emails/contact-form-admin-email.tsx');
  assert.match(tpl, /toSafeFileNameSegments\(/);
  assert.match(tpl, /safeFileName\(file\.name\)/);
  assert.doesNotMatch(tpl, /safe\(file\.name/);
});
