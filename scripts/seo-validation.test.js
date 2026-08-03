// This test is intentionally CommonJS because Node executes it directly.
// eslint-disable-next-line @typescript-eslint/no-require-imports
const test = require('node:test');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const assert = require('node:assert/strict');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { auditHtml, validatePageRegistry } = require('./seo-validation-lib');

test('rejects duplicate paths and a missing contact page', () => {
  const pages = [
    { path: '/', title: 'Accueil', description: 'Description' },
    { path: '/blog', title: 'Blog', description: 'Description' },
    { path: '/blog', title: 'Blog bis', description: 'Description' },
  ];
  const errors = validatePageRegistry(pages, ['/', '/blog', '/contact']);
  assert.match(errors.join('\n'), /Duplicate path: \/blog/);
  assert.match(errors.join('\n'), /Missing path: \/contact/);
});

test('requires title, description, canonical and exactly one h1', () => {
  const html = '<html><head><title>Page</title></head><body><p>Texte</p></body></html>';
  const errors = auditHtml(html, {
    path: '/prestations',
    canonical: 'https://www.hexoprint.fr/prestations',
  });
  assert.match(errors.join('\n'), /meta description/i);
  assert.match(errors.join('\n'), /canonical/i);
  assert.match(errors.join('\n'), /exactly one h1/i);
});
