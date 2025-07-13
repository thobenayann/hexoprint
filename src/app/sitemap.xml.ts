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
    categories?: string[];
    featured?: boolean;
};

type SanityGallery = {
    _id: string;
    _updatedAt: string;
    createdAt: string;
    title?: string;
    featured?: boolean;
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
    _updatedAt,
    categories,
    featured
  }
`;

const galleryForSitemapQuery = groq`
  *[_type == "gallery"] | order(createdAt desc) {
    _id,
    _updatedAt,
    createdAt,
    title,
    featured,
    image {
      asset->{
        url
      },
      alt
    }
  }
`;

// Mappage des priorités selon l'importance des pages
const PAGE_PRIORITIES = {
    home: 1.0,
    services: 0.9,
    about: 0.8,
    contact: 0.8,
    blog: 0.7,
    gallery: 0.7,
    blogArticle: 0.6,
    legal: 0.3,
    default: 0.5,
} as const;

// Mappage des fréquences de changement
const CHANGE_FREQUENCIES = {
    home: 'weekly' as const,
    dynamic: 'weekly' as const,
    static: 'monthly' as const,
    legal: 'yearly' as const,
} as const;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = COMPANY_INFO.siteUrl;
    const now = new Date();

    try {
        // 1. Pages statiques depuis la configuration de navigation
        const routes = NavigationService.getActiveRoutes();
        const staticPages: MetadataRoute.Sitemap = routes.map((route) => {
            // Déterminer la priorité selon le type de page
            let priority: number = PAGE_PRIORITIES.default;
            let changeFrequency: MetadataRoute.Sitemap[0]['changeFrequency'] =
                'monthly';

            if (route.path === '/') {
                priority = PAGE_PRIORITIES.home;
                changeFrequency = 'weekly';
            } else if (route.path === '/prestations') {
                priority = PAGE_PRIORITIES.services;
                changeFrequency = 'monthly';
            } else if (route.path === '/a-propos') {
                priority = PAGE_PRIORITIES.about;
                changeFrequency = 'monthly';
            } else if (route.path === '/contact') {
                priority = PAGE_PRIORITIES.contact;
                changeFrequency = 'monthly';
            } else if (route.path === '/blog') {
                priority = PAGE_PRIORITIES.blog;
                changeFrequency = 'weekly';
            } else if (route.path === '/galerie') {
                priority = PAGE_PRIORITIES.gallery;
                changeFrequency = 'weekly';
            }

            return {
                url: `${baseUrl}${route.path}`,
                lastModified: now,
                changeFrequency,
                priority,
            };
        });

        // 2. Pages légales statiques
        const legalPages: MetadataRoute.Sitemap = [
            {
                url: `${baseUrl}/mentions-legales`,
                lastModified: now,
                changeFrequency:
                    CHANGE_FREQUENCIES.legal as MetadataRoute.Sitemap[0]['changeFrequency'],
                priority: PAGE_PRIORITIES.legal,
            },
            {
                url: `${baseUrl}/politique-confidentialite`,
                lastModified: now,
                changeFrequency:
                    CHANGE_FREQUENCIES.legal as MetadataRoute.Sitemap[0]['changeFrequency'],
                priority: PAGE_PRIORITIES.legal,
            },
        ];

        // Vérifier si Sanity est disponible
        if (!isSanityAvailable() || !client) {
            console.warn(
                '[SITEMAP] Sanity non configuré, génération du sitemap avec pages statiques uniquement'
            );
            return [...staticPages, ...legalPages];
        }

        // 3. Récupération des données Sanity avec gestion d'erreur robuste
        let articles: SanityArticle[] = [];
        let gallery: SanityGallery[] = [];

        try {
            [articles, gallery] = await Promise.allSettled([
                client.fetch(articlesForSitemapQuery),
                client.fetch(galleryForSitemapQuery),
            ]).then((results) => [
                results[0].status === 'fulfilled' ? results[0].value : [],
                results[1].status === 'fulfilled' ? results[1].value : [],
            ]);
        } catch (error) {
            console.error(
                '[SITEMAP] Erreur lors de la récupération des données Sanity:',
                error
            );
        }

        // 4. Articles de blog depuis Sanity
        const blogPages: MetadataRoute.Sitemap = articles.map((article) => ({
            url: `${baseUrl}/blog/${article.slug}`,
            lastModified: new Date(article._updatedAt || article.publishedAt),
            changeFrequency:
                'monthly' as MetadataRoute.Sitemap[0]['changeFrequency'],
            priority: article.featured ? 0.7 : PAGE_PRIORITIES.blogArticle,
        }));

        // 5. Page index du blog si elle existe
        const blogIndexPages: MetadataRoute.Sitemap =
            articles.length > 0
                ? [
                      {
                          url: `${baseUrl}/blog`,
                          lastModified: new Date(
                              articles[0]?._updatedAt || now
                          ),
                          changeFrequency:
                              'weekly' as MetadataRoute.Sitemap[0]['changeFrequency'],
                          priority: PAGE_PRIORITIES.blog,
                      },
                  ]
                : [];

        // 6. Galerie depuis Sanity (avec images pour le SEO)
        const galleryPages: MetadataRoute.Sitemap =
            gallery.length > 0
                ? [
                      {
                          url: `${baseUrl}/galerie`,
                          lastModified: new Date(gallery[0]?._updatedAt || now),
                          changeFrequency:
                              'weekly' as MetadataRoute.Sitemap[0]['changeFrequency'],
                          priority: PAGE_PRIORITIES.gallery,
                          // Ajouter les images de la galerie pour le SEO
                          images: gallery
                              .filter((item) => item.image?.asset?.url)
                              .slice(0, 1000) // Limite Google recommandée
                              .map((item) => item.image!.asset.url),
                      },
                  ]
                : [];

        // 7. Combiner tous les éléments avec validation
        const allPages = [
            ...staticPages,
            ...legalPages,
            ...blogIndexPages,
            ...blogPages,
            ...galleryPages,
        ];

        // 8. Validation et nettoyage des entrées
        const validatedPages = allPages
            .filter((page) => {
                // Vérifier que l'URL est valide
                try {
                    new URL(page.url);
                    return true;
                } catch {
                    console.warn(`[SITEMAP] URL invalide ignorée: ${page.url}`);
                    return false;
                }
            })
            .sort((a, b) => (b.priority || 0) - (a.priority || 0)); // Trier par priorité décroissante

        console.log(
            `[SITEMAP] Génération réussie : ${validatedPages.length} pages`
        );
        return validatedPages;
    } catch (error) {
        console.error(
            '[SITEMAP] Erreur critique lors de la génération du sitemap:',
            error
        );

        // Fallback minimal : retourner au moins les pages statiques essentielles
        return [
            {
                url: baseUrl,
                lastModified: now,
                changeFrequency: 'weekly',
                priority: 1.0,
            },
            {
                url: `${baseUrl}/prestations`,
                lastModified: now,
                changeFrequency: 'monthly',
                priority: 0.9,
            },
            {
                url: `${baseUrl}/contact`,
                lastModified: now,
                changeFrequency: 'monthly',
                priority: 0.8,
            },
        ];
    }
}

// Configuration pour optimiser les performances et le SEO
export const revalidate = 3600; // Revalider toutes les heures
export const dynamic = 'force-static'; // Forcer la génération statique pour de meilleures performances
