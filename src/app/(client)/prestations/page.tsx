import { CallToAction } from '@/components/sections/CallToAction';
import { StructuredData } from '@/components/seo/structured-data';
import { MaterialsExpertise } from '@/components/sections/MaterialsExpertise';
import { Prestations } from '@/components/sections/Prestations';
import { PrestationsHero } from '@/components/sections/PrestationsHero';
import { ProcessusTravail } from '@/components/sections/ProcessusTravail';
import { COMPANY_INFO } from '@/lib/company-info';
import { getStaticSeoPage } from '@/lib/seo-config';
import {
    generateBreadcrumbStructuredData,
    generateSEOMetadata,
    generateServiceStructuredData,
} from '@/lib/seo-utils';

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

            <StructuredData
                id="hexoprint-prestations"
                data={[
                    generateServiceStructuredData({
                        name: "Prestations d'impression 3D sur mesure",
                        description:
                            'Prototypage, réparation et fabrication de pièces personnalisées pour les particuliers et les professionnels près de Toulouse.',
                        url: new URL('/prestations', COMPANY_INFO.siteUrl).toString(),
                        serviceType: 'Impression 3D',
                    }),
                    generateBreadcrumbStructuredData([
                        { name: 'Accueil', url: new URL('/', COMPANY_INFO.siteUrl).toString() },
                        { name: 'Prestations', url: new URL('/prestations', COMPANY_INFO.siteUrl).toString() },
                    ]),
                ]}
            />
        </main>
    );
}
