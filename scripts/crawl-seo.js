// This CLI is intentionally CommonJS because it is executed directly by Node.
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { auditHtml } = require('./seo-validation-lib');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const pages = require('../src/data/seo-pages.json');

const localBaseUrl = process.env.SEO_BASE_URL || 'http://localhost:3000';
const productionBaseUrl = 'https://www.hexoprint.fr';
const blockedPaths = ['/api/', '/studio/', '/_vercel/', '/admin/'];
const requiredBots = ['OAI-SearchBot', 'ChatGPT-User', 'PerplexityBot'];

async function fetchText(url, timeoutMs = 10000) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, { signal: controller.signal });
    if (!response.ok) throw new Error(`${url}: HTTP ${response.status}`);
    return await response.text();
  } catch (error) {
    if (controller.signal.aborted) throw new Error(`${url}: timed out after ${timeoutMs}ms`);
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

function validateSitemap(sitemap, requiredPaths) {
  const errors = [];
  const urls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1].trim());
  const paths = [];
  const seenUrls = new Set();
  for (const url of urls) {
    if (seenUrls.has(url)) errors.push(`sitemap.xml: duplicate URL ${url}`);
    seenUrls.add(url);
    try {
      const parsed = new URL(url);
      if (parsed.origin !== productionBaseUrl) errors.push(`sitemap.xml: invalid origin ${url}`);
      if (!requiredPaths.includes(parsed.pathname) && !/^\/blog\/[^/]+$/.test(parsed.pathname)) {
        errors.push(`sitemap.xml: unsupported path ${parsed.pathname}`);
      }
      paths.push(parsed.pathname);
    } catch {
      errors.push(`sitemap.xml: invalid URL ${url}`);
    }
  }
  for (const path of requiredPaths) {
    const officialUrl = new URL(path, productionBaseUrl).toString();
    if (!seenUrls.has(officialUrl)) errors.push(`Missing sitemap URL: ${officialUrl}`);
  }
  return errors;
}

function getSitemapPaths(sitemap) {
  return [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].flatMap((match) => {
    try {
      return [new URL(match[1].trim()).pathname];
    } catch {
      return [];
    }
  });
}

function parseRobotsGroups(robots) {
  const groups = new Map();
  let agents = [];
  for (const rawLine of robots.split(/\r?\n/)) {
    const line = rawLine.replace(/#.*/, '').trim();
    if (!line) {
      agents = [];
      continue;
    }
    const match = line.match(/^(user-agent|allow|disallow)\s*:\s*(.*)$/i);
    if (!match) continue;
    const [, directive, value] = match;
    if (directive.toLowerCase() === 'user-agent') {
      agents.push(value.toLowerCase());
      if (!groups.has(value.toLowerCase())) groups.set(value.toLowerCase(), { allow: [], disallow: [] });
      continue;
    }
    for (const agent of agents) groups.get(agent)[directive.toLowerCase()].push(value);
  }
  return groups;
}

function validateRobots(robots, requiredBlockedPaths) {
  const errors = [];
  const groups = parseRobotsGroups(robots);
  for (const bot of requiredBots) {
    const rules = groups.get(bot.toLowerCase());
    if (!rules) {
      errors.push(`robots.txt: missing group for ${bot}`);
      continue;
    }
    if (!rules.allow.includes('/')) errors.push(`robots.txt: ${bot}: missing Allow: /`);
    for (const blockedPath of requiredBlockedPaths) {
      if (!rules.disallow.includes(blockedPath)) errors.push(`robots.txt: ${bot}: missing Disallow: ${blockedPath}`);
    }
  }
  return errors;
}

function validateLlms(llms, requiredPaths) {
  const urls = new Set(
    [...llms.matchAll(/https:\/\/www\.hexoprint\.fr[^\s<>'"\]\)]*/g)]
      .map((match) => new URL(match[0]).toString())
  );
  return requiredPaths.flatMap((path) => {
    const officialUrl = new URL(path, productionBaseUrl).toString();
    return urls.has(officialUrl) ? [] : [`llms.txt: missing ${officialUrl}`];
  });
}

async function main() {
  const errors = [];
  const registryPaths = pages.map((page) => page.path);
  let sitemapPaths = [];
  try {
    const sitemap = await fetchText(`${localBaseUrl}/sitemap.xml`);
    errors.push(...validateSitemap(sitemap, registryPaths));
    sitemapPaths = getSitemapPaths(sitemap);
  } catch (error) {
    errors.push(error instanceof Error ? error.message : String(error));
  }

  const paths = new Set([...registryPaths, ...sitemapPaths]);
  for (const path of paths) {
    try {
      const html = await fetchText(new URL(path, localBaseUrl));
      errors.push(...auditHtml(html, {
        path,
        canonical: new URL(path, productionBaseUrl).toString(),
        ...pages.find((page) => page.path === path),
      }));
    } catch (error) {
      errors.push(error instanceof Error ? error.message : String(error));
    }
  }

  try {
    errors.push(...validateRobots(await fetchText(`${localBaseUrl}/robots.txt`), blockedPaths));
  } catch (error) {
    errors.push(error instanceof Error ? error.message : String(error));
  }
  try {
    errors.push(...validateLlms(await fetchText(`${localBaseUrl}/llms.txt`), [
      '/', '/prestations', '/galerie', '/blog', '/a-propos', '/contact',
    ]));
  } catch (error) {
    errors.push(error instanceof Error ? error.message : String(error));
  }

  if (errors.length) {
    console.error(errors.join('\n'));
    process.exitCode = 1;
  } else {
    console.log(`SEO crawl passed for ${paths.size} pages`);
  }
}

if (require.main === module) main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

module.exports = { fetchText, validateLlms, validateRobots, validateSitemap };
