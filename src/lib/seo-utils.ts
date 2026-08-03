/**
 * Utilitaires SEO centralisés pour Hexoprint
 * Gestion unifiée des métadonnées, Open Graph, et JSON-LD
 */

import { COMPANY_INFO } from '@/lib/company-info';
import type { Metadata } from 'next';

/**
 * Type pour les données structurées JSON-LD
 */
export type JSONLDData = Record<string, unknown>;

export const BUSINESS_ID = `${COMPANY_INFO.siteUrl}/#business`;
export const WEBSITE_ID = `${COMPANY_INFO.siteUrl}/#website`;

function parseBusinessHours(hours: string) {
    return hours.split(' - ').map((time) =>
        time.replace(/^(\d)h/, '0$1:').replace('h', ':')
    );
}

// Types pour les options SEO
export type SEOConfig = {
    title: string;
    description: string;
    keywords?: string[];
    image?: string;
    path?: string;
    type?: 'website' | 'article';
    publishedTime?: string;
    authors?: string[];
    noIndex?: boolean;
    structuredData?: JSONLDData;
};

/**
 * Génère des métadonnées optimisées pour le SEO
 */
export function generateSEOMetadata(config: SEOConfig): Metadata {
    const {
        title,
        description,
        keywords = [],
        image = `${COMPANY_INFO.siteUrl}/logos/hexoprint-logo-impression-3d-with-text-1200x628.png`,
        path = '',
        type = 'website',
        publishedTime,
        authors = [COMPANY_INFO.name],
        noIndex = false,
    } = config;

    const canonical = new URL(path || '/', COMPANY_INFO.siteUrl).toString();

    // Mots-clés de base toujours inclus
    const baseKeywords = [
        'impression 3D',
        'impression 3D Toulouse',
        'impression 3D Seysses',
        'Haute-Garonne',
        'Seysses',
        'Toulouse',
        'fabrication additive',
        'impression 3D sur mesure',
        'prototypage rapide',
        'modélisme',
        'impression 3D artisanale',
        'impression 3D professionnelle',
        'impression 3D industrielle',
        'impression 3D sur-mesure',
        COMPANY_INFO.name,
    ];

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
}

export function truncateMetadataText(value: string, maxLength: number) {
    const normalized = value.replace(/\s+/g, ' ').trim();
    if (normalized.length <= maxLength) return normalized;
    const slice = normalized.slice(0, maxLength - 1);
    const wordBoundary = slice.lastIndexOf(' ');
    const truncated =
        wordBoundary >= Math.floor(maxLength * 0.6)
            ? slice.slice(0, wordBoundary)
            : slice;
    return `${truncated.trimEnd()}…`;
}

/**
 * Génère du JSON-LD pour LocalBusiness
 */
export function generateLocalBusinessStructuredData() {
    const [weekdayOpens, weekdayCloses] = parseBusinessHours(
        COMPANY_INFO.schedule.weekdays.hours
    );
    const [saturdayOpens, saturdayCloses] = parseBusinessHours(
        COMPANY_INFO.schedule.saturday.hours
    );

    return {
        '@context': 'https://schema.org',
        '@type': 'LocalBusiness',
        '@id': BUSINESS_ID,
        name: COMPANY_INFO.name,
        legalName: COMPANY_INFO.legalName,
        url: COMPANY_INFO.siteUrl,
        telephone: COMPANY_INFO.contact.phone,
        email: COMPANY_INFO.contact.email,
        address: {
            '@type': 'PostalAddress',
            streetAddress: COMPANY_INFO.contact.address.street,
            addressLocality: COMPANY_INFO.contact.address.city,
            addressRegion: COMPANY_INFO.contact.address.department,
            postalCode: COMPANY_INFO.contact.address.postalCode,
            addressCountry: 'FR',
        },
        founder: {
            '@type': 'Person',
            name: COMPANY_INFO.founder,
        },
        sameAs: [COMPANY_INFO.social.instagram],
        areaServed: [
            ...COMPANY_INFO.serviceArea.localDelivery.areas,
            ...COMPANY_INFO.serviceArea.extendedDelivery.areas,
            ...(COMPANY_INFO.serviceArea.shipping.national
                ? [COMPANY_INFO.contact.address.country]
                : []),
        ].map((name) => ({ '@type': 'Place', name })),
        openingHoursSpecification: [
            {
                '@type': 'OpeningHoursSpecification',
                dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
                opens: weekdayOpens,
                closes: weekdayCloses,
            },
            {
                '@type': 'OpeningHoursSpecification',
                dayOfWeek: 'Saturday',
                opens: saturdayOpens,
                closes: saturdayCloses,
            },
        ],
    };
}

export function generateWebSiteStructuredData() {
    return {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        '@id': WEBSITE_ID,
        url: COMPANY_INFO.siteUrl,
        name: COMPANY_INFO.name,
        publisher: { '@id': BUSINESS_ID },
        inLanguage: 'fr-FR',
    };
}

/**
 * Génère du JSON-LD pour un article de blog
 */
export function generateArticleStructuredData(config: {
    title: string;
    description: string;
    url: string;
    publishedAt: string;
    updatedAt?: string;
    image?: string;
    author?: string;
    categories?: string[];
}) {
    const {
        title,
        description,
        url,
        publishedAt,
        updatedAt,
        image = `${COMPANY_INFO.siteUrl}/logos/hexoprint-logo-impression-3d-with-text-1200x628.png`,
        author = COMPANY_INFO.founder,
        categories = [],
    } = config;

    return {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: title,
        description,
        url,
        datePublished: publishedAt,
        dateModified: updatedAt || publishedAt,
        author: {
            '@type': 'Person',
            name: author,
        },
        publisher: { '@id': BUSINESS_ID },
        image,
        mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': url,
        },
        isPartOf: {
            '@type': 'Blog',
            name: `Blog ${COMPANY_INFO.name}`,
            url: `${COMPANY_INFO.siteUrl}/blog`,
            publisher: { '@id': BUSINESS_ID },
        },
        inLanguage: 'fr-FR',
        ...(categories.length > 0 && {
            keywords: categories.join(', '),
        }),
    };
}

/**
 * Génère du JSON-LD pour une page de service
 */
export function generateServiceStructuredData(config: {
    name: string;
    description: string;
    url: string;
    serviceType: string;
    offers?: Array<{
        name: string;
        description: string;
        serviceType: string;
    }>;
}) {
    const { name, description, url, serviceType, offers = [] } = config;

    return {
        '@context': 'https://schema.org',
        '@type': 'Service',
        name,
        description,
        url,
        provider: { '@id': BUSINESS_ID },
        serviceType,
        serviceArea: {
            '@type': 'Country',
            name: COMPANY_INFO.contact.address.country,
        },
        ...(offers.length > 0 && {
            hasOfferCatalog: {
                '@type': 'OfferCatalog',
                name: 'Services impression 3D',
                itemListElement: offers.map((offer) => ({
                    '@type': 'Offer',
                    itemOffered: {
                        '@type': 'Service',
                        name: offer.name,
                        description: offer.description,
                        serviceType: offer.serviceType,
                    },
                    eligibleRegion: {
                        '@type': 'Country',
                        name: COMPANY_INFO.contact.address.country,
                    },
                })),
            },
        }),
    };
}

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

/**
 * Compose un script JSON-LD pour l'injection dans le HTML
 */
export function createJSONLDScript(data: JSONLDData) {
    return {
        __html: JSON.stringify(data),
    };
}
