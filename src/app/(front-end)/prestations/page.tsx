import { CallToAction } from '@/components/sections/CallToAction';
import { MaterialsExpertise } from '@/components/sections/MaterialsExpertise';
import { Prestations } from '@/components/sections/Prestations';
import { PrestationsHero } from '@/components/sections/PrestationsHero';
import { ProcessusTravail } from '@/components/sections/ProcessusTravail';

export default function PrestationsPage() {
    return (
        <main className='min-h-screen'>
            <PrestationsHero />
            <Prestations />
            <ProcessusTravail />
            <MaterialsExpertise />
            <CallToAction />
        </main>
    );
}
