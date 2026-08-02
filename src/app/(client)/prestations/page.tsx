import { CallToAction } from '@/components/sections/CallToAction';
import { MaterialsExpertise } from '@/components/sections/MaterialsExpertise';
import { Prestations } from '@/components/sections/Prestations';
import { PrestationsHero } from '@/components/sections/PrestationsHero';
import { ProcessusTravail } from '@/components/sections/ProcessusTravail';
import { COMPANY_INFO } from '@/lib/company-info';
import { getStaticSeoPage } from '@/lib/seo-config';
import { generateSEOMetadata } from '@/lib/seo-utils';

const seo = getStaticSeoPage('/prestations');

export const metadata = generateSEOMetadata({
    title: seo.title,
    description: seo.description,
    path: seo.path,
});

export default function PrestationsPage() {
    return (
        <main className="min-h-screen">
            <header className="container mx-auto px-4 pt-24 pb-10 text-center">
                <h1 className="font-orbitron text-3xl font-bold tracking-tight md:text-5xl">
                    Prestations d’impression 3D sur mesure
                </h1>
                <p className="mx-auto mt-4 max-w-3xl text-muted-foreground md:text-lg">
                    Prototypage, réparation et fabrication de pièces
                    personnalisées pour les particuliers et les professionnels
                    près de Toulouse.
                </p>
            </header>
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
