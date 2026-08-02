import { COMPANY_INFO } from '@/lib/company-info';
import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    const baseUrl = COMPANY_INFO.siteUrl;
    const isProduction = process.env.VERCEL_ENV
        ? process.env.VERCEL_ENV === 'production'
        : process.env.NODE_ENV === 'production';

    if (!isProduction) {
        return {
            rules: {
                userAgent: '*',
                disallow: '/',
            },
        };
    }

    const blockedPaths = ['/api/', '/studio/', '/_vercel/', '/admin/'];
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
            ...explicitSearchBots.map((userAgent) => ({
                userAgent,
                allow: '/',
                disallow: blockedPaths,
            })),
        ],
        sitemap: `${baseUrl}/sitemap.xml`,
        host: baseUrl,
    };
}

export const revalidate = 86400;
