import { COMPANY_INFO } from '@/lib/company-info';
import { NavigationService } from '@/lib/navigation-config';
import { client, isSanityAvailable } from '@/sanity/lib/client';
import type { MetadataRoute } from 'next';
import { groq } from 'next-sanity';

// Types pour les données Sanity
type SanityArticle = {
    slug: { current: string };
    publishedAt: string;
    _updatedAt: string;
};

type SanityGallery = {
    _id: string;
    _updatedAt: string;
    createdAt: string;
    title?: string;
    image?: {
        asset: {
            url: string;
        };
        alt?: string;
    };
};

// Requêtes Sanity optimisées pour le sitemap
const articlesForSitemapQuery = groq`
  *[_type == "article" && publishedAt <= now()] | order(publishedAt desc) {
    "slug": slug.current,
    publishedAt,
    _updatedAt
  }
`;

const galleryForSitemapQuery = groq`
  *[_type == "gallery"] | order(createdAt desc) {
    _id,
    _updatedAt,
    createdAt,
    title,
    image {
      asset->{
        url
      },
      alt
    }
  }
`;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = COMPANY_INFO.siteUrl;

    // 1. Pages statiques depuis la configuration de navigation
    const routes = NavigationService.getActiveRoutes();
    const staticPages: MetadataRoute.Sitemap = routes.map((route) => ({
        url: `${baseUrl}${route.path}`,
        lastModified: new Date(),
        changeFrequency: route.path === '/' ? 'weekly' : 'monthly',
        priority: route.path === '/' ? 1 : 0.8,
    }));

    // 2. Pages légales statiques
    const legalPages: MetadataRoute.Sitemap = [
        {
            url: `${baseUrl}/mentions-legales`,
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 0.3,
        },
        {
            url: `${baseUrl}/politique-confidentialite`,
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 0.3,
        },
    ];

    // Vérifier si Sanity est disponible
    if (!isSanityAvailable() || !client) {
        console.warn(
            'Sanity non configuré, génération du sitemap avec pages statiques uniquement'
        );
        return [...staticPages, ...legalPages];
    }

    try {
        // 3. Articles de blog depuis Sanity
        const articles: SanityArticle[] = await client.fetch(
            articlesForSitemapQuery
        );
        const blogPages: MetadataRoute.Sitemap = articles.map((article) => ({
            url: `${baseUrl}/blog/${article.slug}`,
            lastModified: new Date(article._updatedAt || article.publishedAt),
            changeFrequency: 'monthly',
            priority: 0.7,
        }));

        // 4. Page index du blog si elle existe
        const blogIndexPages: MetadataRoute.Sitemap =
            articles.length > 0
                ? [
                      {
                          url: `${baseUrl}/blog`,
                          lastModified: new Date(
                              articles[0]?._updatedAt || new Date()
                          ),
                          changeFrequency: 'weekly',
                          priority: 0.8,
                      },
                  ]
                : [];

        // 5. Galerie depuis Sanity (avec images pour le SEO)
        const gallery: SanityGallery[] = await client.fetch(
            galleryForSitemapQuery
        );
        const galleryPages: MetadataRoute.Sitemap =
            gallery.length > 0
                ? [
                      {
                          url: `${baseUrl}/galerie`,
                          lastModified: new Date(
                              gallery[0]?._updatedAt || new Date()
                          ),
                          changeFrequency: 'weekly',
                          priority: 0.8,
                          // Ajouter les images de la galerie pour le SEO
                          images: gallery
                              .filter((item) => item.image?.asset?.url)
                              .slice(0, 10) // Limiter à 10 images pour éviter un sitemap trop lourd
                              .map((item) => item.image!.asset.url),
                      },
                  ]
                : [];

        // 6. Combiner tous les éléments
        return [
            ...staticPages,
            ...legalPages,
            ...blogIndexPages,
            ...blogPages,
            ...galleryPages,
        ];
    } catch (error) {
        console.error('Erreur lors de la génération du sitemap:', error);

        // Fallback : retourner au moins les pages statiques
        return [...staticPages, ...legalPages];
    }
}

// Configuration pour optimiser les performances
export const revalidate = 3600; // Revalider toutes les heures
