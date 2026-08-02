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
