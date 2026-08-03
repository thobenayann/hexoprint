import '@/app/globals.css';
import { StructuredData } from '@/components/seo/structured-data';
import { COMPANY_INFO } from '@/lib/company-info';
import { getStaticSeoPage } from '@/lib/seo-config';
import {
    generateLocalBusinessStructuredData,
    generateWebSiteStructuredData,
} from '@/lib/seo-utils';
import { SanityLive } from '@/sanity/lib/live';
import { Analytics } from '@vercel/analytics/next';
import type { Metadata, Viewport } from 'next';
import {
    Open_Sans,
    Orbitron,
    Oxanium,
    Playfair_Display,
} from 'next/font/google';
import { NuqsAdapter } from 'nuqs/adapters/next/app';

const playfair = Playfair_Display({
    subsets: ['latin'],
    weight: ['400', '700'],
    variable: '--font-playfair',
    display: 'swap',
    preload: true,
    fallback: ['serif'],
});

const openSans = Open_Sans({
    subsets: ['latin'],
    weight: ['400', '600', '700'],
    variable: '--font-open-sans',
    display: 'swap',
    preload: true,
    fallback: ['sans-serif'],
});

const orbitron = Orbitron({
    subsets: ['latin'],
    weight: ['400', '700', '900'],
    variable: '--font-orbitron',
    display: 'swap',
    preload: true,
    fallback: ['monospace'],
});

const oxanium = Oxanium({
    subsets: ['latin'],
    weight: ['200', '300', '400', '500', '600', '700', '800'],
    variable: '--font-oxanium',
    display: 'swap',
    preload: true,
    fallback: ['monospace'],
});

// Configuration du viewport pour mobile-first et Core Web Vitals
export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
    themeColor: [
        { media: '(prefers-color-scheme: light)', color: '#24556A' },
        { media: '(prefers-color-scheme: dark)', color: '#24556A' },
    ],
    colorScheme: 'dark light',
};

const homeSeo = getStaticSeoPage('/');

export const metadata: Metadata = {
    metadataBase: new URL(COMPANY_INFO.siteUrl),
    title: {
        default: `${homeSeo.title} | ${COMPANY_INFO.name}`,
        template: `%s | ${COMPANY_INFO.name}`,
    },
    description: homeSeo.description,
    keywords: [
        'impression 3D',
        'Haute-Garonne',
        'Seysses',
        'prototypage rapide',
        'modélisme',
        'fabrication additive',
        'PLA',
        'ABS',
        'PETG',
        'résine',
        'pièces sur-mesure',
        'réparation 3D',
        'Toulouse',
        'artisan impression 3D',
    ],
    authors: [{ name: COMPANY_INFO.founder, url: COMPANY_INFO.siteUrl }],
    creator: COMPANY_INFO.name,
    publisher: COMPANY_INFO.name,
    category: 'Business',
    classification: 'Impression 3D et fabrication additive',
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
            noimageindex: false,
            noarchive: false,
            notranslate: false,
        },
    },
    openGraph: {
        type: 'website',
        locale: 'fr_FR',
        siteName: COMPANY_INFO.name,
        url: COMPANY_INFO.siteUrl,
        title: homeSeo.title,
        description: homeSeo.description,
        images: [
            {
                url: `${COMPANY_INFO.siteUrl}/logos/hexoprint-logo-impression-3d-with-text-1200x628.png`,
                width: 1200,
                height: 628,
                alt: homeSeo.title,
                type: 'image/png',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        creator: `@${COMPANY_INFO.name.toLowerCase().replace(/[^a-z0-9]/g, '')}`,
        title: homeSeo.title,
        description: homeSeo.description,
        images: [
            `${COMPANY_INFO.siteUrl}/logos/hexoprint-logo-impression-3d-with-text-1200x628.png`,
        ],
    },
    alternates: {
        canonical: COMPANY_INFO.siteUrl,
    },
    other: {
        // Optionnel : Token de vérification Google Search Console
        // Obtenez-le sur https://search.google.com/search-console
        'google-site-verification': process.env.GOOGLE_SITE_VERIFICATION || '',
    },
    verification: {
        // Tokens de vérification pour les moteurs de recherche (optionnels)
        google: process.env.GOOGLE_SITE_VERIFICATION,
        // yandex: process.env.YANDEX_SITE_VERIFICATION, // Retiré - non nécessaire pour le marché français
    },
    formatDetection: {
        telephone: true,
        date: false,
        address: true,
        email: true,
        url: true,
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="fr" suppressHydrationWarning className="dark">
            <head>
                {/* Preconnect pour améliorer les Core Web Vitals */}
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link
                    rel="preconnect"
                    href="https://fonts.gstatic.com"
                    crossOrigin="anonymous"
                />
                <link rel="preconnect" href="https://cdn.sanity.io" />

                {/* DNS Prefetch pour les domaines externes */}
                <link rel="dns-prefetch" href="https://vercel.com" />
                <link rel="dns-prefetch" href="https://analytics.vercel.com" />

                {/* Preload des ressources critiques */}
                <link
                    rel="preload"
                    href="/logos/hexoprint-sans-text-no-bg-250x250.png"
                    as="image"
                    type="image/png"
                />

            </head>
            <body
                className={`${playfair.variable} ${openSans.variable} ${orbitron.variable} ${oxanium.variable} antialiased dark`}
            >
                <NuqsAdapter>{children}</NuqsAdapter>
                <StructuredData
                    id="hexoprint-entities"
                    data={[
                        generateLocalBusinessStructuredData(),
                        generateWebSiteStructuredData(),
                    ]}
                />
                <Analytics />
                <SanityLive />
            </body>
        </html>
    );
}
