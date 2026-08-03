import { CallToAction } from '@/components/sections/CallToAction';
import { GalleryContentWrapper } from '@/components/sections/GalleryContentWrapper';
import { GalleryFilters } from '@/components/sections/GalleryFilters';
import { GalleryHero } from '@/components/sections/GalleryHero';
import { StructuredData } from '@/components/seo/structured-data';
import { COMPANY_INFO } from '@/lib/company-info';
import { getStaticSeoPage } from '@/lib/seo-config';
import {
    BUSINESS_ID,
    generateBreadcrumbStructuredData,
    generateSEOMetadata,
} from '@/lib/seo-utils';
import { sanityFetch } from '@/sanity/lib/live';
import { Suspense } from 'react';

const seo = getStaticSeoPage('/galerie');

export const metadata = generateSEOMetadata({
    title: seo.title,
    description: seo.description,
    path: seo.path,
});

// Fallback pour le chargement du contenu de la galerie
function GalleryContentFallback() {
    return (
        <section className="py-24 bg-gradient-to-br from-muted/20 via-background to-muted/30">
            <div className="container mx-auto px-4">
                {/* Skeleton pour les filtres */}
                <div className="mb-12 flex flex-wrap gap-4 justify-center">
                    {Array.from({ length: 6 }).map((_, index) => (
                        <div
                            key={index}
                            className="h-10 w-24 bg-muted rounded-lg animate-pulse"
                        />
                    ))}
                </div>

                {/* Skeleton pour la grille de galerie */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {Array.from({ length: 12 }).map((_, index) => (
                        <div key={index} className="animate-pulse">
                            <div className="bg-muted rounded-lg aspect-square mb-4" />
                            <div className="h-6 bg-muted rounded mb-2" />
                            <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                            <div className="h-3 bg-muted rounded w-1/2" />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default async function GalleriePage() {
    // Récupération des matériaux côté serveur
    const query = `*[_type == "gallery" && defined(material) && material != null && material != ""]{material}`;
    const { data } = await sanityFetch({ query });
    const materials = Array.isArray(data)
        ? Array.from(
              new Set(
                  data
                      .map((m: { material?: string } | string) =>
                          typeof m === 'string' ? m : m.material || ''
                      )
                      .filter(Boolean)
              )
          )
        : [];

    return (
        <main className="min-h-screen">
            {/* Hero Section */}
            <GalleryHero />

            {/* Contenu principal avec filtres et galerie */}
            <Suspense fallback={<GalleryContentFallback />}>
                <GalleryFilters materials={materials} />
                <GalleryContentWrapper />
            </Suspense>

            {/* Call to Action */}
            <CallToAction />

            <StructuredData
                id="hexoprint-galerie"
                data={[
                    {
                        '@context': 'https://schema.org',
                        '@type': 'ImageGallery',
                        name: "Galerie de réalisations Hexo'print",
                        url: new URL('/galerie', COMPANY_INFO.siteUrl).toString(),
                        publisher: { '@id': BUSINESS_ID },
                    },
                    generateBreadcrumbStructuredData([
                        { name: 'Accueil', url: new URL('/', COMPANY_INFO.siteUrl).toString() },
                        { name: 'Galerie', url: new URL('/galerie', COMPANY_INFO.siteUrl).toString() },
                    ]),
                ]}
            />
        </main>
    );
}
