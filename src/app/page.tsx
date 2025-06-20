import { CallToAction } from '@/components/sections/CallToAction';
import { GalleryPreview } from '@/components/sections/GalleryPreview';
import { HeroSection } from '@/components/sections/HeroSection';
import { TargetAudience } from '@/components/sections/TargetAudience';
import { Testimonials } from '@/components/sections/Testimonials';
import { WhyHexoprint } from '@/components/sections/WhyHexoprint';

export default function Home() {
    return (
        <main className='min-h-screen'>
            <HeroSection />
            <WhyHexoprint />
            <TargetAudience />
            <GalleryPreview />
            <Testimonials />
            <CallToAction />
        </main>
    );
}
