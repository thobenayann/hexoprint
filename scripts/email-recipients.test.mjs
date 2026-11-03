import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import {
  resolveAdminRecipients,
  resolveDeployEnv,
} from '../src/lib/email-recipients.mjs';

const MANAGER = 'gerant@example.com';
const DEVELOPER = 'dev@example.com';

test('production requires EMAIL_TO and adds EMAIL_TO_ADMIN when set', () => {
  const env = {
    NODE_ENV: 'production',
    VERCEL_ENV: 'production',
    EMAIL_TO: MANAGER,
    EMAIL_TO_ADMIN: DEVELOPER,
  };
  assert.equal(resolveDeployEnv(env), 'production');
  assert.deepEqual(resolveAdminRecipients(env), [MANAGER, DEVELOPER]);
});

test('production without EMAIL_TO_ADMIN only mails EMAIL_TO', () => {
  assert.deepEqual(
    resolveAdminRecipients({
      NODE_ENV: 'production',
      VERCEL_ENV: 'production',
      EMAIL_TO: MANAGER,
    }),
    [MANAGER]
  );
});

test('production without EMAIL_TO fails and names the variable and the environment', () => {
  for (const emailTo of [undefined, '', '   ']) {
    assert.throws(
      () =>
        resolveAdminRecipients({
          NODE_ENV: 'production',
          VERCEL_ENV: 'production',
          EMAIL_TO: emailTo,
          EMAIL_TO_ADMIN: DEVELOPER,
        }),
      (error) =>
        error instanceof Error &&
        /\bEMAIL_TO\b/.test(error.message) &&
        /production/.test(error.message)
    );
  }
});

test('a preview build runs with NODE_ENV=production but only mails EMAIL_TO_ADMIN', () => {
  const env = {
    NODE_ENV: 'production',
    VERCEL_ENV: 'preview',
    EMAIL_TO_ADMIN: DEVELOPER,
  };
  assert.equal(resolveDeployEnv(env), 'preview');
  assert.deepEqual(resolveAdminRecipients(env), [DEVELOPER]);
});

test('preview never includes the manager, even when EMAIL_TO is set', () => {
  const recipients = resolveAdminRecipients({
    NODE_ENV: 'production',
    VERCEL_ENV: 'preview',
    EMAIL_TO: MANAGER,
    EMAIL_TO_ADMIN: DEVELOPER,
  });
  assert.deepEqual(recipients, [DEVELOPER]);
  assert.ok(!recipients.includes(MANAGER));
});

test('preview without EMAIL_TO_ADMIN fails and names the variable and the environment', () => {
  for (const emailToAdmin of [undefined, '']) {
    assert.throws(
      () =>
        resolveAdminRecipients({
          NODE_ENV: 'production',
          VERCEL_ENV: 'preview',
          EMAIL_TO: MANAGER,
          EMAIL_TO_ADMIN: emailToAdmin,
        }),
      (error) =>
        error instanceof Error &&
        /EMAIL_TO_ADMIN/.test(error.message) &&
        /preview/.test(error.message)
    );
  }
});

test('an unknown VERCEL_ENV is treated as preview, so the manager is never mailed', () => {
  const env = {
    NODE_ENV: 'production',
    VERCEL_ENV: 'staging',
    EMAIL_TO: MANAGER,
    EMAIL_TO_ADMIN: DEVELOPER,
  };
  assert.equal(resolveDeployEnv(env), 'preview');
  assert.deepEqual(resolveAdminRecipients(env), [DEVELOPER]);
});

test('without VERCEL_ENV, NODE_ENV=production is treated as production', () => {
  const env = {
    NODE_ENV: 'production',
    EMAIL_TO: MANAGER,
    EMAIL_TO_ADMIN: DEVELOPER,
  };
  assert.equal(resolveDeployEnv(env), 'production');
  assert.deepEqual(resolveAdminRecipients(env), [MANAGER, DEVELOPER]);
  assert.throws(
    () => resolveAdminRecipients({ NODE_ENV: 'production' }),
    /EMAIL_TO/
  );
});

test('development needs neither EMAIL_TO nor EMAIL_TO_ADMIN', () => {
  for (const env of [
    { NODE_ENV: 'development' },
    { NODE_ENV: 'development', VERCEL_ENV: 'development' },
    {},
  ]) {
    assert.equal(resolveDeployEnv(env), 'development');
    assert.doesNotThrow(() => resolveAdminRecipients(env));
    assert.deepEqual(resolveAdminRecipients(env), []);
  }
  assert.deepEqual(
    resolveAdminRecipients({ NODE_ENV: 'development', EMAIL_TO: MANAGER }),
    [MANAGER]
  );
});

test('NODE_ENV=test keeps the test mode and requires nothing', () => {
  const env = { NODE_ENV: 'test' };
  assert.equal(resolveDeployEnv(env), 'test');
  assert.doesNotThrow(() => resolveAdminRecipients(env));
});

test('email-config resolves the recipients at import through the shared module', async () => {
  const config = await readFile(
    new URL('../src/lib/email-config.ts', import.meta.url),
    'utf8'
  );
  assert.match(config, /from '\.\/email-recipients\.mjs'/);
  assert.match(config, /resolveAdminRecipients\(/);
  assert.match(config, /EMAIL_TO: z\.string\(\)\.optional\(\)/);
});
