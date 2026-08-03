function validatePageRegistry(pages, requiredPaths) {
  const errors = [];
  const pathCounts = new Map();
  const keyCounts = new Map();
  const allowedFrequencies = new Set(['always', 'hourly', 'daily', 'weekly', 'monthly', 'yearly', 'never']);
  const requiredPathSet = new Set(requiredPaths);
  for (const page of pages) {
    pathCounts.set(page.path, (pathCounts.get(page.path) || 0) + 1);
    if (page.key) keyCounts.set(page.key, (keyCounts.get(page.key) || 0) + 1);
  }
  for (const [path, count] of pathCounts) if (count > 1) errors.push(`Duplicate path: ${path}`);
  for (const [key, count] of keyCounts) if (count > 1) errors.push(`Duplicate key: ${key}`);
  for (const path of requiredPaths) if (!pathCounts.has(path)) errors.push(`Missing path: ${path}`);
  for (const page of pages) {
    if (!page.title || page.title.length > 60) errors.push(`Invalid title: ${page.path}`);
    if (!page.description || page.description.length > 160) errors.push(`Invalid description: ${page.path}`);
    if (typeof page.key !== 'string' || !page.key.trim()) errors.push(`Invalid key: ${page.path}`);
    if (!isValidPath(page.path)) errors.push(`Invalid path: ${page.path}`);
    if (!requiredPathSet.has(page.path)) errors.push(`Unexpected path: ${page.path}`);
    if (typeof page.priority !== 'number' || page.priority < 0 || page.priority > 1) errors.push(`Invalid priority: ${page.path}`);
    if (!allowedFrequencies.has(page.changeFrequency)) errors.push(`Invalid change frequency: ${page.path}`);
  }
  return errors;
}

function isValidPath(path) {
  return typeof path === 'string'
    && path.startsWith('/')
    && !path.startsWith('//')
    && !/[?#]/.test(path)
    && (path === '/' || !path.endsWith('/'))
    && !path.split('/').some((segment) => segment === '.' || segment === '..');
}

function parseAttributes(tag) {
  const attributes = {};
  for (const match of tag.matchAll(/([\w:-]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g)) {
    const [, name, doubleQuoted, singleQuoted, unquoted] = match;
    if (name.toLowerCase() !== 'meta' && name.toLowerCase() !== 'link' && name.toLowerCase() !== 'script') {
      attributes[name.toLowerCase()] = doubleQuoted ?? singleQuoted ?? unquoted ?? '';
    }
  }
  return attributes;
}

function auditHtml(html, expected) {
  const errors = [];
  const title = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.trim();
  const description = [...html.matchAll(/<meta\b[^>]*>/gi)]
    .map((match) => parseAttributes(match[0]))
    .find((attributes) => attributes.name?.toLowerCase() === 'description')?.content;
  const canonical = [...html.matchAll(/<link\b[^>]*>/gi)]
    .map((match) => parseAttributes(match[0]))
    .find((attributes) => attributes.rel?.toLowerCase().split(/\s+/).includes('canonical'))?.href;
  const h1Count = (html.match(/<h1\b/gi) || []).length;
  const mainHtml = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i)?.[1] || '';
  const renderedText = mainHtml.replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  const internalLinks = new Set(
    [...html.matchAll(/href=["']\/(?!\/)([^"'#?]*)/gi)]
      .map((match) => `/${match[1]}`)
  );
  if (!title) errors.push(`${expected.path}: missing title`);
  if (!description) errors.push(`${expected.path}: missing meta description`);
  if (canonical !== expected.canonical) errors.push(`${expected.path}: invalid canonical`);
  if (h1Count !== 1) errors.push(`${expected.path}: expected exactly one h1, got ${h1Count}`);
  if (title && title.length > 60) errors.push(`${expected.path}: title is longer than 60 characters`);
  if (description && description.length > 160) errors.push(`${expected.path}: description is longer than 160 characters`);
  if (expected.title && title !== expected.title) errors.push(`${expected.path}: title does not match registry`);
  if (expected.description && description !== expected.description) errors.push(`${expected.path}: description does not match registry`);
  const jsonLdScripts = [...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)]
    .filter((match) => parseAttributes(match[0]).type?.toLowerCase() === 'application/ld+json');
  const validJsonLd = jsonLdScripts.some((match) => {
    try {
      const data = JSON.parse(match[1]);
      return !JSON.stringify(data).toLowerCase().includes('</script>');
    } catch {
      return false;
    }
  });
  if (!validJsonLd) errors.push(`${expected.path}: invalid JSON-LD`);
  if (renderedText.length < 200) errors.push(`${expected.path}: insufficient server-rendered text`);
  if (internalLinks.size < 3) errors.push(`${expected.path}: insufficient internal links`);
  return errors;
}

module.exports = { auditHtml, validatePageRegistry };
