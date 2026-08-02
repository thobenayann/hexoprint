import { COMPANY_INFO } from '@/lib/company-info';
import { STATIC_SEO_PAGES } from '@/lib/seo-config';
import { client, isSanityAvailable } from '@/sanity/lib/client';
import type { MetadataRoute } from 'next';
import { groq } from 'next-sanity';

type SanityArticle = {
    slug: string;
    publishedAt: string;
    _updatedAt?: string;
    featured?: boolean;
};

type SanityGallery = {
    _updatedAt?: string;
};

const articlesForSitemapQuery = groq`
  *[_type == "article" && publishedAt <= now()] | order(publishedAt desc) {
    "slug": slug.current,
    publishedAt,
    _updatedAt,
    featured
  }
`;

const galleryForSitemapQuery = groq`
  *[_type == "gallery"] | order(createdAt desc) {
    _updatedAt
  }
`;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const lastModifiedByPath = new Map<string, Date>();

    const staticPages = (): MetadataRoute.Sitemap =>
        STATIC_SEO_PAGES.map(({ path, changeFrequency, priority }) => ({
            url: new URL(path, COMPANY_INFO.siteUrl).toString(),
            changeFrequency,
            priority,
            ...(lastModifiedByPath.has(path)
                ? { lastModified: lastModifiedByPath.get(path) }
                : {}),
        }));

    if (!isSanityAvailable() || !client) {
        return staticPages();
    }

    try {
        const [articlesResult, galleryResult] = await Promise.allSettled([
            client.fetch<SanityArticle[]>(articlesForSitemapQuery),
            client.fetch<SanityGallery[]>(galleryForSitemapQuery),
        ]);

        if (
            articlesResult.status !== 'fulfilled' ||
            galleryResult.status !== 'fulfilled'
        ) {
            return staticPages();
        }

        const articles = articlesResult.value;
        const gallery = galleryResult.value;

        if (articles[0]?._updatedAt) {
            lastModifiedByPath.set('/blog', new Date(articles[0]._updatedAt));
        }
        if (gallery[0]?._updatedAt) {
            lastModifiedByPath.set('/galerie', new Date(gallery[0]._updatedAt));
        }

        const blogPages: MetadataRoute.Sitemap = articles.map((article) => ({
            url: new URL(
                `/blog/${article.slug}`,
                COMPANY_INFO.siteUrl
            ).toString(),
            lastModified: new Date(article._updatedAt || article.publishedAt),
            changeFrequency: 'monthly',
            priority: article.featured ? 0.7 : 0.6,
        }));

        const uniquePages = new Map<string, MetadataRoute.Sitemap[number]>();
        for (const page of [...staticPages(), ...blogPages]) {
            uniquePages.set(page.url, page);
        }
        return [...uniquePages.values()].sort(
            (a, b) => (b.priority ?? 0) - (a.priority ?? 0)
        );
    } catch (error) {
        console.error(
            '[SITEMAP] Erreur lors de la génération du sitemap:',
            error
        );
        return staticPages();
    }
}

export const revalidate = 3600;
export const dynamic = 'force-static';
