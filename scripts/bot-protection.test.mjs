import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

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
    assert.match(route.slice(innerTry, catchStart), /isBot = verification\.isBot === true/, file);
    assert.match(route.slice(refusal), /^if \(isBot\) \{\s*return NextResponse\.json(?:<ApiError>)?\(\s*\{ error: 'Accès refusé' \},\s*\{ status: 403 \}/, file);
  }
});

test('both client components show a friendly message built from company-info on a 403', async () => {
  const helper = await source('src/lib/bot-refused-message.ts');
  assert.match(helper, /import \{ COMPANY_INFO \} from '@\/lib\/company-info';/);
  assert.match(helper, /COMPANY_INFO\.contact\.email/);
  assert.match(helper, /COMPANY_INFO\.contact\.phone/);
  assert.doesNotMatch(helper, /[\w.-]+@[\w-]+\.\w+|\b\d{2} \d{2} \d{2}/, 'no hard-coded e-mail or phone number');
  assert.match(helper, /Votre envoi n'a pas pu être vérifié automatiquement\. Écrivez-nous directement à \$\{COMPANY_INFO\.contact\.email\} ou appelez le \$\{COMPANY_INFO\.contact\.phone\}\./);
  const message = helper.match(/`([^`]*)`/)?.[1] ?? '';
  assert.ok(message.length > 0);
  assert.doesNotMatch(message, /[—–;]/, 'no dash or semicolon in the visible message');

  for (const file of ['src/components/sections/ContactForm.tsx', 'src/components/ui/file-upload-simple.tsx']) {
    const component = await source(file);
    assert.match(component, /import \{ BOT_REFUSED_MESSAGE \} from '@\/lib\/bot-refused-message';/, file);
    assert.match(component, /response\.status === 403/, file);
    assert.match(component, /BOT_REFUSED_MESSAGE/, file);
  }
});
