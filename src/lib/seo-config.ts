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

const STATIC_SEO_PAGE_PATHS = [
    '/',
    '/prestations',
    '/contact',
    '/a-propos',
    '/galerie',
    '/blog',
    '/mentions-legales',
    '/politique-confidentialite',
] as const;

export type StaticPagePath = (typeof STATIC_SEO_PAGE_PATHS)[number];
export type ReadonlyStaticSeoPage = Readonly<StaticSeoPage>;

function validateAndFreezeStaticSeoPages(
    pages: readonly StaticSeoPage[],
): readonly ReadonlyStaticSeoPage[] {
    const expectedPaths = new Set<StaticPagePath>(STATIC_SEO_PAGE_PATHS);
    const foundPaths = new Set<StaticPagePath>();

    const frozenPages = pages.map((page) => {
        const path = page.path as StaticPagePath;

        if (!expectedPaths.has(path)) {
            throw new Error(`Unexpected SEO configuration for ${page.path}`);
        }

        if (foundPaths.has(path)) {
            throw new Error(`Duplicate SEO configuration for ${path}`);
        }

        foundPaths.add(path);
        return Object.freeze({ ...page });
    });

    for (const path of STATIC_SEO_PAGE_PATHS) {
        if (!foundPaths.has(path)) {
            throw new Error(`Missing SEO configuration for ${path}`);
        }
    }

    return Object.freeze(frozenPages);
}

export const STATIC_SEO_PAGES = validateAndFreezeStaticSeoPages(
    pageData as StaticSeoPage[],
);

export function getStaticSeoPage(
    path: StaticPagePath,
): ReadonlyStaticSeoPage {
    const page = STATIC_SEO_PAGES.find((candidate) => candidate.path === path);
    if (!page) throw new Error(`Missing SEO configuration for ${path}`);
    return page;
}
