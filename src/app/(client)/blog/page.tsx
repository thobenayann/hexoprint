import { BlogContent } from '@/components/sections/BlogContent';
import { BlogFilters } from '@/components/sections/BlogFilters';
import { BlogHero } from '@/components/sections/BlogHero';
import { CallToAction } from '@/components/sections/CallToAction';
import { COMPANY_INFO } from '@/lib/company-info';
import { getStaticSeoPage } from '@/lib/seo-config';
import { generateSEOMetadata } from '@/lib/seo-utils';
import { Suspense } from 'react';

// Composant de fallback pour le chargement
function BlogContentFallback() {
    return (
        <div className="container mx-auto px-4 py-16">
            <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
                        <div
                            key={i}
                            className="bg-card rounded-2xl border border-border animate-pulse"
                        >
                            <div className="aspect-video bg-muted rounded-t-2xl"></div>
                            <div className="p-6 space-y-3">
                                <div className="h-4 bg-muted rounded w-3/4"></div>
                                <div className="h-4 bg-muted rounded w-1/2"></div>
                                <div className="space-y-2">
                                    <div className="h-3 bg-muted rounded"></div>
                                    <div className="h-3 bg-muted rounded w-5/6"></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

// Composant de fallback pour les filtres
function BlogFiltersFallback() {
    return (
        <section className="py-8 md:py-12 border-b border-border">
            <div className="container mx-auto px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="flex flex-wrap gap-3 justify-center">
                        {[...Array(5)].map((_, i) => (
                            <div
                                key={i}
                                className="h-10 bg-muted rounded-full w-24 animate-pulse"
                            ></div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

const seo = getStaticSeoPage('/blog');

export const metadata = generateSEOMetadata({
    title: seo.title,
    description: seo.description,
    path: seo.path,
});

export default function BlogPage() {
    return (
        <main className="min-h-screen">
            {/* Hero Section */}
            <BlogHero />

            {/* Filtres de blog */}
            <Suspense fallback={<BlogFiltersFallback />}>
                <BlogFilters />
            </Suspense>

            {/* Contenu principal avec Suspense pour le chargement */}
            <Suspense fallback={<BlogContentFallback />}>
                <BlogContent />
            </Suspense>

            {/* Call to Action */}
            <CallToAction />

            {/* Schema.org JSON-LD pour la page blog */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'Blog',
                        name: `Blog ${COMPANY_INFO.name}`,
                        description:
                            "Blog d'expertise en impression 3D : conseils, guides techniques et inspirations créatives.",
                        url: `${COMPANY_INFO.website.url}/blog`,
                        publisher: {
                            '@type': 'LocalBusiness',
                            name: COMPANY_INFO.name,
                            url: COMPANY_INFO.website.url,
                            logo: {
                                '@type': 'ImageObject',
                                url: `${COMPANY_INFO.website.url}/logos/hexoprint-sans-text-no-bg-750x750.png`,
                            },
                        },
                        mainEntityOfPage: {
                            '@type': 'WebPage',
                            '@id': `${COMPANY_INFO.website.url}/blog`,
                        },
                        inLanguage: 'fr-FR',
                    }),
                }}
            />
        </main>
    );
}
