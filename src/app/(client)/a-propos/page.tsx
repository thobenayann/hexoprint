import { AboutContent } from '@/components/sections/AboutContent';
import { AboutHero } from '@/components/sections/AboutHero';
import { AboutInfos } from '@/components/sections/AboutInfos';
import { CallToAction } from '@/components/sections/CallToAction';
import { COMPANY_INFO } from '@/lib/company-info';
import { getMaterials } from '@/lib/materials-utils';
import type { Metadata } from 'next';
import { ABOUT_PAGE_DATA, ABOUT_PAGE_SEO } from './constants';

export const metadata: Metadata = {
    title: ABOUT_PAGE_SEO.title,
    description: ABOUT_PAGE_SEO.description,
    keywords: ABOUT_PAGE_SEO.keywords,
    openGraph: {
        title: ABOUT_PAGE_SEO.title,
        description: ABOUT_PAGE_SEO.description,
        type: 'website',
        locale: 'fr_FR',
        siteName: "Hexo'print",
        images: [
            {
                url: '/logos/hexoprint-logo-impression-3d-with-text-1200x628.png',
                width: 1200,
                height: 628,
                alt: "Hexo'print - Spécialiste impression 3D",
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: ABOUT_PAGE_SEO.title,
        description: ABOUT_PAGE_SEO.description,
        images: ['/logos/hexoprint-logo-impression-3d-with-text-1200x628.png'],
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
        canonical: `${COMPANY_INFO.siteUrl}/a-propos`,
    },
};

export default async function AboutPage() {
    // Récupération des matériaux depuis Sanity avec fallback
    const materials = await getMaterials();

    return (
        <main className="min-h-screen pt-16">
            {/* Hero Section avec vidéo background */}
            <AboutHero
                title={ABOUT_PAGE_DATA.hero.title}
                subtitle={ABOUT_PAGE_DATA.hero.subtitle}
                description={ABOUT_PAGE_DATA.hero.description}
            />

            {/* Contenu principal */}
            <AboutContent
                mainContent={ABOUT_PAGE_DATA.content.mainContent}
                mission={ABOUT_PAGE_DATA.content.mission}
                expertise={ABOUT_PAGE_DATA.content.expertise}
            />

            {/* Informations détaillées */}
            <AboutInfos
                values={ABOUT_PAGE_DATA.infos.values}
                materials={materials}
                location={ABOUT_PAGE_DATA.infos.location}
            />

            {/* Call to Action */}
            <CallToAction />

            {/* Schema.org JSON-LD pour le SEO */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'LocalBusiness',
                        name: COMPANY_INFO.name,
                        description:
                            'Spécialiste en impression 3D artisanale et sur-mesure à Seysses, Haute-Garonne',
                        url: COMPANY_INFO.website.url,
                        address: {
                            '@type': 'PostalAddress',
                            streetAddress: COMPANY_INFO.contact.address.street,
                            addressLocality: COMPANY_INFO.contact.address.city,
                            addressRegion:
                                COMPANY_INFO.contact.address.department,
                            postalCode: COMPANY_INFO.contact.address.postalCode,
                            addressCountry: 'FR',
                        },
                        founder: {
                            '@type': 'Person',
                            name: COMPANY_INFO.founder,
                        },
                        telephone: COMPANY_INFO.contact.phone,
                        email: COMPANY_INFO.contact.email,
                        serviceArea: {
                            '@type': 'Country',
                            name: 'France',
                        },
                        knowsAbout: [
                            'Impression 3D',
                            'Fabrication additive',
                            'Prototypage rapide',
                            'Modélisme',
                            ...materials.map(
                                (material) => `Matériaux ${material}`
                            ),
                        ],
                        hasOfferCatalog: {
                            '@type': 'OfferCatalog',
                            name: "Services d'impression 3D",
                            itemListElement: [
                                {
                                    '@type': 'Offer',
                                    itemOffered: {
                                        '@type': 'Service',
                                        name: 'Impression 3D pour professionnels',
                                        description:
                                            'Prototypage rapide et fabrication de pièces industrielles',
                                    },
                                },
                                {
                                    '@type': 'Offer',
                                    itemOffered: {
                                        '@type': 'Service',
                                        name: 'Impression 3D pour particuliers',
                                        description:
                                            'Objets personnalisés, modélisme et créations sur-mesure',
                                    },
                                },
                            ],
                        },
                    }),
                }}
            />
        </main>
    );
}
