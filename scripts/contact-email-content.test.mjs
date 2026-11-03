import assert from 'node:assert/strict';
import test from 'node:test';
import {
  ADMIN_SUBJECT,
  REASON_LABELS,
  SUSPECT_BANNER_BODY,
  SUSPECT_BANNER_TITLE,
  SUSPECT_SUBJECT_PREFIX,
  buildAdminEmailText,
  buildAdminEnvelope,
} from '../src/lib/contact-email-content.mjs';

const FILE_URL = 'https://store.public.blob.vercel-storage.com/a.stl';
const extraAllowedHosts = ['store.public.blob.vercel-storage.com'];
const formData = {
  type: 'professionnel',
  firstName: 'Camille',
  lastName: 'Martin',
  email: 'camille.martin@exemple.fr',
  phone: '06 12 34 56 78',
  company: 'Atelier Martin',
  projectType: 'piece-technique',
  description: 'Bonjour, je souhaite un devis pour un support moteur.',
  budget: '100-200',
  deadline: '1-semaine',
  files: [{ name: 'support', size: 1_572_864, type: 'model/stl', url: FILE_URL }],
};
const CLEAN = { verdict: 'clean', reasons: [], linkHosts: [] };
const SUSPECT = { verdict: 'suspect', reasons: ['link_not_allowed'], linkHosts: ['partagepro.online'] };
const build = (patch, screening, submittedAt = 'lundi 2 novembre 2026') =>
  buildAdminEmailText({ formData: { ...formData, ...patch }, screening, submittedAt, extraAllowedHosts });

test('envelope follows the verdict', () => {
  assert.deepEqual(buildAdminEnvelope({ verdict: 'clean', reasons: [], linkHosts: [] }, 'a@b.fr'),
    { subject: 'Nouvelle demande de devis reçue', replyTo: 'a@b.fr', sendConfirmation: true, trackConversion: true });
  assert.deepEqual(buildAdminEnvelope({ verdict: 'suspect', reasons: ['link_not_allowed'], linkHosts: ['partagepro.online'] }, 'a@b.fr'),
    { subject: '[À VÉRIFIER] Nouvelle demande de devis reçue', replyTo: undefined, sendConfirmation: false, trackConversion: false });
});

test('suspect text contains no live URL at all', () => {
  const text = buildAdminEmailText({ formData: { ...formData, description: 'dossier : https://partagepro.online/fr' }, screening: SUSPECT, submittedAt: 'lundi', extraAllowedHosts });
  assert.doesNotMatch(text, /https?:\/\//);
  assert.match(text, /hxxps:\/\/partagepro\[\.\]online\/fr/);
  assert.match(text, /Message à vérifier avant toute action/);
  assert.match(text, /il contient un lien vers un site inconnu/);
  assert.ok(text.includes(formData.email));
});

test('clean text keeps allowed links and file URLs', () => {
  const text = buildAdminEmailText({ formData: { ...formData, description: 'voir https://we.tl/t-abc et partagepro.online' }, screening: CLEAN, submittedAt: 'lundi', extraAllowedHosts });
  assert.ok(text.includes('https://we.tl/t-abc'));
  assert.ok(text.includes('https://store.public.blob.vercel-storage.com/a.stl'));
  assert.ok(text.includes('partagepro[.]online'));
  assert.doesNotMatch(text, /Message à vérifier/);
});

test('the copy constants are the agreed ones', () => {
  assert.equal(ADMIN_SUBJECT, 'Nouvelle demande de devis reçue');
  assert.equal(SUSPECT_SUBJECT_PREFIX, '[À VÉRIFIER] ');
  assert.equal(SUSPECT_BANNER_TITLE, 'Message à vérifier avant toute action');
  assert.equal(SUSPECT_BANNER_BODY, "Ce message a été mis de côté automatiquement. N'ouvrez aucun lien et ne téléchargez aucun fichier tant que vous n'avez pas vérifié l'expéditeur. Pour répondre à un vrai client, copiez son adresse e-mail ci-dessous.");
  assert.deepEqual(REASON_LABELS, {
    link_not_allowed: 'il contient un lien vers un site inconnu',
    link_in_identity_field: 'un lien figure dans le nom, la société ou le téléphone',
  });
});

test('an unknown or missing verdict is handled as suspect', () => {
  for (const screening of [{ verdict: 'maybe', reasons: [], linkHosts: [] }, {}, { verdict: undefined }]) {
    assert.deepEqual(buildAdminEnvelope(screening, 'a@b.fr'),
      { subject: '[À VÉRIFIER] Nouvelle demande de devis reçue', replyTo: undefined, sendConfirmation: false, trackConversion: false });
    assert.match(build({}, screening), /Message à vérifier avant toute action/);
  }
});

test('a suspect text starts with the banner and lists every reason', () => {
  const text = build({}, { verdict: 'suspect', reasons: ['link_not_allowed', 'link_in_identity_field'], linkHosts: [] });
  assert.ok(text.startsWith(SUSPECT_BANNER_TITLE));
  assert.ok(text.includes(SUSPECT_BANNER_BODY));
  assert.ok(text.includes(`- ${REASON_LABELS.link_not_allowed}`));
  assert.ok(text.includes(`- ${REASON_LABELS.link_in_identity_field}`));
  assert.ok(text.indexOf(REASON_LABELS.link_not_allowed) < text.indexOf('Informations du contact'));
  assert.doesNotMatch(build({}, { verdict: 'suspect', reasons: ['made_up'], linkHosts: [] }), /made_up|undefined/);
});

test('suspect text defangs every visitor field, file names and file URLs', () => {
  const text = build({
    firstName: 'www.partagepro.online',
    lastName: 'https://we.tl/x',
    company: 'sharez.online/fr',
    phone: 'https://partagepro.online',
    description: 'écrivez à jean@exemple.fr ou ouvrez wetransfer.com',
    files: [{ name: 'truc.online', size: 10, type: 'x', url: 'https://we.tl/a.stl' }],
  }, SUSPECT);
  assert.doesNotMatch(text, /https?:\/\//i);
  assert.doesNotMatch(text, /partagepro\.online|sharez\.online|truc\.online|we\.tl|wetransfer\.com/i);
  assert.match(text, /www\[\.\]partagepro\[\.\]online/);
  assert.match(text, /hxxps:\/\/we\[\.\]tl\/a\[\.\]stl/);
  assert.match(text, /écrivez à jean@exemple\.fr/);
  assert.ok(text.includes(formData.email));
});

test('clean text lists the same sections as the HTML email', () => {
  const text = build({}, CLEAN, 'lundi 2 novembre 2026');
  for (const expected of [
    'Nouvelle demande de devis',
    'Informations du contact',
    'Type : Professionnel',
    'Nom : Camille Martin',
    `Email : ${formData.email}`,
    'Téléphone : 06 12 34 56 78',
    'Entreprise : Atelier Martin',
    'Détails du projet',
    'Type de projet : Pièce technique sur-mesure',
    'Description :',
    'Bonjour, je souhaite un devis pour un support moteur.',
    'Budget approximatif : 100€ - 200€',
    'Délai souhaité : Sous 1 semaine',
    'Fichiers joints (1)',
    'support (1.50 MB)',
    FILE_URL,
    'Demande reçue le lundi 2 novembre 2026',
  ]) assert.ok(text.includes(expected), expected);
  assert.doesNotMatch(text, /À VÉRIFIER|Message à vérifier|\[\.\]/);
});

test('optional rubriques are left out when absent', () => {
  const text = build({ type: 'particulier', phone: undefined, company: undefined, budget: undefined, deadline: undefined, files: [] }, CLEAN);
  assert.match(text, /Type : Particulier/);
  for (const absent of ['Téléphone', 'Entreprise', 'Budget approximatif', 'Délai souhaité', 'Fichiers joints']) {
    assert.ok(!text.includes(absent), absent);
  }
});

test('a clean file URL outside the allowed hosts is defanged', () => {
  const text = build({ files: [{ name: 'a', size: 1, type: 'x', url: 'https://autre.example.net/a.stl' }] }, CLEAN);
  assert.doesNotMatch(text, /https?:\/\//);
  assert.match(text, /hxxps:\/\/autre\[\.\]example\[\.\]net\/a\[\.\]stl/);
});

test('single-line fields cannot forge extra lines', () => {
  const text = build({ firstName: 'Jean\nEmail : ceo@hexoprint.fr', company: 'A\r\n\r\nB' }, CLEAN);
  assert.ok(text.includes('Nom : Jean Email : ceo@hexoprint.fr Martin'));
  assert.ok(text.includes('Entreprise : A B'));
});

test('the description stays a block of its own, line by line', () => {
  const text = build({ description: 'ligne un\nligne deux\n\nFichiers joints (9)' }, CLEAN);
  assert.ok(text.includes('Description :\n  ligne un\n  ligne deux\n\n  Fichiers joints (9)\n'));
});

test('non-http schemes, IP hosts and link remainders are defanged in both verdicts', () => {
  const description = 'ftp://203.0.113.7/plans.zip et \\\\203.0.113.7\\share et 203.0.113.7/x et file://evil.online/a';
  for (const screening of [CLEAN, SUSPECT]) {
    const text = build({ description }, screening);
    assert.doesNotMatch(text, /ftp:|file:|203\.0\.113\.7|evil\.online|plans\.zip/i);
    assert.match(text, /ftx:\/\/203\[\.\]0\[\.\]113\[\.\]7\/plans\[\.\]zip/);
    assert.match(text, /\\\\203\[\.\]0\[\.\]113\[\.\]7\\share/);
    assert.match(text, /filx:\/\/evil\[\.\]online\/a/);
  }
});

test('a clean text ends an allowed link at an unbalanced bracket and defangs what follows', () => {
  const text = build({ description: 'voir (https://we.tl/x)evil.online ou https://we.tl/y]evil.online' }, CLEAN);
  assert.ok(text.includes('(https://we.tl/x)evil[.]online'));
  assert.ok(text.includes('https://we.tl/y]evil[.]online'));
  assert.doesNotMatch(text, /evil\.online/);
});

test('a clean text ends an allowed link at any bracket, brace or angle character', () => {
  const tails = ['([)]evil.com', '[(])evil.online', '((x))evil.com', '[[x]]evil.com', '(xevil.online', 'x{evil.online', 'x}evil.online'];
  for (const tail of tails) {
    const text = build({ description: `voir https://we.tl/${tail}` }, CLEAN);
    const [, head] = /voir (https:\/\/we\.tl\/[^()[\]{}<>\s]*)/.exec(text);
    assert.ok(text.includes(`voir ${head}`), tail);
    assert.doesNotMatch(text, /evil\.(com|online)/, tail);
    assert.match(text, /evil\[\.\](com|online)/, tail);
  }
});

test('French phone numbers and amounts with dots are written as they are, in both verdicts', () => {
  for (const screening of [CLEAN, SUSPECT]) {
    const text = build({ phone: '05.61.22.33.44', description: 'rappelez le +33.5.61.22.33.44 ou le 05.61.22.33.44, budget 1.234.567.890 EUR' }, screening);
    assert.ok(text.includes('Téléphone : 05.61.22.33.44\n'));
    assert.ok(text.includes('+33.5.61.22.33.44 ou le 05.61.22.33.44, budget 1.234.567.890 EUR'));
    const lines = text.split('\n').filter((line) => /^Téléphone|rappelez/.test(line));
    assert.equal(lines.length, 2);
    assert.doesNotMatch(lines.join('\n'), /\[\.\]/);
  }
  const plus = build({ phone: '+33.5.61.22.33.44' }, CLEAN);
  assert.ok(plus.includes('Téléphone : +33.5.61.22.33.44\n'));
});

test('every kind of line break in the description stays inside its block', () => {
  const lineSeparator = String.fromCharCode(0x2028);
  const text = build({ description: `un\r\ndeux\rtrois${lineSeparator}quatre` }, CLEAN);
  assert.ok(text.includes('Description :\n  un\n  deux\n  trois\n  quatre\n'));
});

test('a value outside the closed lists is never echoed', () => {
  const text = build({ projectType: 'https://partagepro.online/x', budget: 'gratuit', deadline: 'hier' }, CLEAN);
  assert.doesNotMatch(text, /partagepro|gratuit|\bhier\b/);
  assert.equal(text.match(/Valeur non reconnue/g).length, 3);
});
