function validatePageRegistry(pages, requiredPaths) {
  const errors = [];
  const counts = new Map();
  for (const page of pages) counts.set(page.path, (counts.get(page.path) || 0) + 1);
  for (const [path, count] of counts) if (count > 1) errors.push(`Duplicate path: ${path}`);
  for (const path of requiredPaths) if (!counts.has(path)) errors.push(`Missing path: ${path}`);
  for (const page of pages) {
    if (!page.title || page.title.length > 60) errors.push(`Invalid title: ${page.path}`);
    if (!page.description || page.description.length > 160) errors.push(`Invalid description: ${page.path}`);
  }
  return errors;
}

function auditHtml(html, expected) {
  const errors = [];
  const title = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.trim();
  const description = html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i)?.[1];
  const canonical = html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']*)["']/i)?.[1];
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
  if (renderedText.length < 200) errors.push(`${expected.path}: insufficient server-rendered text`);
  if (internalLinks.size < 3) errors.push(`${expected.path}: insufficient internal links`);
  return errors;
}

module.exports = { auditHtml, validatePageRegistry };
