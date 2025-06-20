import { ContactForm } from '@/components/sections/ContactForm';
import { ContactHero } from '@/components/sections/ContactHero';
import { ContactInfo } from '@/components/sections/ContactInfo';
import { ContactMap } from '@/components/sections/ContactMap';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Contact - Demandez votre devis impression 3D personnalisé',
    description:
        'Contactez Hexo’print pour vos projets d&apos;impression 3D en Haute-Garonne. Devis gratuit, conseils techniques et accompagnement personnalisé pour tous vos besoins.',
    keywords: [
        'contact impression 3D Haute-Garonne',
        'devis impression 3D Toulouse',
        'demande devis prototypage 3D',
        'conseil impression 3D Seysses',
        'accompagnement projet 3D sur-mesure',
        'expertise impression 3D local',
        'fichier STL devis rapide',
        'impression 3D professionnel particulier',
    ],
    openGraph: {
        title: 'Contact Hexo’print - Votre expert impression 3D local',
        description:
            'Obtenez un devis personnalisé pour vos projets d&apos;impression 3D. Conseil technique, accompagnement et réalisation sur-mesure.',
        url: '/contact',
        images: [
            {
                url: '/logos/hexoprint-logo-impression-3d-with-text-1200x628.png',
                width: 1200,
                height: 628,
                alt: 'Hexo’print - Contact spécialiste impression 3D',
            },
        ],
    },
    twitter: {
        title: 'Contact Hexo’print - Devis impression 3D gratuit',
        description:
            'Contactez-nous pour votre projet d’impression 3D. Expertise locale, conseil technique et réalisation sur-mesure.',
    },
    alternates: {
        canonical: '/contact',
    },
};

export default function ContactPage() {
    return (
        <main className='min-h-screen'>
            <ContactHero />
            <div className='relative'>
                <ContactForm />
                <ContactInfo />
                <ContactMap />
            </div>
        </main>
    );
}
