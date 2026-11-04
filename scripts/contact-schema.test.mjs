import assert from 'node:assert/strict';
import test from 'node:test';
import { CONTACT_LIMITS, ContactFormSchema, createContactSubmissionSchema, normalizeVisitorText } from '../src/lib/contact-schema.mjs';
import { screenContactSubmission } from '../src/lib/contact-screening.mjs';
import { toSafeFileNameSegments, toSafeSegments } from '../src/lib/safe-text.mjs';

const BLOB_BASE = 'https://store.public.blob.vercel-storage.com';
const CAMPAIGN_PATH = '/fr/b2b/hexoprint';

function draft() {
  return {
    type: 'particulier',
    firstName: 'Alice',
    lastName: 'Martin',
    email: 'alice@example.com',
    phone: '',
    company: '',
    projectType: 'modelisme',
    description: 'Une figurine a imprimer.',
    budget: '',
    deadline: '',
    files: [
      { name: 'figurine.stl', size: 1000, type: 'model/stl', url: 'https://store.public.blob.vercel-storage.com/figurine.stl' },
    ],
  };
}

test('empty optional fields are accepted and dropped', () => {
  const r = ContactFormSchema.safeParse(draft());
  assert.ok(r.success);
  assert.equal(r.data.phone, undefined);
  assert.equal(r.data.budget, undefined);
});

test('limits and closed lists are enforced', () => {
  for (const patch of [
    { firstName: 'a'.repeat(61) }, { company: 'a'.repeat(121) }, { phone: 'abc' }, { phone: '1'.repeat(31) },
    { description: 'a'.repeat(5001) }, { projectType: 'https://x.online/a' }, { budget: 'x' }, { deadline: 'x' },
    { files: Array.from({ length: 6 }, () => draft().files[0]) },
    { files: [{ ...draft().files[0], name: 'a/b.stl' }] }, { files: [{ ...draft().files[0], name: 'a\\b.stl' }] },
    { type: 'professionnel', company: '' },
  ]) assert.equal(ContactFormSchema.safeParse({ ...draft(), ...patch }).success, false, JSON.stringify(patch));
});

test('server schema only accepts files from the project Blob store', () => {
  const schema = createContactSubmissionSchema('https://store.public.blob.vercel-storage.com');
  const withUrl = (url) => ({ ...draft(), files: [{ ...draft().files[0], url }] });
  assert.ok(schema.safeParse(draft()).success);
  assert.equal(schema.safeParse(withUrl('https://evil.example/a.stl')).success, false);
  assert.equal(schema.safeParse(withUrl('https://store.public.blob.vercel-storage.com.evil.online/a.stl')).success, false);
});

test('optional keys may be absent and a file without url is refused by the server schema', () => {
  const minimal = draft();
  for (const key of ['phone', 'company', 'budget', 'deadline']) delete minimal[key];
  assert.ok(ContactFormSchema.safeParse(minimal).success);

  const schema = createContactSubmissionSchema('https://store.public.blob.vercel-storage.com/');
  assert.ok(schema.safeParse(draft()).success);
  const fileWithoutUrl = { ...draft().files[0] };
  delete fileWithoutUrl.url;
  assert.equal(schema.safeParse({ ...draft(), files: [fileWithoutUrl] }).success, false);
});

// Revue de branche, finding 1 : un caractère invisible ou un point
// idéographique cachait le lien de la campagne au tri et à l'affichage, alors
// que `new URL()` le retire (ou le lit comme `.`) et ouvre `partagepro.online`.
const INVISIBLE_CHARS = {
  'soft hyphen U+00AD': '\u00AD',
  'ZWSP U+200B': '\u200B',
  'ZWNJ U+200C': '\u200C',
  'ZWJ U+200D': '\u200D',
  'word joiner U+2060': '\u2060',
  'BOM U+FEFF': '\uFEFF',
  'Mongolian vowel separator U+180E': '\u180E',
  'bidi override U+202E': '\u202E',
};
const DOT_LOOKALIKES = { 'ideographic U+3002': '\u3002', 'fullwidth U+FF0E': '\uFF0E', 'halfwidth U+FF61': '\uFF61' };

test('finding 1: normalizeVisitorText strips format characters, blanks controls and maps dot lookalikes', () => {
  for (const [label, char] of Object.entries(INVISIBLE_CHARS)) {
    assert.equal(normalizeVisitorText(`partagepro${char}.online`), 'partagepro.online', label);
  }
  for (const [label, char] of Object.entries(DOT_LOOKALIKES)) {
    assert.equal(normalizeVisitorText(`partagepro${char}online`), 'partagepro.online', label);
  }
  // C0, DEL et C1 (dont NEL) deviennent une espace visible. Tabulation et
  // retours à la ligne restent : une description en contient.
  assert.equal(normalizeVisitorText('a\u0000b\u0001c\u001Fd\u007Fe\u0085f\u009Fg'), 'a b c d e f g');
  assert.equal(normalizeVisitorText('ligne 1\r\nligne 2\n\tfin'), 'ligne 1\r\nligne 2\n\tfin');
  // Texte ordinaire inchangé, accents et marques combinantes compris.
  const ordinary = "Élodie O'Brien, pièce de 2.5 cm, josé, 50 cm², 👍🏽";
  assert.equal(normalizeVisitorText(ordinary), ordinary);
});

test('finding 1: the parsed data carries the normalized text, so screening and display see the campaign link', () => {
  const variants = [
    ...Object.entries(INVISIBLE_CHARS).map(([label, char]) => [label, `partagepro${char}.online${CAMPAIGN_PATH}`]),
    ...Object.entries(DOT_LOOKALIKES).map(([label, char]) => [label, `partagepro${char}online${CAMPAIGN_PATH}`]),
  ];
  for (const schema of [ContactFormSchema, createContactSubmissionSchema(BLOB_BASE)]) {
    for (const [label, link] of variants) {
      const r = schema.safeParse({ ...draft(), description: `Projet exposé ici : ${link}` });
      assert.ok(r.success, label);
      assert.equal(r.data.description, `Projet exposé ici : partagepro.online${CAMPAIGN_PATH}`, label);
      assert.deepEqual(screenContactSubmission(r.data), { verdict: 'suspect', reasons: ['link_not_allowed'], linkHosts: ['partagepro.online'] }, label);
      const shown = toSafeSegments(r.data.description, { allowLinks: true }).map((segment) => segment.value).join('');
      assert.equal(shown, `Projet exposé ici : partagepro[.]online${CAMPAIGN_PATH}`, label);
    }
  }
});

test('finding 1: identity fields and file names are normalized too', () => {
  const r = ContactFormSchema.safeParse({
    ...draft(),
    type: 'professionnel',
    firstName: 'Ca\u00ADmille',
    lastName: 'Mar\u200Btin',
    company: `partagepro\u2060.online${CAMPAIGN_PATH}`,
    phone: '06\u00AD12\u000134\u200B56',
    files: [{ ...draft().files[0], name: 'www.partagepro\uFEFF.online.stl' }],
  });
  assert.ok(r.success);
  assert.deepEqual(
    [r.data.firstName, r.data.lastName, r.data.company, r.data.phone, r.data.files[0].name],
    ['Camille', 'Martin', `partagepro.online${CAMPAIGN_PATH}`, '0612 3456', 'www.partagepro.online.stl']
  );
  assert.deepEqual(screenContactSubmission(r.data), {
    verdict: 'suspect',
    reasons: ['link_not_allowed', 'link_in_identity_field'],
    linkHosts: ['partagepro.online', 'www.partagepro.online.stl'],
  });
  assert.equal(toSafeFileNameSegments(r.data.files[0].name).map((segment) => segment.value).join(''), 'www[.]partagepro[.]online.stl');
});

test('finding 1: length limits apply to the normalized text, and invisible characters are never a reason to refuse', () => {
  const ok = (patch) => ContactFormSchema.safeParse({ ...draft(), ...patch });
  // Texte collé depuis un traitement de texte : accepté, nettoyé.
  const pasted = ok({ firstName: `${'a'.repeat(CONTACT_LIMITS.nameMax)}${'\u00AD'.repeat(10)}`, description: `${'b'.repeat(5000)}\u200B` });
  assert.ok(pasted.success);
  assert.equal(pasted.data.firstName.length, CONTACT_LIMITS.nameMax);
  assert.equal(pasted.data.description.length, 5000);
  // Un nom fait d'une lettre et d'un caractère invisible n'a qu'une lettre.
  assert.equal(ok({ firstName: 'A\u00AD' }).success, false);
  assert.equal(ok({ description: 'ab\u200B\u200Bc' }).success, false);
  // Le motif du téléphone porte sur le texte nettoyé.
  assert.equal(ok({ phone: '06\u00AD00\u200B00' }).data.phone, '060000');
});

// Revue de branche, finding 3 : contrôle d'origine du store Blob.
test('finding 3: the Blob base must be an https URL', () => {
  for (const base of ['', '   ', '/', 'store.public.blob.vercel-storage.com', 'http://store.public.blob.vercel-storage.com', 'ftp://store.example', 'https://', undefined]) {
    assert.throws(() => createContactSubmissionSchema(base), /BLOB_PUBLIC_BASE_URL/, String(base));
  }
});

test('finding 3: file URLs are compared by origin, whatever the case, path or blanks of the base', () => {
  const withUrl = (url) => ({ ...draft(), files: [{ ...draft().files[0], url }] });
  for (const base of [BLOB_BASE, `${BLOB_BASE}/`, 'HTTPS://STORE.public.blob.vercel-storage.com', `${BLOB_BASE}/some/path`, `  ${BLOB_BASE}/ \n`, `${BLOB_BASE}:443`]) {
    const schema = createContactSubmissionSchema(base);
    for (const url of [`${BLOB_BASE}/a.stl`, 'https://STORE.public.blob.vercel-storage.com/a.stl', 'HTTPS://store.public.blob.vercel-storage.com/dossier/a-b%20c.stl']) {
      assert.ok(schema.safeParse(withUrl(url)).success, `${base} accepts ${url}`);
    }
    for (const url of [
      'https://store.public.blob.vercel-storage.com.evil.online/a.stl',
      'https://evil.example/a.stl',
      '//evil/a.stl',
      '//store.public.blob.vercel-storage.com/a.stl',
      '/a.stl',
      'http://store.public.blob.vercel-storage.com/a.stl',
      'https://store.public.blob.vercel-storage.com:8443/a.stl',
      'https://store.public.blob.vercel-storage.com@evil.online/a.stl',
      'https://x@store.public.blob.vercel-storage.com/a.stl',
      'https:\\\\store.public.blob.vercel-storage.com\\a.stl',
      'https://store.public.blob.vercel-storage.com\\@evil.online/a.stl',
      ` ${BLOB_BASE}/a.stl`,
      `${BLOB_BASE}/a.stl\n`,
      `${BLOB_BASE}/a b.stl`,
      'https://store.public.blob.vercel-storage\u00AD.com/a.stl',
      'https://store.public.blob.vercel-storage.com',
      'not a url',
    ]) {
      assert.equal(schema.safeParse(withUrl(url)).success, false, `${base} refuses ${JSON.stringify(url)}`);
    }
  }
});
