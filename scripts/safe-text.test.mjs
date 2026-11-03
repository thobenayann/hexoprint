import assert from 'node:assert/strict';
import test from 'node:test';
import { defang, toSafeSegments } from '../src/lib/safe-text.mjs';

const joined = (segments) => segments.map((segment) => segment.value).join('');

test('defang neutralises scheme and host dots only', () => {
  assert.equal(defang('https://partagepro.online/fr/b2b/hexoprint'), 'hxxps://partagepro[.]online/fr/b2b/hexoprint');
  assert.equal(defang('sharez.online/fr/x'), 'sharez[.]online/fr/x');
});

test('allowed links stay clickable only when links are allowed', () => {
  assert.deepEqual(toSafeSegments('voir https://we.tl/t-abc', { allowLinks: true }),
    [{ kind: 'text', value: 'voir ' }, { kind: 'link', value: 'https://we.tl/t-abc', href: 'https://we.tl/t-abc' }]);
  const off = toSafeSegments('voir https://we.tl/t-abc', { allowLinks: false });
  assert.ok(off.every((s) => s.kind === 'text'));
  assert.match(off.map((s) => s.value).join(''), /hxxps:\/\/we\[\.\]tl\/t-abc/);
});

test('unknown links, bare domains and markdown links are never clickable', () => {
  const join = (t) => toSafeSegments(t, { allowLinks: true });
  assert.ok(join('https://partagepro.online/x').every((s) => s.kind === 'text'));
  assert.equal(join('truc.online').map((s) => s.value).join(''), 'truc[.]online');
  assert.ok(join('[dossier](https://partagepro.online/x)').every((s) => s.kind === 'text'));
  assert.equal(join('(voir https://we.tl/t-abc).').find((s) => s.kind === 'link').href, 'https://we.tl/t-abc');
  assert.equal(join('écrivez à jean@exemple.fr').map((s) => s.value).join(''), 'écrivez à jean@exemple.fr');
});

test('defang handles scheme-less, uppercase and odd-separator forms', () => {
  assert.equal(defang('www.partagepro.online/x'), 'www[.]partagepro[.]online/x');
  assert.equal(defang('HTTPS://PARTAGEPRO.ONLINE/x'), 'hxxps://PARTAGEPRO[.]ONLINE/x');
  assert.equal(defang('http://1.2.3.4:8080/a.b?c=d.e#f.g'), 'hxxp://1[.]2[.]3[.]4:8080/a.b?c=d.e#f.g');
  assert.equal(defang('https:\\\\partagepro.online\\x.y'), 'hxxps:\\\\partagepro[.]online\\x.y');
  assert.equal(defang('https://we.tl@partagepro.online/x'), 'hxxps://we[.]tl@partagepro[.]online/x');
  // un domaine nu qui commence par "http" n'est pas un schéma
  assert.equal(defang('httpbin.org/get'), 'httpbin[.]org/get');
});

test('a link the URL parser cannot use is never clickable', () => {
  for (const text of [
    'https://we.tl@partagepro.online/x',
    'https://we.tl"@partagepro.online/x',
    'https://[bad/x',
    'https://%zz.com/x',
  ]) {
    const segments = toSafeSegments(text, { allowLinks: true });
    assert.ok(segments.every((s) => s.kind === 'text'), text);
    assert.doesNotMatch(joined(segments), /https?:/i, text);
  }
  const identity = joined(toSafeSegments('https://we.tl@partagepro.online/x', { allowLinks: true }));
  assert.equal(identity, 'hxxps://we[.]tl@partagepro[.]online/x');
});

test('scheme-less and uppercase unknown links are defanged', () => {
  assert.equal(joined(toSafeSegments('.partagepro.online/fr', { allowLinks: true })), '.partagepro[.]online/fr');
  assert.equal(joined(toSafeSegments('www.partagepro.online/x', { allowLinks: true })), 'www[.]partagepro[.]online/x');
  assert.equal(joined(toSafeSegments('HTTPS://PARTAGEPRO.ONLINE/x', { allowLinks: true })), 'hxxps://PARTAGEPRO[.]ONLINE/x');
  assert.equal(joined(toSafeSegments('HtTp://Truc.Online/X', { allowLinks: true })), 'hxxp://Truc[.]Online/X');
});

test('bare domains are defanged, including with leading punctuation', () => {
  const run = (text, options = { allowLinks: true }) => joined(toSafeSegments(text, options));
  assert.equal(run('.partagepro.online'), '.partagepro[.]online');
  assert.equal(run('-partagepro.online'), '-partagepro[.]online');
  assert.equal(run('voir (sharez.online).'), 'voir (sharez[.]online).');
  assert.equal(run('a.b.c.online et t.co'), 'a[.]b[.]c[.]online et t[.]co');
  assert.equal(run('@partagepro.online'), '@partagepro[.]online');
  assert.equal(run('partagepro.online@'), 'partagepro[.]online@');
  assert.equal(run('wеtransfer.com'), 'wеtransfer[.]com'); // « е » cyrillique
  assert.equal(run('wetransfer.com.evil.online'), 'wetransfer[.]com[.]evil[.]online');
});

test('numbers, versions and sentences without a domain are left alone', () => {
  const run = (text) => joined(toSafeSegments(text, { allowLinks: true }));
  for (const text of [
    'une base de 2.5 cm',
    'buse 0.4mm/0.6mm',
    'version 1.2.3-beta',
    'Fin de phrase. Début de la suivante.',
    'et cetera...',
    'a.b',
    '3.14',
  ]) assert.equal(run(text), text);
});

test('e-mail addresses are left alone, but only real ones', () => {
  const run = (text) => joined(toSafeSegments(text, { allowLinks: true }));
  assert.equal(run('jean@exemple.fr'), 'jean@exemple.fr');
  assert.equal(run('jean.dupont@sous.exemple.fr'), 'jean.dupont@sous.exemple.fr');
  assert.equal(run("o'neil+jean.dupont@exemple.co.uk, merci."), "o'neil+jean.dupont@exemple.co.uk, merci.");
  assert.equal(run('josé.garcía@exemple.es'), 'josé.garcía@exemple.es');
  // un site derrière « @ » sans partie locale n'est pas une adresse
  assert.equal(run('voir @partagepro.online'), 'voir @partagepro[.]online');
  // une partie locale qui n'est suivie d'aucun domaine n'est pas une adresse
  assert.equal(run('partagepro.online@x'), 'partagepro[.]online@x');
});

test('allowed bare domains stay as written, unless links are off', () => {
  assert.equal(joined(toSafeSegments('voir wetransfer.com ou www.we.tl', { allowLinks: true })), 'voir wetransfer.com ou www.we.tl');
  assert.equal(joined(toSafeSegments('depuis drive.google.com.', { allowLinks: true })), 'depuis drive.google.com.');
  assert.equal(joined(toSafeSegments('depuis drive.google.com.', { allowLinks: false })), 'depuis drive[.]google[.]com.');
  assert.equal(joined(toSafeSegments('depuis store.example.org', { allowLinks: true, extraAllowedHosts: ['example.org'] })), 'depuis store.example.org');
});

test('domain-like text inside a defanged link path is defanged too', () => {
  const text = joined(toSafeSegments('https://a.online/x?u=evil.com&v=1', { allowLinks: true }));
  assert.equal(text, 'hxxps://a[.]online/x?u=evil[.]com&v=1');
  const off = joined(toSafeSegments('https://we.tl/t-abc', { allowLinks: false }));
  assert.equal(off, 'hxxps://we[.]tl/t-abc');
});

test('text glued to a link, a stray scheme and a hidden address do not escape', () => {
  const off = (text) => joined(toSafeSegments(text, { allowLinks: false }));
  const on = (text) => joined(toSafeSegments(text, { allowLinks: true }));
  // le domaine collé au lien n'est pas absorbé par lui
  assert.equal(on('evil.comhttps://a.online/x'), 'evil[.]comhxxps://a[.]online/x');
  // un schéma sans hôte derrière lui disparaît d'un texte mis de côté
  assert.equal(off('https://https://a.online/x'), 'hxxps://hxxps://a[.]online/x');
  assert.equal(on('voir http:// ici'), 'voir http:// ici');
  assert.equal(off('voir http:// ici'), 'voir hxxp:// ici');
  // un « @ » dans le chemin d'un lien ne cache pas un domaine
  assert.equal(on('https://a.online/p@evil.com/q'), 'hxxps://a[.]online/p@evil[.]com/q');
});

test('the segments of allowed-only text rebuild the original text', () => {
  const text = 'Bonjour,\nmodèle : https://we.tl/t-abc et www.printables.com/model/1.\nbase 2.5 cm, jean@exemple.fr (https://drive.google.com/x).';
  const segments = toSafeSegments(text, { allowLinks: true });
  assert.equal(joined(segments), text);
  assert.deepEqual(segments.filter((s) => s.kind === 'link').map((s) => s.href), [
    'https://we.tl/t-abc',
    'https://www.printables.com/model/1',
    'https://drive.google.com/x',
  ]);
});

test('an empty or non-string input gives no segment', () => {
  assert.deepEqual(toSafeSegments('', { allowLinks: true }), []);
  assert.deepEqual(toSafeSegments(undefined, { allowLinks: true }), []);
});

test('defanged output never leaves a host a mail client could link', () => {
  const hostile = [
    'https://partagepro.online/fr/b2b/hexoprint',
    'HTTP://PARTAGEPRO.ONLINE',
    'sharez.online/fr/x',
    'www.partagepro.online',
    '[dossier](https://partagepro.online/x)',
    'https://we.tl"@partagepro.online/x',
    'https://we.tl/?u=https://partagepro.online/x',
    'https:/partagepro.online/x',
    'https:\\\\partagepro.online\\x',
    '.partagepro.online/x',
    'truc.online',
    'https://https://partagepro.online/x',
    'evil.comhttps://partagepro.online/x',
    'https://we.tl"@http://partagepro.online/x',
    'https://a.online/p@partagepro.online/q',
  ];
  for (const text of hostile) {
    const output = joined(toSafeSegments(text, { allowLinks: false }));
    assert.doesNotMatch(output, /https?:/i, text);
    assert.doesNotMatch(output, /partagepro\.online|sharez\.online|truc\.online/i, text);
  }
});

test('long hostile inputs stay fast', () => {
  for (const unit of ['a.bc ', 'a.', 'www.', 'https://a.b/', 'x@y.zz ', '.-_', 'a/', 'https://we.tl"@', 'a.bc' + '.'.repeat(500), 'https://we.tl/' + 'x.'.repeat(200)]) {
    const text = unit.repeat(Math.ceil(50000 / unit.length)).slice(0, 50000);
    const t = performance.now();
    toSafeSegments(text, { allowLinks: true, extraAllowedHosts: ['example.org'] });
    assert.ok(performance.now() - t < 1500, unit);
  }
});
