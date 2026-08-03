// This CLI is intentionally CommonJS because it is executed directly by Node.
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { auditHtml } = require('./seo-validation-lib');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const pages = require('../src/data/seo-pages.json');

const localBaseUrl = process.env.SEO_BASE_URL || 'http://localhost:3000';
const productionBaseUrl = 'https://www.hexoprint.fr';

async function fetchText(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`${url}: HTTP ${response.status}`);
  return response.text();
}

async function main() {
  const errors = [];
  const sitemap = await fetchText(`${localBaseUrl}/sitemap.xml`);
  const sitemapPaths = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)]
    .map((match) => new URL(match[1]).pathname);
  const paths = new Set([...pages.map((page) => page.path), ...sitemapPaths]);

  for (const path of paths) {
    try {
      const html = await fetchText(new URL(path, localBaseUrl));
      errors.push(...auditHtml(html, {
        path,
        canonical: new URL(path, productionBaseUrl).toString(),
      }));
    } catch (error) {
      errors.push(error instanceof Error ? error.message : String(error));
    }
  }

  const robots = await fetchText(`${localBaseUrl}/robots.txt`);
  for (const bot of ['OAI-SearchBot', 'ChatGPT-User', 'PerplexityBot']) {
    if (!robots.includes(bot)) errors.push(`robots.txt: missing ${bot}`);
  }

  const llms = await fetchText(`${localBaseUrl}/llms.txt`);
  for (const page of pages.filter(({ priority }) => priority >= 0.7)) {
    const officialUrl = new URL(page.path, productionBaseUrl).toString();
    if (!llms.includes(officialUrl)) errors.push(`llms.txt: missing ${officialUrl}`);
  }

  if (errors.length) {
    console.error(errors.join('\n'));
    process.exitCode = 1;
  } else {
    console.log(`SEO crawl passed for ${paths.size} pages`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
