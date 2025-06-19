'use client';

import { Html as HeroFuturistic } from '@/components/hero-futuristic';

export function PrestationsHero() {
    return (
        <section className='relative'>
            <HeroFuturistic
                title='NOS PRESTATIONS'
                subtitle="De l'idée à la réalisation, une expertise complète."
                buttonText='Découvrez nos services'
            />
        </section>
    );
}
