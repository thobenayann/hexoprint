// This test is intentionally CommonJS because Node executes it directly.
// eslint-disable-next-line @typescript-eslint/no-require-imports
const test = require('node:test');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const assert = require('node:assert/strict');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { auditHtml, validatePageRegistry } = require('./seo-validation-lib');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { validateLlms, validateRobots, validateSitemap } = require('./crawl-seo');

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

test('rejects invalid registry entries and paths not declared by the required set', () => {
  const pages = [
    { key: 'home', path: '/', title: 'Accueil', description: 'Description', priority: 1, changeFrequency: 'weekly' },
    { key: 'home', path: '/blog?draft=1', title: 'Blog', description: 'Description', priority: 1.2, changeFrequency: 'often' },
    { key: '', path: '/../admin', title: 'Admin', description: 'Description', priority: 0.5, changeFrequency: 'monthly' },
  ];
  const errors = validatePageRegistry(pages, ['/']);
  assert.match(errors.join('\n'), /Duplicate key: home/);
  assert.match(errors.join('\n'), /Invalid key/);
  assert.match(errors.join('\n'), /Invalid path: \/blog\?draft=1/);
  assert.match(errors.join('\n'), /Unexpected path: \/\.\.\/admin/);
  assert.match(errors.join('\n'), /Invalid priority: \/blog\?draft=1/);
  assert.match(errors.join('\n'), /Invalid change frequency: \/blog\?draft=1/);
});

test('parses SEO attributes in any order and checks registry metadata plus safe JSON-LD', () => {
  const html = `<!doctype html><html><head>
    <title>Different title</title>
    <meta content="Different description" name="description">
    <link href="https://www.hexoprint.fr/prestations" rel="canonical">
    <script type="application/ld+json">{"@context":"https://schema.org"}</script>
  </head><body><h1>Services</h1><main>${'Texte '.repeat(50)}<a href="/">A</a><a href="/blog">B</a><a href="/contact">C</a></main></body></html>`;
  const errors = auditHtml(html, {
    path: '/prestations',
    canonical: 'https://www.hexoprint.fr/prestations',
    title: 'Expected title',
    description: 'Expected description',
  });
  assert.doesNotMatch(errors.join('\n'), /missing meta description|invalid canonical/i);
  assert.match(errors.join('\n'), /title does not match registry/i);
  assert.match(errors.join('\n'), /description does not match registry/i);

  const unsafeJsonLd = auditHtml(html.replace('{"@context":"https://schema.org"}', '{"@context":"https://schema.org","name":"<\\/script>"}'), {
    path: '/prestations', canonical: 'https://www.hexoprint.fr/prestations',
  });
  assert.match(unsafeJsonLd.join('\n'), /invalid JSON-LD/i);
});

test('accepts Next-rendered entities, the root canonical URL, and serialized JSON-LD', () => {
  const html = `<!doctype html><html><head>
    <title>L&#x27;atelier Hexoprint | Hexo&#x27;print</title>
    <meta name="description" content="Une cr&#xE9;ation sur mesure">
    <link rel="canonical" href="https://www.hexoprint.fr">
    <script type="application/ld+json">[{\"@context\":\"https://schema.org\",\"name\":\"Hexoprint\"}]</script>
  </head><body><h1>Atelier</h1><main>${'Texte '.repeat(50)}<a href="/">A</a><a href="/blog">B</a><a href="/contact">C</a></main></body></html>`;
  const errors = auditHtml(html, {
    path: '/',
    canonical: 'https://www.hexoprint.fr/',
    title: "L'atelier Hexoprint",
    description: 'Une création sur mesure',
  });
  assert.doesNotMatch(errors.join('\n'), /invalid canonical|title does not match registry|description does not match registry|invalid JSON-LD/i);
});

test('accepts RSC-serialized JSON-LD without corrupting escaped quotes in values', () => {
  const html = String.raw`<html><head>
    <title>Page</title><meta name="description" content="Description">
    <link rel="canonical" href="https://www.hexoprint.fr/page">
    <script type="application/ld+json">{\"name\":\"Une valeur avec \\\"guillemets\\\"\"}</script>
  </head><body><h1>Page</h1><main>${'Texte '.repeat(50)}<a href="/">A</a><a href="/blog">B</a><a href="/contact">C</a></main></body></html>`;
  const errors = auditHtml(html, { path: '/page', canonical: 'https://www.hexoprint.fr/page' });
  assert.doesNotMatch(errors.join('\n'), /invalid JSON-LD/i);
});

test('rejects sitemap URLs outside the canonical registry and dynamic blog articles', () => {
  const sitemap = `<urlset>
    <url><loc>https://www.hexoprint.fr/</loc></url>
    <url><loc>https://www.hexoprint.fr/blog/article</loc></url>
    <url><loc>http://localhost:3000/contact</loc></url>
    <url><loc>https://www.hexoprint.fr/blog/article</loc></url>
  </urlset>`;
  const errors = validateSitemap(sitemap, ['/', '/contact']);
  assert.match(errors.join('\n'), /Missing sitemap URL: https:\/\/www\.hexoprint\.fr\/contact/);
  assert.match(errors.join('\n'), /invalid origin/i);
  assert.match(errors.join('\n'), /duplicate URL/i);
});

test('requires bot-specific robots directives and the six exact official llms links', () => {
  const robots = 'User-agent: OAI-SearchBot\nAllow: /\n\nUser-agent: ChatGPT-User\nAllow: /\n\nUser-agent: PerplexityBot\nDisallow: /admin/';
  const robotErrors = validateRobots(robots, ['/api/', '/admin/']);
  assert.match(robotErrors.join('\n'), /ChatGPT-User: missing Disallow: \/api\//);
  assert.match(robotErrors.join('\n'), /PerplexityBot: missing Allow: \//);

  const llmsErrors = validateLlms('https://www.hexoprint.fr/\nhttps://www.hexoprint.fr/contact', [
    '/', '/prestations', '/galerie', '/blog', '/a-propos', '/contact',
  ]);
  assert.match(llmsErrors.join('\n'), /llms\.txt: missing https:\/\/www\.hexoprint\.fr\/prestations/);
});

test('does not accept a URL with a matching prefix as an official llms link', () => {
  const errors = validateLlms('https://www.hexoprint.fr/contact-old', ['/contact']);
  assert.match(errors.join('\n'), /llms\.txt: missing https:\/\/www\.hexoprint\.fr\/contact/);
});

test('does not accept llms links with query strings or fragments as canonical links', () => {
  for (const suffix of ['?utm=x', '#section']) {
    const errors = validateLlms(`https://www.hexoprint.fr/contact${suffix}`, ['/contact']);
    assert.match(errors.join('\n'), /llms\.txt: missing https:\/\/www\.hexoprint\.fr\/contact/);
  }
});

test('rejects a page when any JSON-LD block is malformed', () => {
  const html = `<html><head>
    <title>Page</title><meta name="description" content="Description">
    <link rel="canonical" href="https://www.hexoprint.fr/page">
    <script type="application/ld+json">{"@context":"https://schema.org"}</script>
    <script type="application/ld+json">{"broken":</script>
  </head><body><h1>Page</h1><main>${'Texte '.repeat(50)}<a href="/">A</a><a href="/blog">B</a><a href="/contact">C</a></main></body></html>`;
  const errors = auditHtml(html, { path: '/page', canonical: 'https://www.hexoprint.fr/page' });
  assert.match(errors.join('\n'), /invalid JSON-LD/i);
});

test('rejects JSON-LD script closing sequences with whitespace or a slash', () => {
  const page = (name) => `<html><head>
    <title>Page</title><meta name="description" content="Description">
    <link rel="canonical" href="https://www.hexoprint.fr/page">
    <script type="application/ld+json">{"name":"${name}"}</script>
  </head><body><h1>Page</h1><main>${'Texte '.repeat(50)}<a href="/">A</a><a href="/blog">B</a><a href="/contact">C</a></main></body></html>`;
  for (const closingSequence of ['<\\/script >', '<\\/script/>']) {
    const errors = auditHtml(page(closingSequence), { path: '/page', canonical: 'https://www.hexoprint.fr/page' });
    assert.match(errors.join('\n'), /invalid JSON-LD/i);
  }
});
