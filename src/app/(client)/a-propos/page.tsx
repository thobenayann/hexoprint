import { AboutContent } from '@/components/sections/AboutContent';
import { AboutHero } from '@/components/sections/AboutHero';
import { AboutInfos } from '@/components/sections/AboutInfos';
import { CallToAction } from '@/components/sections/CallToAction';
import { COMPANY_INFO } from '@/lib/company-info';
import { getMaterials } from '@/lib/materials-utils';
import { getStaticSeoPage } from '@/lib/seo-config';
import { generateSEOMetadata } from '@/lib/seo-utils';
import { ABOUT_PAGE_DATA } from './constants';

const seo = getStaticSeoPage('/a-propos');

export const metadata = generateSEOMetadata({
    title: seo.title,
    description: seo.description,
    path: seo.path,
});

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
