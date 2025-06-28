import { CallToAction } from '@/components/sections/CallToAction';
import { GalleryPreview } from '@/components/sections/GalleryPreview';
import { HeroSection } from '@/components/sections/HeroSection';
import { TargetAudience } from '@/components/sections/TargetAudience';
import { Testimonials } from '@/components/sections/Testimonials';
import { WhyHexoprint } from '@/components/sections/WhyHexoprint';
import { Suspense } from 'react';

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
        </main>
    );
}
