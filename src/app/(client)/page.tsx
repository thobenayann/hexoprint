import { CallToAction } from '@/components/sections/CallToAction';
import { GalleryPreview } from '@/components/sections/GalleryPreview';
import { HeroSection } from '@/components/sections/HeroSection';
import { TargetAudience } from '@/components/sections/TargetAudience';
import { Testimonials } from '@/components/sections/Testimonials';
import { WhyHexoprint } from '@/components/sections/WhyHexoprint';
import { COMPANY_INFO } from '@/lib/company-info';
import type { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
    title: `${COMPANY_INFO.name} - Impression 3D artisanale à Seysses (31)`,
    description:
        "Spécialiste de l'impression 3D pour professionnels et particuliers en Haute-Garonne. Prototypage rapide, modélisme, pièces sur-mesure. Devis gratuit et conseils techniques.",
    keywords: [
        'impression 3D Haute-Garonne',
        'impression 3D Seysses',
        'impression 3D Toulouse',
        'prototypage rapide 31',
        'fabrication additive sur-mesure',
        'modélisme impression 3D',
        'pièces impression 3D professionnelles',
        'réparation impression 3D',
        'matériaux PLA ABS PETG résine',
        'artisan impression 3D local',
        'devis impression 3D gratuit',
        'conseil technique impression 3D',
        'Hexoprint spécialiste 3D',
        'impression 3D particuliers entreprises',
    ],
    openGraph: {
        title: `${COMPANY_INFO.name} - Donnez vie à vos projets grâce à l'impression 3D artisanale`,
        description:
            'Votre spécialiste local en impression 3D à Seysses. Prototypage, modélisme, pièces sur-mesure pour professionnels et particuliers. Expertise technique et qualité artisanale.',
        type: 'website',
        locale: 'fr_FR',
        siteName: COMPANY_INFO.name,
        url: COMPANY_INFO.siteUrl,
        images: [
            {
                url: `${COMPANY_INFO.siteUrl}/logos/hexoprint-logo-impression-3d-with-text-1200x628.png`,
                width: 1200,
                height: 628,
                alt: `${COMPANY_INFO.name} - Spécialiste impression 3D artisanale Haute-Garonne`,
                type: 'image/png',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: `${COMPANY_INFO.name} - Impression 3D artisanale à Seysses (31)`,
        description:
            'Votre spécialiste local en impression 3D. Prototypage, modélisme, pièces sur-mesure pour professionnels et particuliers.',
        images: [
            `${COMPANY_INFO.siteUrl}/logos/hexoprint-logo-impression-3d-with-text-1200x628.png`,
        ],
    },
    robots: {
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
    alternates: {
        canonical: COMPANY_INFO.siteUrl,
    },
    category: 'Business',
    classification: 'Impression 3D et fabrication additive',
};

// Fallback pour le chargement de la galerie
function GalleryPreviewFallback() {
    return (
        <section className="relative py-24 overflow-hidden bg-gradient-to-br from-muted/20 via-background to-muted/30">
            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-20">
                    <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-6 md:mb-8 text-foreground">
                        Notre <span className="text-primary">galerie</span>
                    </h2>
                    <p className="text-base md:text-lg lg:text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
                        Découvrez nos réalisations : chaque création reflète
                        notre passion du détail et l&apos;étendue de nos
                        compétences techniques.
                    </p>
                </div>

                {/* Skeleton loading */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                    {Array.from({ length: 4 }).map((_, index) => (
                        <div key={index} className="animate-pulse">
                            <div className="bg-muted rounded-lg h-64 mb-4"></div>
                            <div className="h-4 bg-muted rounded mb-2"></div>
                            <div className="h-3 bg-muted rounded w-3/4"></div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default function Home() {
    return (
        <main className="min-h-screen">
            <HeroSection />
            <WhyHexoprint />
            <TargetAudience />
            <Suspense fallback={<GalleryPreviewFallback />}>
                <GalleryPreview />
            </Suspense>
            <Testimonials />
            <CallToAction />

            {/* Schema.org JSON-LD pour la page d'accueil */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'LocalBusiness',
                        '@id': COMPANY_INFO.siteUrl,
                        name: COMPANY_INFO.name,
                        legalName: COMPANY_INFO.legalName,
                        url: COMPANY_INFO.siteUrl,
                        logo: `${COMPANY_INFO.siteUrl}/logos/hexoprint-sans-text-no-bg-250x250.png`,
                        image: [
                            `${COMPANY_INFO.siteUrl}/logos/hexoprint-logo-impression-3d-with-text-1200x628.png`,
                            `${COMPANY_INFO.siteUrl}/gallerie/ball-gccf2f1951_1920.jpg`,
                            `${COMPANY_INFO.siteUrl}/gallerie/petit-bonhomme-no-bg.png`,
                        ],
                        description:
                            "Spécialiste de l'impression 3D artisanale et sur-mesure pour professionnels et particuliers en Haute-Garonne. Prototypage rapide, modélisme, fabrication additive.",
                        telephone: COMPANY_INFO.contact.phone,
                        email: COMPANY_INFO.contact.email,
                        address: {
                            '@type': 'PostalAddress',
                            streetAddress: COMPANY_INFO.contact.address.street,
                            addressLocality: COMPANY_INFO.contact.address.city,
                            addressRegion:
                                COMPANY_INFO.contact.address.department,
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
                            jobTitle: 'Artisan spécialisé en impression 3D',
                        },
                        foundingDate: '2021',
                        industry: 'Fabrication additive et impression 3D',
                        numberOfEmployees: '1',
                        slogan: "Donnez vie à vos projets grâce à l'impression 3D artisanale",
                        sameAs: [COMPANY_INFO.social.instagram],
                        serviceArea: [
                            {
                                '@type': 'State',
                                name: 'Haute-Garonne',
                            },
                            {
                                '@type': 'Country',
                                name: 'France',
                            },
                        ],
                        areaServed: [
                            {
                                '@type': 'City',
                                name: 'Seysses',
                            },
                            {
                                '@type': 'City',
                                name: 'Toulouse',
                            },
                            {
                                '@type': 'City',
                                name: 'Muret',
                            },
                            {
                                '@type': 'State',
                                name: 'Haute-Garonne',
                            },
                        ],
                        openingHours: ['Mo-Fr 09:00-18:00', 'Sa 09:00-12:00'],
                        openingHoursSpecification: [
                            {
                                '@type': 'OpeningHoursSpecification',
                                dayOfWeek: [
                                    'Monday',
                                    'Tuesday',
                                    'Wednesday',
                                    'Thursday',
                                    'Friday',
                                ],
                                opens: '09:00',
                                closes: '18:00',
                            },
                            {
                                '@type': 'OpeningHoursSpecification',
                                dayOfWeek: 'Saturday',
                                opens: '09:00',
                                closes: '12:00',
                            },
                        ],
                        priceRange: '€€',
                        paymentAccepted: [
                            'Cash',
                            'Credit Card',
                            'Bank Transfer',
                        ],
                        currenciesAccepted: 'EUR',
                        hasOfferCatalog: {
                            '@type': 'OfferCatalog',
                            name: 'Services impression 3D',
                            itemListElement: [
                                {
                                    '@type': 'Offer',
                                    itemOffered: {
                                        '@type': 'Service',
                                        name: 'Impression 3D pour professionnels',
                                        description:
                                            'Prototypage rapide, fabrication de pièces industrielles, réparation de composants',
                                        serviceType:
                                            'Fabrication additive professionnelle',
                                    },
                                    eligibleRegion: {
                                        '@type': 'Country',
                                        name: 'France',
                                    },
                                },
                                {
                                    '@type': 'Offer',
                                    itemOffered: {
                                        '@type': 'Service',
                                        name: 'Impression 3D pour particuliers',
                                        description:
                                            'Objets personnalisés, modélisme, décoration, créations artistiques',
                                        serviceType:
                                            'Impression 3D créative et loisirs',
                                    },
                                    eligibleRegion: {
                                        '@type': 'Country',
                                        name: 'France',
                                    },
                                },
                            ],
                        },
                        contactPoint: {
                            '@type': 'ContactPoint',
                            telephone: COMPANY_INFO.contact.phone,
                            email: COMPANY_INFO.contact.email,
                            contactType: 'customer service',
                            areaServed: 'FR',
                            availableLanguage: 'French',
                            serviceType:
                                'Impression 3D et fabrication additive',
                        },
                        potentialAction: [
                            {
                                '@type': 'OrderAction',
                                target: `${COMPANY_INFO.siteUrl}/contact`,
                                name: 'Demander un devis',
                            },
                            {
                                '@type': 'ViewAction',
                                target: `${COMPANY_INFO.siteUrl}/galerie`,
                                name: 'Voir nos réalisations',
                            },
                        ],
                    }),
                }}
            />
        </main>
    );
}
