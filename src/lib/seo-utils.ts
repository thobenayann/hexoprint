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

    const url = `${COMPANY_INFO.siteUrl}${path}`;
    const fullTitle = path === '' ? title : `${title} | ${COMPANY_INFO.name}`;

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

    const allKeywords = [...new Set([...baseKeywords, ...keywords])];

    const metadata: Metadata = {
        title: fullTitle,
        description,
        keywords: allKeywords,
        robots: noIndex
            ? 'noindex, nofollow'
            : {
                  index: true,
                  follow: true,
                  googleBot: {
                      index: true,
                      follow: true,
                      'max-video-preview': -1,
                      'max-image-preview': 'large',
                      'max-snippet': -1,
                  },
              },
        openGraph: {
            title: fullTitle,
            description,
            type,
            locale: 'fr_FR',
            siteName: COMPANY_INFO.name,
            url,
            images: [
                {
                    url: image,
                    width: 1200,
                    height: type === 'article' ? 630 : 628,
                    alt: `${COMPANY_INFO.name} - ${title}`,
                    type: 'image/png',
                },
            ],
            ...(type === 'article' && {
                publishedTime,
                authors: authors,
            }),
        },
        twitter: {
            card: 'summary_large_image',
            title: fullTitle,
            description,
            images: [image],
            ...(type === 'article' && {
                creator: `@${COMPANY_INFO.name.toLowerCase().replace(/[^a-z0-9]/g, '')}`,
            }),
        },
        alternates: {
            canonical: url,
        },
        authors: authors.map((author) => ({
            name: author,
            url: COMPANY_INFO.siteUrl,
        })),
        creator: COMPANY_INFO.name,
        publisher: COMPANY_INFO.name,
        category: 'Business',
        classification: 'Impression 3D et fabrication additive',
    };

    return metadata;
}

/**
 * Génère du JSON-LD pour LocalBusiness
 */
export function generateLocalBusinessStructuredData() {
    return {
        '@context': 'https://schema.org',
        '@type': 'LocalBusiness',
        name: COMPANY_INFO.name,
        legalName: COMPANY_INFO.legalName,
        url: COMPANY_INFO.siteUrl,
        logo: `${COMPANY_INFO.siteUrl}/logos/hexoprint-sans-text-no-bg-250x250.png`,
        image: `${COMPANY_INFO.siteUrl}/logos/hexoprint-logo-impression-3d-with-text-1200x628.png`,
        description:
            "Spécialiste de l'impression 3D artisanale et sur-mesure pour professionnels et particuliers.",
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
        geo: {
            '@type': 'GeoCoordinates',
            latitude: '43.4973',
            longitude: '1.3094',
        },
        founder: {
            '@type': 'Person',
            name: COMPANY_INFO.founder,
        },
        foundingDate: '2021',
        industry: 'Fabrication additive et impression 3D',
        numberOfEmployees: '1',
        slogan: "Donnez vie à vos projets grâce à l'impression 3D artisanale",
        sameAs: [COMPANY_INFO.social.instagram],
        serviceArea: {
            '@type': 'Country',
            name: 'France',
        },
        areaServed: {
            '@type': 'State',
            name: 'Haute-Garonne',
        },
        openingHours: ['Mo-Fr 09:00-18:00', 'Sa 09:00-12:00'],
        priceRange: '€€',
        paymentAccepted: ['Cash', 'Credit Card', 'Bank Transfer'],
        currenciesAccepted: 'EUR',
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
            url: COMPANY_INFO.siteUrl,
        },
        publisher: {
            '@type': 'Organization',
            name: COMPANY_INFO.name,
            logo: {
                '@type': 'ImageObject',
                url: `${COMPANY_INFO.siteUrl}/logos/hexoprint-sans-text-no-bg-250x250.png`,
            },
        },
        image: {
            '@type': 'ImageObject',
            url: image,
            width: 1200,
            height: 630,
        },
        mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': url,
        },
        isPartOf: {
            '@type': 'Blog',
            name: `Blog ${COMPANY_INFO.name}`,
            url: `${COMPANY_INFO.siteUrl}/blog`,
        },
        inLanguage: 'fr-FR',
        ...(categories.length > 0 && {
            keywords: categories.join(', '),
        }),
        about: {
            '@type': 'Thing',
            name: 'Impression 3D',
        },
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
        provider: generateLocalBusinessStructuredData(),
        serviceType,
        serviceArea: {
            '@type': 'Country',
            name: 'France',
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
                        name: 'France',
                    },
                })),
            },
        }),
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
