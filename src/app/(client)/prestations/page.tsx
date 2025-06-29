import { CallToAction } from '@/components/sections/CallToAction';
import { MaterialsExpertise } from '@/components/sections/MaterialsExpertise';
import { Prestations } from '@/components/sections/Prestations';
import { PrestationsHero } from '@/components/sections/PrestationsHero';
import { ProcessusTravail } from '@/components/sections/ProcessusTravail';
import { COMPANY_INFO } from '@/lib/company-info';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: `Prestations d'impression 3D professionnelles - ${COMPANY_INFO.name}`,
    description:
        "Découvrez nos prestations d'impression 3D pour professionnels et particuliers en Haute-Garonne : prototypage rapide, modélisme, pièces sur-mesure, réparation industrielle.",
    keywords: [
        'prestations impression 3D Haute-Garonne',
        'impression 3D professionnels Toulouse',
        'impression 3D particuliers Seysses',
        'prototypage rapide 31',
        'fabrication additive sur-mesure',
        'réparation pièces impression 3D',
        'modélisme impression 3D professionnel',
        'services impression 3D industrielle',
        'pièces détachées impression 3D',
        'consultation technique impression 3D',
        'matériaux impression 3D PLA ABS PETG',
        'devis impression 3D personnalisé',
    ],
    openGraph: {
        title: `Prestations d'impression 3D professionnelles - ${COMPANY_INFO.name}`,
        description:
            "Services d'impression 3D complets pour professionnels et particuliers : prototypage, fabrication, conseil technique et accompagnement personnalisé.",
        type: 'website',
        locale: 'fr_FR',
        siteName: COMPANY_INFO.name,
        url: `${COMPANY_INFO.siteUrl}/prestations`,
        images: [
            {
                url: `${COMPANY_INFO.siteUrl}/logos/hexoprint-logo-impression-3d-with-text-1200x628.png`,
                width: 1200,
                height: 630,
                alt: `${COMPANY_INFO.name} - Prestations impression 3D professionnelles`,
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: `Prestations d'impression 3D professionnelles - ${COMPANY_INFO.name}`,
        description:
            "Services d'impression 3D complets pour professionnels et particuliers : prototypage, fabrication, conseil technique.",
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
        canonical: `${COMPANY_INFO.siteUrl}/prestations`,
    },
};

export default function PrestationsPage() {
    return (
        <main className="min-h-screen">
            <PrestationsHero />
            <Prestations />
            <ProcessusTravail />
            <MaterialsExpertise />
            <CallToAction />

            {/* Schema.org JSON-LD pour les prestations */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'Service',
                        name: `Prestations d'impression 3D ${COMPANY_INFO.name}`,
                        description:
                            "Services complets d'impression 3D pour professionnels et particuliers : prototypage rapide, fabrication sur-mesure, conseil technique.",
                        url: `${COMPANY_INFO.siteUrl}/prestations`,
                        provider: {
                            '@type': 'LocalBusiness',
                            name: COMPANY_INFO.name,
                            url: COMPANY_INFO.siteUrl,
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
                        },
                        serviceType: 'Impression 3D',
                        serviceArea: {
                            '@type': 'Country',
                            name: 'France',
                        },
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
                                {
                                    '@type': 'Offer',
                                    itemOffered: {
                                        '@type': 'Service',
                                        name: 'Conseil technique et accompagnement',
                                        description:
                                            'Expertise matériaux, optimisation de conception, formation technique',
                                        serviceType:
                                            'Conseil technique impression 3D',
                                    },
                                    eligibleRegion: {
                                        '@type': 'Country',
                                        name: 'France',
                                    },
                                },
                            ],
                        },
                        makesOffer: COMPANY_INFO.expertise.materials.map(
                            (material) => ({
                                '@type': 'Offer',
                                itemOffered: {
                                    '@type': 'Product',
                                    name: `Impression 3D ${material}`,
                                    description: `Fabrication additive utilisant le matériau ${material}`,
                                    material: material,
                                },
                                seller: {
                                    '@type': 'LocalBusiness',
                                    name: COMPANY_INFO.name,
                                },
                            })
                        ),
                    }),
                }}
            />
        </main>
    );
}
