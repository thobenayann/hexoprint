# Hexoprint SEO and AI Discoverability Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Corriger les défauts SEO techniques d’Hexoprint et fournir aux moteurs comme aux agents IA un contenu canonique, structuré, explorable et vérifiable.

**Architecture:** Un registre JSON unique porte les métadonnées et routes statiques afin d’alimenter les pages, le sitemap et le validateur sans duplication. Les données dynamiques Sanity conservent leurs dates réelles, tandis qu’un crawl local contrôle le HTML effectivement rendu.

**Tech Stack:** Next.js 16 Metadata API, TypeScript, JSON-LD Schema.org, Node.js test runner, scripts de crawl basés sur `fetch`.

## Global Constraints

- L’URL canonique est `https://www.hexoprint.fr`.
- Les titres statiques visent 50–60 caractères au maximum une fois le suffixe de marque appliqué ; les descriptions visent environ 140–160 caractères sans couper une information essentielle.
- Chaque page publique indexable possède un titre, une description, une canonique et exactement un H1 principal.
- Les dates `lastmod` doivent provenir d’une modification réelle ; si aucune date fiable n’existe, omettre la propriété.
- Les données structurées doivent refléter uniquement des informations visibles ou présentes dans `COMPANY_INFO`.
- `llms.txt` est un index complémentaire et ne remplace pas `robots.txt`, le sitemap ou les métadonnées.
- Conserver la politique générale d’exploration permissive et expliciter OAI-SearchBot, ChatGPT-User et PerplexityBot.
- Ne réaliser aucun déploiement Vercel dans ce plan.

---

## File Structure

- Create: `src/data/seo-pages.json` — copie SEO et configuration sitemap des pages statiques.
- Create: `src/lib/seo-config.ts` — types et accès au registre JSON.
- Modify: `src/lib/seo-utils.ts` — génération Metadata et JSON-LD sans double marque.
- Create: `src/components/seo/structured-data.tsx` — rendu JSON-LD sécurisé et réutilisable.
- Modify: `src/app/layout.tsx` — métadonnées globales et graphe d’entités racine.
- Modify: `src/app/(client)/**/page.tsx` — adoption du registre et suppression des JSON-LD dupliqués.
- Modify: `src/app/(client)/a-propos/constants.ts` — retrait de la copie SEO devenue dupliquée.
- Modify: `src/app/sitemap.ts` — routes uniques, contact inclus, dates réelles.
- Modify: `src/app/robots.ts` — règles explicites pour moteurs et agents IA.
- Create: `public/llms.txt` — index éditorial destiné aux agents.
- Create: `scripts/seo-validation-lib.js` — règles pures testables.
- Create: `scripts/seo-validation.test.js` — tests de régression SEO.
- Modify: `scripts/validate-seo.js` — validation statique fondée sur le registre.
- Create: `scripts/crawl-seo.js` — audit du HTML rendu localement.
- Modify: `package.json` — scripts `seo:test` et `seo:crawl`.
- Create: `docs/audits/2026-08-01-seo-ai-audit.md` — preuves et observations finales.

### Task 1: Créer le registre SEO unique

**Files:**

- Create: `src/data/seo-pages.json`
- Create: `src/lib/seo-config.ts`
- Modify: `src/lib/seo-utils.ts`

**Interfaces:**

- Produces: `STATIC_SEO_PAGES: readonly StaticSeoPage[]` et `getStaticSeoPage(path: StaticPagePath): StaticSeoPage`.
- Produces: `generateSEOMetadata(config: SEOConfig): Metadata` qui retourne un titre non suffixé ; le template racine ajoute la marque une seule fois.
- Produces: `truncateMetadataText(value: string, maxLength: number): string` pour les contenus Sanity dynamiques.

- [ ] **Step 1: Écrire le registre des pages**

Créer `src/data/seo-pages.json` avec ce contenu :

```json
[
  {
    "key": "home",
    "path": "/",
    "title": "Impression 3D sur mesure à Seysses (31)",
    "description": "Hexoprint réalise vos prototypes, pièces de remplacement et créations en impression 3D à Seysses, près de Toulouse. Devis personnalisé.",
    "changeFrequency": "weekly",
    "priority": 1
  },
  {
    "key": "services",
    "path": "/prestations",
    "title": "Prestations d’impression 3D sur mesure",
    "description": "Prototypage, pièces techniques, réparation et créations sur mesure en impression 3D pour particuliers et professionnels près de Toulouse.",
    "changeFrequency": "monthly",
    "priority": 0.9
  },
  {
    "key": "contact",
    "path": "/contact",
    "title": "Contact et devis d’impression 3D",
    "description": "Décrivez votre projet d’impression 3D à Hexoprint et recevez un devis personnalisé. Atelier à Seysses, près de Toulouse.",
    "changeFrequency": "monthly",
    "priority": 0.8
  },
  {
    "key": "about",
    "path": "/a-propos",
    "title": "À propos de l’atelier Hexoprint",
    "description": "Découvrez l’atelier Hexoprint à Seysses, ses méthodes, ses matériaux et son accompagnement pour vos projets d’impression 3D sur mesure.",
    "changeFrequency": "monthly",
    "priority": 0.7
  },
  {
    "key": "gallery",
    "path": "/galerie",
    "title": "Galerie de réalisations en impression 3D",
    "description": "Parcourez les pièces, prototypes et créations réalisés par Hexoprint en impression 3D à Seysses, près de Toulouse.",
    "changeFrequency": "weekly",
    "priority": 0.7
  },
  {
    "key": "blog",
    "path": "/blog",
    "title": "Conseils et guides sur l’impression 3D",
    "description": "Conseils, guides techniques et retours d’expérience d’Hexoprint pour mieux préparer et réussir vos projets d’impression 3D.",
    "changeFrequency": "weekly",
    "priority": 0.7
  },
  {
    "key": "legal",
    "path": "/mentions-legales",
    "title": "Mentions légales",
    "description": "Consultez les mentions légales du site Hexoprint, atelier d’impression 3D situé à Seysses en Haute-Garonne.",
    "changeFrequency": "yearly",
    "priority": 0.2
  },
  {
    "key": "privacy",
    "path": "/politique-confidentialite",
    "title": "Politique de confidentialité",
    "description": "Consultez la politique de confidentialité d’Hexoprint et les informations relatives au traitement des données et aux outils de mesure.",
    "changeFrequency": "yearly",
    "priority": 0.2
  }
]
```

- [ ] **Step 2: Ajouter les types et l’accès strict**

Créer `src/lib/seo-config.ts` :

```ts
import pageData from '@/data/seo-pages.json';
import type { MetadataRoute } from 'next';

export type StaticSeoPage = {
  key: string;
  path: `/${string}` | '/';
  title: string;
  description: string;
  changeFrequency: NonNullable<
    MetadataRoute.Sitemap[number]['changeFrequency']
  >;
  priority: number;
};

export const STATIC_SEO_PAGES = pageData as readonly StaticSeoPage[];
export type StaticPagePath = (typeof STATIC_SEO_PAGES)[number]['path'];

export function getStaticSeoPage(path: StaticPagePath): StaticSeoPage {
  const page = STATIC_SEO_PAGES.find((candidate) => candidate.path === path);
  if (!page) throw new Error(`Missing SEO configuration for ${path}`);
  return page;
}
```

- [ ] **Step 3: Faire échouer le contrôle du double branding**

Run: `rg -n "fullTitle|\| \$\{COMPANY_INFO\.name\}|- \$\{COMPANY_INFO\.name\}" src/lib/seo-utils.ts src/app`

Expected: plusieurs correspondances, notamment `fullTitle` dans `src/lib/seo-utils.ts`.

- [ ] **Step 4: Corriger `generateSEOMetadata`**

Dans `src/lib/seo-utils.ts`, supprimer `fullTitle` et retourner le titre brut :

```ts
const canonical = new URL(path || '/', COMPANY_INFO.siteUrl).toString();

return {
  title,
  description,
  keywords: [...new Set([...baseKeywords, ...keywords])],
  alternates: { canonical },
  robots: noIndex ? { index: false, follow: false } : { index: true, follow: true },
  openGraph: {
    type,
    locale: 'fr_FR',
    siteName: COMPANY_INFO.name,
    url: canonical,
    title,
    description,
    images: [{ url: image, width: 1200, height: 628, alt: title }],
    ...(type === 'article' && publishedTime ? { publishedTime, authors } : {}),
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: [image],
  },
};
```

Ajouter également ce helper, qui conserve les textes courts et coupe les contenus Sanity à une limite déterministe :

```ts
export function truncateMetadataText(value: string, maxLength: number) {
  const normalized = value.replace(/\s+/g, ' ').trim();
  if (normalized.length <= maxLength) return normalized;
  const slice = normalized.slice(0, maxLength - 1);
  const wordBoundary = slice.lastIndexOf(' ');
  const truncated = wordBoundary >= Math.floor(maxLength * 0.6)
    ? slice.slice(0, wordBoundary)
    : slice;
  return `${truncated.trimEnd()}…`;
}
```

- [ ] **Step 5: Vérifier les types**

Run: `pnpm typecheck`

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/data/seo-pages.json src/lib/seo-config.ts src/lib/seo-utils.ts
git commit -m "feat: centralize SEO page configuration"
```

### Task 2: Appliquer les métadonnées et corriger la structure sémantique

**Files:**

- Modify: `src/app/layout.tsx`
- Modify: `src/app/(client)/page.tsx`
- Modify: `src/app/(client)/prestations/page.tsx`
- Modify: `src/app/(client)/contact/page.tsx`
- Modify: `src/app/(client)/a-propos/page.tsx`
- Modify: `src/app/(client)/a-propos/constants.ts`
- Modify: `src/app/(client)/galerie/page.tsx`
- Modify: `src/app/(client)/blog/page.tsx`
- Modify: `src/app/(client)/blog/[slug]/page.tsx`
- Modify: `src/app/(client)/mentions-legales/page.tsx`
- Modify: `src/app/(client)/politique-confidentialite/page.tsx`

**Interfaces:**

- Consumes: `getStaticSeoPage()` et `generateSEOMetadata()` de la Task 1.
- Produces: métadonnées statiques uniformes, article dynamique sans suffixe dupliqué et H1 visible sur `/prestations`.

- [ ] **Step 1: Configurer le template de titre racine**

Dans `src/app/layout.tsx`, utiliser la page d’accueil du registre :

```ts
const homeSeo = getStaticSeoPage('/');

export const metadata: Metadata = {
  metadataBase: new URL(COMPANY_INFO.siteUrl),
  title: {
    default: `${homeSeo.title} | ${COMPANY_INFO.name}`,
    template: `%s | ${COMPANY_INFO.name}`,
  },
  description: homeSeo.description,
  alternates: { canonical: COMPANY_INFO.siteUrl },
};
```

Conserver les champs globaux utiles existants — robots, vérification, icônes, Open Graph et Twitter — mais alimenter leur titre et description avec `homeSeo`.

- [ ] **Step 2: Utiliser le registre sur chaque page statique**

Pour chaque page, remplacer l’objet Metadata écrit à la main par ce motif, avec le chemin correspondant :

```ts
const seo = getStaticSeoPage('/prestations');

export const metadata = generateSEOMetadata({
  title: seo.title,
  description: seo.description,
  path: seo.path,
});
```

Appliquer exactement les chemins `/`, `/prestations`, `/contact`, `/a-propos`, `/galerie`, `/blog`, `/mentions-legales` et `/politique-confidentialite`. Retirer `ABOUT_PAGE_SEO` de `a-propos/constants.ts` après son dernier usage.

- [ ] **Step 3: Corriger les métadonnées d’article**

Importer `truncateMetadataText` avec `generateSEOMetadata` depuis `@/lib/seo-utils`, puis faire retourner :

```ts
return generateSEOMetadata({
  title: truncateMetadataText(article.title, 45),
  description: truncateMetadataText(description, 155),
  path: `/blog/${slug}`,
  image: imageUrl,
  type: 'article',
  publishedTime: article.publishedAt,
  authors: [article.author?.name || COMPANY_INFO.founder],
});
```

Conserver la branche `notFound` ou `noIndex` existante lorsque l’article n’existe pas.

- [ ] **Step 4: Ajouter le H1 visible de Prestations**

Au début du `<main>` de `src/app/(client)/prestations/page.tsx`, ajouter :

```tsx
<header className="container mx-auto px-4 pt-24 pb-10 text-center">
  <h1 className="font-orbitron text-3xl font-bold tracking-tight md:text-5xl">
    Prestations d’impression 3D sur mesure
  </h1>
  <p className="mx-auto mt-4 max-w-3xl text-muted-foreground md:text-lg">
    Prototypage, réparation et fabrication de pièces personnalisées pour les
    particuliers et les professionnels près de Toulouse.
  </p>
</header>
```

- [ ] **Step 5: Contrôler les H1 et l’absence de double marque**

Run: `rg -n "<h1|fullTitle|\| Hexo'print \| Hexo'print" "src/app/(client)" src/lib/seo-utils.ts`

Expected: chaque route publique rend un H1 via sa page ou son composant Hero ; aucune occurrence de `fullTitle` ni double marque.

- [ ] **Step 6: Vérifier la compilation**

Run: `pnpm typecheck && pnpm build`

Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add src/app/layout.tsx "src/app/(client)" src/lib/seo-utils.ts
git commit -m "feat: normalize metadata and page headings"
```

### Task 3: Corriger le sitemap et expliciter l’exploration IA

**Files:**

- Modify: `src/app/sitemap.ts`
- Modify: `src/app/robots.ts`
- Create: `public/llms.txt`

**Interfaces:**

- Consumes: `STATIC_SEO_PAGES`, les requêtes Sanity existantes et `COMPANY_INFO.siteUrl`.
- Produces: sitemap sans doublons, robots explicite et `/llms.txt` statique.

- [ ] **Step 1: Remplacer les routes statiques du sitemap**

Dans `src/app/sitemap.ts`, retirer `NavigationService.getActiveRoutes()`, `now` pour les pages statiques et les entrées d’index dupliquées. Après les requêtes Sanity, construire une table de dates uniquement lorsqu’une date réelle existe, puis mapper chaque route du registre une seule fois :

```ts
const lastModifiedByPath = new Map<string, Date>();
if (articles[0]?._updatedAt) {
  lastModifiedByPath.set('/blog', new Date(articles[0]._updatedAt));
}
if (gallery[0]?._updatedAt) {
  lastModifiedByPath.set('/galerie', new Date(gallery[0]._updatedAt));
}

const staticPages: MetadataRoute.Sitemap = STATIC_SEO_PAGES.map(
  ({ path, changeFrequency, priority }) => ({
    url: new URL(path, COMPANY_INFO.siteUrl).toString(),
    changeFrequency,
    priority,
    ...(lastModifiedByPath.has(path)
      ? { lastModified: lastModifiedByPath.get(path) }
      : {}),
  })
);
```

Mapper ensuite uniquement les articles avec `article._updatedAt || article.publishedAt`. En cas d’échec Sanity, retourner les huit `staticPages`, dont `/blog`, `/galerie` et `/contact`, sans `lastmod` inventé.

- [ ] **Step 2: Dédupliquer défensivement le résultat**

Avant le retour final, appliquer :

```ts
const uniquePages = new Map<string, MetadataRoute.Sitemap[number]>();
for (const page of [...staticPages, ...blogPages]) {
  uniquePages.set(page.url, page);
}
return [...uniquePages.values()].sort(
  (a, b) => (b.priority ?? 0) - (a.priority ?? 0)
);
```

- [ ] **Step 3: Expliciter les agents de recherche**

Dans `src/app/robots.ts`, conserver la branche non-production `Disallow: /`. Pour la production, utiliser :

```ts
const blockedPaths = [
  '/api/',
  '/studio/',
  '/_vercel/',
  '/admin/',
];

const explicitSearchBots = [
  'Googlebot',
  'Bingbot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'PerplexityBot',
];

return {
  rules: [
    { userAgent: '*', allow: '/', disallow: blockedPaths },
    ...explicitSearchBots.map((userAgent) => ({ userAgent, allow: '/' })),
  ],
  sitemap: `${baseUrl}/sitemap.xml`,
  host: baseUrl,
};
```

Ne pas ajouter de règle concernant GPTBot ou ClaudeBot sans décision séparée sur l’entraînement.

- [ ] **Step 4: Ajouter `llms.txt`**

Créer `public/llms.txt` :

```markdown
# Hexo'print

> Atelier d’impression 3D sur mesure à Seysses, près de Toulouse, pour particuliers et professionnels.

Le site officiel https://www.hexoprint.fr est la source de référence pour les informations sur Hexo'print.

## Pages principales

- [Accueil](https://www.hexoprint.fr/)
- [Prestations](https://www.hexoprint.fr/prestations)
- [Galerie](https://www.hexoprint.fr/galerie)
- [Conseils et guides](https://www.hexoprint.fr/blog)
- [À propos](https://www.hexoprint.fr/a-propos)
- [Contact et demande de devis](https://www.hexoprint.fr/contact)

## Informations officielles

- Activité : prototypage, réparation et fabrication de pièces personnalisées en impression 3D.
- Localisation : Seysses, Haute-Garonne, France.
- Contact : https://www.hexoprint.fr/contact
- Sitemap : https://www.hexoprint.fr/sitemap.xml
```

- [ ] **Step 5: Vérifier les fichiers spéciaux**

Run: `pnpm typecheck && pnpm build`

Expected: PASS ; la sortie Next contient `/robots.txt`, `/sitemap.xml` et le fichier public `/llms.txt`.

- [ ] **Step 6: Commit**

```bash
git add src/app/sitemap.ts src/app/robots.ts public/llms.txt
git commit -m "feat: improve sitemap and AI crawler discovery"
```

### Task 4: Consolider les données structurées

**Files:**

- Create: `src/components/seo/structured-data.tsx`
- Modify: `src/lib/seo-utils.ts`
- Modify: `src/app/layout.tsx`
- Modify: `src/app/(client)/a-propos/page.tsx`
- Modify: `src/app/(client)/prestations/page.tsx`
- Modify: `src/app/(client)/contact/page.tsx`
- Modify: `src/app/(client)/galerie/page.tsx`
- Modify: `src/app/(client)/blog/page.tsx`
- Modify: `src/app/(client)/blog/[slug]/page.tsx`

**Interfaces:**

- Produces: `StructuredData({ id, data })`, `generateLocalBusinessStructuredData()`, `generateWebSiteStructuredData()`, `generateArticleStructuredData()`, `generateServiceStructuredData()` et `generateBreadcrumbStructuredData()`.
- Consumes: uniquement `COMPANY_INFO` et les propriétés visibles des contenus Sanity.

- [ ] **Step 1: Ajouter le composant JSON-LD sécurisé**

Créer `src/components/seo/structured-data.tsx` :

```tsx
type StructuredDataProps = {
  id: string;
  data: Record<string, unknown> | Array<Record<string, unknown>>;
};

export function StructuredData({ id, data }: StructuredDataProps) {
  const json = JSON.stringify(data).replace(/</g, '\\u003c');
  return (
    <script
      id={id}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
```

- [ ] **Step 2: Stabiliser les identifiants d’entités**

Dans `src/lib/seo-utils.ts`, utiliser ces identifiants dans les générateurs :

```ts
export const BUSINESS_ID = `${COMPANY_INFO.siteUrl}/#business`;
export const WEBSITE_ID = `${COMPANY_INFO.siteUrl}/#website`;

// LocalBusiness
{ '@id': BUSINESS_ID, url: COMPANY_INFO.siteUrl }

// WebSite
{
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': WEBSITE_ID,
  url: COMPANY_INFO.siteUrl,
  name: COMPANY_INFO.name,
  publisher: { '@id': BUSINESS_ID },
  inLanguage: 'fr-FR',
}
```

Retirer `paymentAccepted`, `currenciesAccepted`, `priceRange` et toute valeur non présente dans `COMPANY_INFO` ou le contenu visible. Conserver l’adresse, le téléphone, l’e-mail, le fondateur, les horaires, la zone de service et Instagram lorsqu’ils proviennent de `COMPANY_INFO`.

Ajouter le générateur de fil d’Ariane :

```ts
export function generateBreadcrumbStructuredData(
  items: Array<{ name: string; url: string }>
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
```

- [ ] **Step 3: Rendre le graphe racine une seule fois**

Dans `src/app/layout.tsx`, rendre :

```tsx
<StructuredData
  id="hexoprint-entities"
  data={[
    generateLocalBusinessStructuredData(),
    generateWebSiteStructuredData(),
  ]}
/>
```

Le placer dans `<body>` avant les scripts Analytics.

- [ ] **Step 4: Remplacer les JSON-LD inline des pages**

Sur Prestations, utiliser `generateServiceStructuredData`. Sur les articles, utiliser `generateArticleStructuredData`. Sur les pages À propos, Galerie et Blog, supprimer les copies inline de LocalBusiness et référencer `{'@id': BUSINESS_ID}` depuis les schémas spécifiques lorsque nécessaire.

Sur `/prestations`, `/contact`, `/a-propos`, `/galerie`, `/blog` et chaque article, rendre un `BreadcrumbList` contenant l’accueil puis la page courante. Un article contient trois niveaux : Accueil, Blog, puis son titre. Les URLs sont construites avec `new URL(path, COMPANY_INFO.siteUrl).toString()`.

- [ ] **Step 5: Vérifier la syntaxe et la compilation**

Run: `pnpm typecheck && pnpm build`

Expected: PASS ; chaque bloc `application/ld+json` est produit par `StructuredData` et contient un JSON parseable.

- [ ] **Step 6: Commit**

```bash
git add src/components/seo/structured-data.tsx src/lib/seo-utils.ts src/app/layout.tsx "src/app/(client)"
git commit -m "feat: consolidate structured data entities"
```

### Task 5: Transformer le validateur SEO en tests de régression

**Files:**

- Create: `scripts/seo-validation-lib.js`
- Create: `scripts/seo-validation.test.js`
- Modify: `scripts/validate-seo.js`
- Create: `scripts/crawl-seo.js`
- Modify: `package.json`

**Interfaces:**

- Produces: `validatePageRegistry(pages, requiredPaths): string[]`.
- Produces: `auditHtml(html, expected): string[]`.
- Consumes: `src/data/seo-pages.json` et une URL de base fournie par `SEO_BASE_URL`.

- [ ] **Step 1: Écrire les tests qui reproduisent les défauts actuels**

Créer `scripts/seo-validation.test.js` :

```js
const test = require('node:test');
const assert = require('node:assert/strict');
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
```

- [ ] **Step 2: Vérifier que les tests échouent avant la bibliothèque**

Run: `node --test scripts/seo-validation.test.js`

Expected: FAIL avec `Cannot find module './seo-validation-lib'`.

- [ ] **Step 3: Implémenter les règles pures**

Créer `scripts/seo-validation-lib.js` avec les exports suivants :

```js
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
```

- [ ] **Step 4: Faire passer les tests**

Run: `node --test scripts/seo-validation.test.js`

Expected: 2 tests PASS.

- [ ] **Step 5: Brancher le validateur statique et le crawl**

Faire lire `src/data/seo-pages.json` à `scripts/validate-seo.js`, appeler `validatePageRegistry` avec les huit chemins du registre et vérifier l’existence de `public/llms.txt`. Créer `scripts/crawl-seo.js` pour :

1. lire le même registre ;
2. récupérer `/sitemap.xml` et extraire toutes les valeurs `<loc>`, y compris les articles dynamiques ;
3. unir ces URLs aux huit routes du registre ;
4. récupérer chaque chemin depuis `process.env.SEO_BASE_URL || 'http://localhost:3000'` ;
5. exiger un HTTP 200 et appeler `auditHtml` avec l’URL `https://www.hexoprint.fr` équivalente comme canonique ;
6. vérifier que `robots.txt` autorise OAI-SearchBot, ChatGPT-User et PerplexityBot et que `llms.txt` contient les six liens officiels ;
7. terminer avec le code 1 si une erreur est collectée.

Le cœur de `scripts/crawl-seo.js` doit suivre cette implémentation :

```js
const { auditHtml } = require('./seo-validation-lib');
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
```

Ajouter dans `package.json` :

```json
{
  "scripts": {
    "seo:test": "node --test scripts/seo-validation.test.js",
    "seo:crawl": "node scripts/crawl-seo.js"
  }
}
```

- [ ] **Step 6: Vérifier le validateur renforcé**

Run: `pnpm seo:test && pnpm seo:validate`

Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add scripts/seo-validation-lib.js scripts/seo-validation.test.js scripts/validate-seo.js scripts/crawl-seo.js package.json
git commit -m "test: add SEO registry and crawl validation"
```

### Task 6: Valider le rendu de production local et documenter l’audit

**Files:**

- Create: `docs/audits/2026-08-01-seo-ai-audit.md`

**Interfaces:**

- Consumes: build Next.js final et scripts de la Task 5.
- Produces: preuve de conformité SEO/IA avant toute Preview Vercel.

- [ ] **Step 1: Construire la version de production**

Run: `pnpm verify && pnpm seo:test`

Expected: PASS.

- [ ] **Step 2: Démarrer le serveur local**

Run dans un terminal dédié : `pnpm start`

Expected: serveur prêt sur `http://localhost:3000`.

- [ ] **Step 3: Crawler le rendu réel**

Run dans un second terminal : `pnpm seo:crawl`

Expected: toutes les pages statiques et tous les articles présents dans le sitemap répondent 200 avec une canonique `www`, une description et exactement un H1 ; robots, sitemap et `llms.txt` répondent 200.

- [ ] **Step 4: Inspecter le sitemap généré**

Run: `Invoke-WebRequest http://localhost:3000/sitemap.xml | Select-Object -ExpandProperty Content`

Expected: une seule occurrence de `/blog` et `/galerie`, une occurrence de `/contact`, aucune date du jour inventée pour les pages statiques.

- [ ] **Step 5: Rédiger le rapport SEO/IA**

Créer le document avec ces sections exactes :

```markdown
# Audit SEO et découvrabilité IA — 1er août 2026

## Synthèse exécutive
## Routes et indexabilité
## Métadonnées et structure sémantique
## Sitemap et robots
## Données structurées
## Découvrabilité par les agents IA
## Résultats du crawl local
## Limites et actions après déploiement
```

Mentionner que `llms.txt` est complémentaire, que les règles explicites n’impliquent aucune garantie de citation, et que la validation de l’indexation réelle devra être refaite après déploiement.

- [ ] **Step 6: Commit**

```bash
git add docs/audits/2026-08-01-seo-ai-audit.md
git commit -m "docs: record SEO and AI discoverability audit"
```
