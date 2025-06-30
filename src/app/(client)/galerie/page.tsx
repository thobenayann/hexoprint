import { CallToAction } from '@/components/sections/CallToAction';
import { GalleryContentWrapper } from '@/components/sections/GalleryContentWrapper';
import { GalleryFilters } from '@/components/sections/GalleryFilters';
import { GalleryHero } from '@/components/sections/GalleryHero';
import { COMPANY_INFO } from '@/lib/company-info';
import { sanityFetch } from '@/sanity/lib/live';
import type { Metadata } from 'next';
import { Suspense } from 'react';

// SEO optimisé pour la galerie
export const metadata: Metadata = {
    title: "Galerie de nos réalisations - Impression 3D Hexo'print",
    description:
        "Découvrez notre galerie de réalisations d'impression 3D : prototypage industriel, modélisme, pièces sur-mesure et créations artistiques. Haute-Garonne, France.",
    keywords: [
        'galerie impression 3D',
        'réalisations impression 3D',
        'portfolio impression 3D',
        'exemples impression 3D',
        'prototypes 3D',
        'modélisme 3D',
        'pièces personnalisées 3D',
        'créations 3D Haute-Garonne',
        'projets impression 3D',
        'références client Hexoprint',
    ],
    openGraph: {
        title: "Galerie de nos réalisations - Impression 3D Hexo'print",
        description:
            "Découvrez notre galerie de réalisations d'impression 3D : prototypage industriel, modélisme, pièces sur-mesure et créations artistiques.",
        type: 'website',
        locale: 'fr_FR',
        siteName: "Hexo'print",
        url: `${COMPANY_INFO.website.url}/galerie`,
        images: [
            {
                url: '/logos/hexoprint-logo-impression-3d-with-text-1200x628.png',
                width: 1200,
                height: 628,
                alt: "Galerie des réalisations Hexo'print - Impression 3D",
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: "Galerie de nos réalisations - Impression 3D Hexo'print",
        description:
            "Découvrez notre galerie de réalisations d'impression 3D : prototypage industriel, modélisme, pièces sur-mesure et créations artistiques.",
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
        canonical: `${COMPANY_INFO.website.url}/galerie`,
    },
};

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

            {/* Schema.org JSON-LD pour le SEO */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'ImageGallery',
                        name: "Galerie de réalisations Hexo'print",
                        description:
                            "Portfolio de nos créations d'impression 3D : prototypage, modélisme, pièces industrielles et créations artistiques",
                        url: `${COMPANY_INFO.website.url}/galerie`,
                        publisher: {
                            '@type': 'LocalBusiness',
                            name: COMPANY_INFO.name,
                            url: COMPANY_INFO.website.url,
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
                        },
                        serviceArea: {
                            '@type': 'Country',
                            name: 'France',
                        },
                        about: [
                            'Impression 3D',
                            'Prototypage rapide',
                            'Modélisme',
                            'Fabrication additive',
                            'Pièces sur-mesure',
                        ],
                    }),
                }}
            />
        </main>
    );
}
