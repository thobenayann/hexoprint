import assert from 'node:assert/strict';
import test from 'node:test';
import { findLinks, isAllowedHost, screenContactSubmission, toScreeningLog } from '../src/lib/contact-screening.mjs';

const CAMPAIGN = "Une pièce de remplacement imprimée en 3D évite d'attendre un fournisseur d'origine. Quel devis et quel délai pour un prototype en impression 3D, livré en France ? Projet exposé ici : ";
const base = { firstName: 'Camille', lastName: 'Martin', company: undefined, phone: '0600000000', files: [] };
const screen = (patch, opts) => screenContactSubmission({ ...base, description: 'Bonjour', ...patch }, opts);

test('the campaign messages are suspect', () => {
  assert.deepEqual(screen({ description: CAMPAIGN + 'https://partagepro.online/fr/b2b/hexoprint' }),
    { verdict: 'suspect', reasons: ['link_not_allowed'], linkHosts: ['partagepro.online'] });
  assert.equal(screen({ description: CAMPAIGN + 'sharez.online/fr/b2b/hexoprint' }).verdict, 'suspect');
});

test('legitimate requests stay clean', () => {
  for (const description of [
    "Je voudrais faire imprimer une figurine de jeu de rôle de quelques cm, avec une base de 2.5 cm et des ailes détaillées.",
    'Bonjour, je souhaiterais faire imprimer ce support moteur, le fichier STL est joint.',
    "Mon fils cherche un stage d'observation en février, il s'intéresse à la 3D. Merci de votre retour.",
    'je vous envoie le plan.zip et le support.stl',
    'il me faut une pièce.de rechange',
    'écrivez-moi à jean@exemple.fr',
    'mon modèle : https://we.tl/t-abc123',
    'voir https://www.printables.com/model/123',
  ]) assert.equal(screen({ description }).verdict, 'clean', description);
});

test('lookalike, identity-field and file-name links are suspect', () => {
  assert.equal(screen({ description: 'https://wetransfer.com.evil.online/x' }).verdict, 'suspect');
  assert.deepEqual(screen({ firstName: 'https://we.tl/x' }).reasons, ['link_in_identity_field']);
  assert.equal(screen({ files: [{ name: 'www.exemple.online' }] }).verdict, 'suspect');
});

test('extra allowed hosts are honoured', () => {
  const r = screen({ description: 'https://store.public.blob.vercel-storage.com/a.stl' }, { extraAllowedHosts: ['store.public.blob.vercel-storage.com'] });
  assert.equal(r.verdict, 'clean');
});

test('review focus: case, homoglyph, userinfo, punctuation, markdown', () => {
  assert.equal(screen({ description: 'HTTPS://WE.TL/t-abc' }).verdict, 'clean');
  assert.equal(screen({ description: 'https://wеtransfer.com/x' }).verdict, 'suspect');
  assert.deepEqual(screen({ description: 'https://we.tl@partagepro.online/x' }).linkHosts, ['partagepro.online']);
  assert.equal(findLinks('(voir https://we.tl/t-abc).')[0].href, 'https://we.tl/t-abc');
  assert.equal(screen({ description: '[dossier](https://partagepro.online/x)' }).verdict, 'suspect');
});

test('review focus: pathological input stays fast', () => {
  for (const description of ['a.'.repeat(2500), 'www.'.repeat(1250), 'a/'.repeat(2500)]) {
    const t = performance.now();
    screen({ description });
    assert.ok(performance.now() - t < 100, description.slice(0, 8));
  }
});

test('the log line carries no personal data', () => {
  const log = toScreeningLog(screen({ description: CAMPAIGN + 'https://partagepro.online/fr' }));
  assert.deepEqual(Object.keys(log).sort(), ['event', 'linkHosts', 'reasons', 'verdict']);
});

test('findLinks reports exact offsets, raw text, normalised href and host', () => {
  const text = 'Voir [ici](https://we.tl/t-abc), puis sharez.online/fr. Et www.Exemple.online !';
  assert.deepEqual(findLinks(text).map(({ start, end, raw, href, host }) => ({ slice: text.slice(start, end), raw, href, host })), [
    { slice: 'https://we.tl/t-abc', raw: 'https://we.tl/t-abc', href: 'https://we.tl/t-abc', host: 'we.tl' },
    { slice: 'sharez.online/fr', raw: 'sharez.online/fr', href: 'https://sharez.online/fr', host: 'sharez.online' },
    { slice: 'www.Exemple.online', raw: 'www.Exemple.online', href: 'https://www.exemple.online/', host: 'www.exemple.online' },
  ]);
});

test('measurements, initials and e-mail addresses are not links', () => {
  for (const description of [
    'buse de 0.4mm/0.6mm, rapport 2.5/3, cf./ci-dessous, S.A.R.L/SAS',
    'écrivez à jean.dupont@exemple.fr/contact ou contact@www.exemple.fr',
    'voir www., ou https:// tout seul',
  ]) assert.deepEqual(findLinks(description), [], description);
});

test('a link hidden behind an allowed one or an invalid host is still caught', () => {
  assert.deepEqual(screen({ description: 'https://we.tl/x?u=https://partagepro.online/fr' }).linkHosts, ['partagepro.online', 'we.tl']);
  for (const description of [
    'https://we.tl/x?u=https://partagepro.online/fr',
    'https://partagepro.online:99999/fr',
    'https://partagepro.online@',
    'https:/partagepro.online/fr',
    'sharez.online:8443/fr',
  ]) assert.equal(screen({ description }).verdict, 'suspect', description);
});

test('fix I1: a leading dot, hyphen or underscore does not hide a link', () => {
  for (const description of [
    'ici :.partagepro.online/fr',
    'ici :...partagepro.online/fr',
    '-www.partagepro.online',
    '.www.partagepro.online',
    '..www.partagepro.online/x',
    '_www.partagepro.online',
    'https://we.tl\n.partagepro.online/x',
  ]) assert.equal(screen({ description }).verdict, 'suspect', JSON.stringify(description));
  const [link] = findLinks('ici :..www.partagepro.online/x');
  assert.deepEqual({ start: link.start, raw: link.raw, host: link.host }, { start: 7, raw: 'www.partagepro.online/x', host: 'www.partagepro.online' });
});

test('fix I2: a quote, backtick or angle bracket before "@" does not hide the real host', () => {
  for (const description of [
    'https://we.tl"@partagepro.online/x',
    'https://we.tl`@partagepro.online/x',
    'https://we.tl<@partagepro.online/x',
    'https://we.tl>@partagepro.online/x',
    'www.we.tl"@partagepro.online/x',
  ]) assert.deepEqual(screen({ description }), { verdict: 'suspect', reasons: ['link_not_allowed'], linkHosts: ['partagepro.online'] }, description);
  // L'inverse : un logiciel qui coupe au délimiteur ouvrirait partagepro.online.
  for (const description of [
    'https://partagepro.online"@we.tl/x',
    'https://partagepro.online)@we.tl/x',
    'https://partagepro.online@we.tl/x',
    'https://we.tl"www.partagepro.online/x',
  ]) assert.equal(screen({ description }).verdict, 'suspect', description);
  const [quoted] = findLinks('"https://we.tl", ok');
  assert.deepEqual([quoted.raw, quoted.href], ['https://we.tl', 'https://we.tl/']);
  for (const description of ['"https://we.tl", ok', '<a href="https://we.tl/x">lien</a>', '<p>https://we.tl</p>', '`https://we.tl`'])
    assert.equal(screen({ description }).verdict, 'clean', description);
});

test('fix R12: an unparseable link reports a bounded plain host or a sentinel, never its raw text', () => {
  for (const [text, host] of [
    ['https://we.tl:99999/x', 'we.tl'],
    ['https://partagepro.online:99999/x', 'partagepro.online'],
    ['https://we.tl:9x9,www.evil.online/x', 'invalid-host'],
    ['https://Jean.Dupont^Rue-des-Lilas/x', 'invalid-host'],
    [`https://${'a'.repeat(300)}.online:99999/x`, 'invalid-host'],
    [`www.${'w'.repeat(300)}.online`, 'invalid-host'],
  ]) {
    const [link] = findLinks(text);
    assert.deepEqual([link.host, link.href], [host, ''], text);
    assert.equal(screen({ description: text }).verdict, 'suspect', text);
  }
});

test('scaling: 50 000-character pathological inputs stay under 100 ms', () => {
  for (const unit of ['a.', 'www.', 'a/', '-.', '.', '_', 'a.b/', ':www.a', 'www.a"', 'https://a"', 'https://a^']) {
    const description = unit.repeat(Math.ceil(50000 / unit.length)).slice(0, 50000);
    const t = performance.now();
    screen({ description });
    assert.ok(performance.now() - t < 100, unit);
  }
});

test('isAllowedHost matches exact hosts and subdomains only', () => {
  assert.equal(isAllowedHost('we.tl'), true);
  assert.equal(isAllowedHost('WWW.Printables.com'), true);
  assert.equal(isAllowedHost('evilwetransfer.com'), false);
  assert.equal(isAllowedHost('wetransfer.com.evil.online'), false);
  assert.equal(isAllowedHost('we.tl:99999'), false);
  assert.equal(isAllowedHost('evil.online', ['']), false);
  assert.equal(isAllowedHost('a.store.example', ['store.example']), true);
});
