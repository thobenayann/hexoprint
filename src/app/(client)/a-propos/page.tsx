import { AboutContent } from '@/components/sections/AboutContent';
import { AboutHero } from '@/components/sections/AboutHero';
import { AboutInfos } from '@/components/sections/AboutInfos';
import { CallToAction } from '@/components/sections/CallToAction';
import { StructuredData } from '@/components/seo/structured-data';
import { COMPANY_INFO } from '@/lib/company-info';
import { getMaterials } from '@/lib/materials-utils';
import { getStaticSeoPage } from '@/lib/seo-config';
import {
    BUSINESS_ID,
    generateBreadcrumbStructuredData,
    generateSEOMetadata,
} from '@/lib/seo-utils';
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

            <StructuredData
                id="hexoprint-a-propos"
                data={[
                    {
                        '@context': 'https://schema.org',
                        '@type': 'AboutPage',
                        url: new URL('/a-propos', COMPANY_INFO.siteUrl).toString(),
                        mainEntity: { '@id': BUSINESS_ID },
                    },
                    generateBreadcrumbStructuredData([
                        { name: 'Accueil', url: new URL('/', COMPANY_INFO.siteUrl).toString() },
                        { name: 'À propos', url: new URL('/a-propos', COMPANY_INFO.siteUrl).toString() },
                    ]),
                ]}
            />
        </main>
    );
}
