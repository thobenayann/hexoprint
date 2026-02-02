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
                allow: [
                    '/',             // toutes les pages publiques
                    '/manifest.json',
                    '/favicon.ico',
                    '/_next/static/', // permet les JS/CSS
                    '/_next/image/',  // permet les images optimisées
                  ],
                disallow: [
                '/api/',
                '/studio/',
                '/studio/*',
                '/_vercel/',
                '/admin/',
                '/_next/data/',  // bloque uniquement les données internes
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
