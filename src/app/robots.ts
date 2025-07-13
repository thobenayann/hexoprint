import { COMPANY_INFO } from '@/lib/company-info';
import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    const baseUrl = COMPANY_INFO.siteUrl;

    // Logique corrigée : considérer comme production si NODE_ENV est production
    // OU si VERCEL_ENV est production (même si NODE_ENV n'est pas défini)
    const isProduction =
        process.env.NODE_ENV === 'production' ||
        process.env.VERCEL_ENV === 'production';

    // 🚨 IMPORTANT: En développement ou sur les previews, bloquer tous les crawlers
    if (!isProduction) {
        return {
            rules: {
                userAgent: '*',
                disallow: '/',
            },
        };
    }

    // Configuration pour la production selon la doc Next.js
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: [
                    '/api/', // Routes API Next.js
                    '/_next/', // Fichiers build Next.js
                    '/studio/', // Sanity Studio
                    '/studio/*', // Toutes les routes du studio
                    '/_vercel/', // Fichiers Vercel
                    '/admin/', // Routes d'administration (si applicable)
                ],
            },
            // Règles spécifiques pour les bots de réseaux sociaux
            {
                userAgent: [
                    'facebookexternalhit',
                    'Twitterbot',
                    'LinkedInBot',
                    'WhatsApp',
                ],
                allow: '/',
            },
        ],
        sitemap: `${baseUrl}/sitemap.xml`,
        host: baseUrl,
    };
}

// Configuration pour optimiser les performances
export const revalidate = 86400; // Revalider une fois par jour
