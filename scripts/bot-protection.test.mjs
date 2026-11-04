import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import {
  fetchJsonWithTimeout,
  REQUEST_TIMEOUT_MS,
} from '../src/lib/fetch-json-with-timeout.mjs';

const source = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

const ROUTES = [
  ['src/app/api/contact/route.ts', 'request.json()'],
  ['src/app/api/upload/route.ts', 'request.formData()'],
];

test('both public routes are protected before any work', async () => {
  const client = await source('src/instrumentation-client.ts');
  assert.match(client, /path: '\/api\/contact',\s*method: 'POST'/);
  assert.match(client, /path: '\/api\/upload',\s*method: 'POST'/);
  assert.match(await source('next.config.ts'), /withBotId\(nextConfig\)/);
  for (const [file, firstWork] of ROUTES) {
    const route = await source(file);
    const check = route.indexOf('await checkBotId(');
    assert.ok(check >= 0 && check < route.indexOf(firstWork), file);
    assert.match(route, /status: 403/);
  }
});

test('the Basic level is pinned on both sides and Deep Analysis is never enabled', async () => {
  const client = await source('src/instrumentation-client.ts');
  assert.match(client, /path: '\/api\/contact',\s*method: 'POST',\s*advancedOptions: \{ checkLevel: 'basic' \}/);
  assert.match(client, /path: '\/api\/upload',\s*method: 'POST',\s*advancedOptions: \{ checkLevel: 'basic' \}/);
  assert.doesNotMatch(client, /deepAnalysis/);
  for (const [file] of ROUTES) {
    const route = await source(file);
    assert.match(route, /await checkBotId\(\{\s*advancedOptions: \{ checkLevel: 'basic' \},?\s*\}\)/, file);
    assert.doesNotMatch(route, /deepAnalysis/, file);
  }
});

test('an unavailable BotID never turns into a 500, only a detected bot is refused', async () => {
  for (const [file] of ROUTES) {
    const route = await source(file);
    const check = route.indexOf('await checkBotId(');
    // Le try qui entoure l'appel est distinct du try principal du handler
    const innerTry = route.lastIndexOf('try {', check);
    assert.ok(innerTry > route.indexOf('try {'), `${file}: checkBotId needs its own try`);

    const catchStart = route.indexOf('catch (', check);
    const refusal = route.indexOf('if (isBot)', catchStart);
    assert.ok(catchStart > check && refusal > catchStart, `${file}: catch then refusal`);
    const catchBlock = route.slice(catchStart, refusal);
    assert.doesNotMatch(catchBlock, /return|throw/, `${file}: the catch must let the request through`);
    // Seul le message est journalisé, jamais l'objet d'erreur complet
    assert.match(catchBlock, /console\.error\([^)]*instanceof Error\s*\?\s*\w+\.message/, file);
    assert.doesNotMatch(catchBlock, /console\.error\([^)]*,\s*\w+\s*\)/, file);

    // Un verdict non booléen compte comme humain, et le refus reste un 403
    const tryBlock = route.slice(innerTry, catchStart);
    assert.match(tryBlock, /isBot = verification\.isBot === true/, file);
    assert.match(route.slice(refusal), /^if \(isBot\) \{\s*return NextResponse\.json(?:<ApiError>)?\(\s*\{ error: 'Accès refusé' \},\s*\{ status: 403 \}/, file);
  }
});

test('a BotID answer without a verdict is logged as an outage and the request goes through', async () => {
  // botid ne vérifie jamais res.ok : un corps d'erreur de l'API Vercel revient
  // avec isBot indéfini, sans exception. Sans cette branche, la panne serait muette.
  for (const [file] of ROUTES) {
    const route = await source(file);
    const check = route.indexOf('await checkBotId(');
    const catchStart = route.indexOf('catch (', check);
    const tryBlock = route.slice(route.lastIndexOf('try {', check), catchStart);
    assert.match(
      tryBlock,
      /if \(typeof verification\.isBot !== 'boolean'\) \{\s*console\.error\(\s*'BotID indisponible, requête acceptée',\s*'verdict absent',?\s*\);?\s*\}/,
      `${file}: a missing verdict must write the outage log line`
    );
    assert.doesNotMatch(tryBlock, /return|throw/, `${file}: a missing verdict must not stop the request`);
    // Le journal passe avant l'affectation : un verdict absent compte toujours comme humain
    assert.ok(
      tryBlock.indexOf("typeof verification.isBot !== 'boolean'") < tryBlock.indexOf('isBot = verification.isBot === true'),
      file
    );
  }
});

const CLIENT_COMPONENTS = [
  'src/components/sections/ContactForm.tsx',
  'src/components/ui/file-upload-simple.tsx',
];

test('the fallback messages are built from company-info, with no hard-coded contact details', async () => {
  const helper = await source('src/lib/contact-fallback-messages.ts');
  assert.match(helper, /import \{ COMPANY_INFO \} from '@\/lib\/company-info';/);
  assert.doesNotMatch(helper, /[\w.-]+@[\w-]+\.\w+|\b\d{2} \d{2} \d{2}/, 'no hard-coded e-mail or phone number');

  const contact = '\\$\\{COMPANY_INFO\\.contact\\.email\\} ou appelez le \\$\\{COMPANY_INFO\\.contact\\.phone\\}\\.';
  const expected = {
    BOT_REFUSED_MESSAGE: `Votre envoi n'a pas pu être vérifié automatiquement\\. Écrivez-nous directement à ${contact}`,
    FILE_TOO_LARGE_MESSAGE: `Ce fichier est trop volumineux pour être envoyé par le formulaire\\. Collez plutôt un lien de partage \\(WeTransfer, Google Drive, Dropbox…\\) dans la description de votre projet, ou écrivez-nous directement à ${contact}`,
    RATE_LIMITED_MESSAGE: `Vous avez envoyé plusieurs demandes en peu de temps\\. Merci de patienter dix minutes avant de réessayer, ou écrivez-nous directement à ${contact}`,
    SEND_FAILED_MESSAGE: `L'envoi n'a pas pu aboutir\\. Vérifiez votre connexion, désactivez un éventuel bloqueur de publicité, puis réessayez, ou écrivez-nous directement à ${contact}`,
  };
  for (const [name, pattern] of Object.entries(expected)) {
    const declaration = helper.match(new RegExp(`export const ${name} = \`([^\`]*)\`;`));
    assert.ok(declaration, `${name} must be an exported template literal`);
    assert.match(declaration[1], new RegExp(`^${pattern}$`), name);
    assert.doesNotMatch(declaration[1], /[—–;]/, `${name}: no dash or semicolon in the visible message`);
  }
});

test('both client components show the fallback messages on a 403, a 429 and a failed request', async () => {
  for (const file of CLIENT_COMPONENTS) {
    const component = await source(file);
    assert.match(
      component,
      /import \{\s*BOT_REFUSED_MESSAGE,\s*(?:FILE_TOO_LARGE_MESSAGE,\s*)?RATE_LIMITED_MESSAGE,\s*SEND_FAILED_MESSAGE,?\s*\} from '@\/lib\/contact-fallback-messages';/,
      file
    );
    assert.match(component, /response\.status === 403\) \{\s*(?:throw new Error|alert)\(BOT_REFUSED_MESSAGE\)/, `${file}: 403`);
    assert.match(component, /response\.status === 429\) \{\s*(?:throw new Error|alert)\(RATE_LIMITED_MESSAGE\)/, `${file}: 429`);
    // Un rejet avant toute réponse (réseau, script BotID bloqué, délai) montre le message de repli
    assert.match(
      component,
      /await fetchJsonWithTimeout\([\s\S]*?\} catch \(requestError\) \{[\s\S]*?SEND_FAILED_MESSAGE/,
      `${file}: a rejected request must show SEND_FAILED_MESSAGE`
    );
    // Aucune chaîne en dur à la place des messages
    assert.doesNotMatch(component, /patienter dix minutes|bloqueur de publicité/, `${file}: messages live in contact-fallback-messages`);
  }
});

test('the upload component answers a 413 with the oversized-file message, built from company-info', async () => {
  // Vercel refuse un corps de requête de plus de 4,5 Mo avec un 413, alors que
  // le formulaire autorise 100 Mo pour un fichier 3D : le visiteur doit être
  // orienté vers un lien de partage et les coordonnées du site.
  const upload = await source('src/components/ui/file-upload-simple.tsx');
  assert.match(upload, /\bFILE_TOO_LARGE_MESSAGE,\s*RATE_LIMITED_MESSAGE/, 'imported from the helper');
  assert.match(upload, /response\.status === 413\) \{\s*alert\(FILE_TOO_LARGE_MESSAGE\);\s*return;\s*\}/);
  // Le 413 est traité avant le repli générique « sans résultats lisibles »
  assert.ok(upload.indexOf('response.status === 413') < upload.indexOf('Array.isArray(body?.results)'));
  assert.doesNotMatch(upload, /trop volumineux|WeTransfer/, 'the copy lives in contact-fallback-messages');

  const helper = await source('src/lib/contact-fallback-messages.ts');
  const declaration = helper.match(/export const FILE_TOO_LARGE_MESSAGE = `([^`]*)`;/);
  assert.ok(declaration, 'FILE_TOO_LARGE_MESSAGE must be an exported template literal');
  assert.match(declaration[1], /\$\{COMPANY_INFO\.contact\.email\}/);
  assert.match(declaration[1], /\$\{COMPANY_INFO\.contact\.phone\}/);
  assert.match(declaration[1], /lien de partage \(WeTransfer, Google Drive, Dropbox…\)/);
});

test('both client components send through the timeout helper and never read the body unguarded', async () => {
  for (const file of CLIENT_COMPONENTS) {
    const component = await source(file);
    assert.match(component, /import \{ fetchJsonWithTimeout \} from '@\/lib\/fetch-json-with-timeout\.mjs';/, file);
    assert.doesNotMatch(component, /\bfetch\(/, `${file}: no bare fetch`);
    assert.doesNotMatch(component, /\.json\(\)/, `${file}: the body is read by the guarded helper`);
  }
  const form = await source('src/components/sections/ContactForm.tsx');
  assert.match(form, /fetchJsonWithTimeout\('\/api\/contact'/);
  assert.match(form, /\} finally \{\s*setIsSubmitting\(false\);/);
  const upload = await source('src/components/ui/file-upload-simple.tsx');
  assert.match(upload, /fetchJsonWithTimeout\(\s*'\/api\/upload',[\s\S]*?UPLOAD_TIMEOUT_MS/);
  assert.match(upload, /\} finally \{\s*setIsUploading\(false\);/);

  const helper = await source('src/lib/fetch-json-with-timeout.mjs');
  assert.match(helper, /Promise\.race\(\[exchange, timeout\]\)/);
  assert.match(helper, /new AbortController\(\)/);
  assert.match(helper, /\} finally \{\s*clearTimeout\(timer\);/);
  assert.match(helper, /try \{\s*const parsed = await response\.json\(\);[\s\S]*?\} catch \{\s*return null;/);
});

const withFetch = async (stub, run) => {
  const original = globalThis.fetch;
  globalThis.fetch = stub;
  try {
    await run();
  } finally {
    globalThis.fetch = original;
  }
};

const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

test('fetchJsonWithTimeout waits about twenty seconds by default', () => {
  assert.equal(REQUEST_TIMEOUT_MS, 20_000);
});

test('a request that never answers is rejected after the delay and aborted', async () => {
  let signal;
  await withFetch(
    (_url, init) => {
      signal = init.signal;
      return new Promise(() => {});
    },
    async () => {
      await assert.rejects(fetchJsonWithTimeout('/api/contact', { method: 'POST' }, 20), /Aucune réponse/);
      assert.equal(signal.aborted, true);
    }
  );
});

test('a body that never arrives is also cut by the delay', async () => {
  await withFetch(
    async () => ({ status: 200, ok: true, json: () => new Promise(() => {}) }),
    async () => {
      await assert.rejects(fetchJsonWithTimeout('/api/contact', { method: 'POST' }, 20), /Aucune réponse/);
    }
  );
});

test('a rejection that is not an Error (blocked BotID script) is passed on as a rejection', async () => {
  const blocked = new Event('error');
  await withFetch(
    async () => {
      throw blocked;
    },
    async () => {
      await assert.rejects(fetchJsonWithTimeout('/api/contact', { method: 'POST' }, 1000), (reason) => reason === blocked && !(reason instanceof Error));
    }
  );
});

test('a non-JSON body (firewall 429) gives a null body, never a SyntaxError', async () => {
  await withFetch(
    async () => new Response('<html>Too Many Requests</html>', { status: 429 }),
    async () => {
      const { response, body } = await fetchJsonWithTimeout('/api/contact', { method: 'POST' }, 1000);
      assert.equal(response.status, 429);
      assert.equal(body, null);
    }
  );
});

test('a JSON object body is returned and anything else is ignored', async () => {
  const answers = [
    ['{"error":"Données invalides"}', { error: 'Données invalides' }],
    ['null', null],
    ['42', null],
    ['', null],
  ];
  for (const [raw, expected] of answers) {
    await withFetch(
      async () => new Response(raw, { status: 400 }),
      async () => {
        const { body } = await fetchJsonWithTimeout('/api/contact', { method: 'POST' }, 1000);
        assert.deepEqual(body, expected, raw);
      }
    );
  }
});

test('the timer is stopped on success and on failure, so nothing is aborted later', async () => {
  let signal;
  await withFetch(
    async (_url, init) => {
      signal = init.signal;
      return new Response('{"success":true}');
    },
    async () => {
      await fetchJsonWithTimeout('/api/contact', { method: 'POST' }, 30);
      await pause(80);
      assert.equal(signal.aborted, false, 'success path');
    }
  );
  await withFetch(
    async (_url, init) => {
      signal = init.signal;
      throw new TypeError('Failed to fetch');
    },
    async () => {
      await assert.rejects(fetchJsonWithTimeout('/api/contact', { method: 'POST' }, 30), TypeError);
      await pause(80);
      assert.equal(signal.aborted, false, 'failure path');
    }
  );
});

test('the docs name the OIDC setting exactly, use vercel curl for previews and do not over-promise on the client level', async () => {
  const doc = await source('docs/securite.md');
  assert.doesNotMatch(doc, /option OIDC/, 'the setting has a precise name');
  assert.equal(doc.match(/Secure Backend Access with OIDC Federation/g)?.length, 3);
  assert.match(doc, /Settings > Security/);
  assert.match(doc, /vercel curl <chemin> --deployment <url-de-la-preview>/);
  assert.match(doc, /Vercel Authentication/);
  assert.match(doc, /`d=1`/);
  assert.match(doc, /Seuls le verdict du serveur et la facturation restent fixés/);
  assert.doesNotMatch(doc, /ne peut pas le modifier en silence/);

  const client = await source('src/instrumentation-client.ts');
  assert.match(client, /Côté client, il ne garantit rien/);
  assert.match(client, /d=1/);
});
