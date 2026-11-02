import assert from 'node:assert/strict';
import test from 'node:test';
import { ContactFormSchema, createContactSubmissionSchema } from '../src/lib/contact-schema.mjs';

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
