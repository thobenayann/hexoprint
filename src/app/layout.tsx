import '@/app/globals.css';
import { COMPANY_INFO } from '@/lib/company-info';
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

export const metadata: Metadata = {
    metadataBase: new URL(
        process.env.NEXT_PUBLIC_SITE_URL || COMPANY_INFO.siteUrl
    ),
    title: {
        default: `${COMPANY_INFO.name} - Impression 3D artisanale à Seysses (31)`,
        template: `%s | ${COMPANY_INFO.name}`,
    },
    description:
        "Spécialiste de l'impression 3D pour professionnels et particuliers en Haute-Garonne. Prototypage rapide, modélisme, pièces sur-mesure.",
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
        title: `${COMPANY_INFO.name} - Impression 3D artisanale à Seysses (31)`,
        description:
            "Spécialiste de l'impression 3D pour professionnels et particuliers en Haute-Garonne.",
        images: [
            {
                url: `${COMPANY_INFO.siteUrl}/logos/hexoprint-logo-impression-3d-with-text-1200x628.png`,
                width: 1200,
                height: 628,
                alt: `${COMPANY_INFO.name} - Spécialiste impression 3D`,
                type: 'image/png',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        creator: `@${COMPANY_INFO.name.toLowerCase().replace(/[^a-z0-9]/g, '')}`,
        title: `${COMPANY_INFO.name} - Impression 3D artisanale à Seysses (31)`,
        description:
            "Spécialiste de l'impression 3D pour professionnels et particuliers en Haute-Garonne.",
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

                {/* Schema.org Organisation globale */}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            '@context': 'https://schema.org',
                            '@type': 'Organization',
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
                                streetAddress:
                                    COMPANY_INFO.contact.address.street,
                                addressLocality:
                                    COMPANY_INFO.contact.address.city,
                                addressRegion:
                                    COMPANY_INFO.contact.address.department,
                                postalCode:
                                    COMPANY_INFO.contact.address.postalCode,
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
                        }),
                    }}
                />
            </head>
            <body
                className={`${playfair.variable} ${openSans.variable} ${orbitron.variable} ${oxanium.variable} antialiased dark`}
            >
                <NuqsAdapter>{children}</NuqsAdapter>
                <Analytics />
                <SanityLive />
            </body>
        </html>
    );
}
