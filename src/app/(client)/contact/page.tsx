import { ContactForm } from '@/components/sections/ContactForm';
import { ContactHero } from '@/components/sections/ContactHero';
import { ContactInfo } from '@/components/sections/ContactInfo';
import { ContactMap } from '@/components/sections/ContactMap';
import { COMPANY_INFO } from '@/lib/company-info';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: `Contact - Demandez votre devis impression 3D personnalisé - ${COMPANY_INFO.name}`,
    description: `Contactez ${COMPANY_INFO.name} pour vos projets d'impression 3D en Haute-Garonne. Devis gratuit, conseils techniques et accompagnement personnalisé pour tous vos besoins.`,
    keywords: [
        'contact impression 3D Haute-Garonne',
        'devis impression 3D Toulouse',
        'demande devis prototypage 3D',
        'conseil impression 3D Seysses',
        'accompagnement projet 3D sur-mesure',
        'expertise impression 3D local',
        'fichier STL devis rapide',
        'impression 3D professionnel particulier',
        'contact Hexoprint 31600',
        'téléphone impression 3D Seysses',
        'email conseil technique 3D',
        'rendez-vous impression 3D Toulouse',
    ],
    openGraph: {
        title: `Contact ${COMPANY_INFO.name} - Votre expert impression 3D local`,
        description:
            "Obtenez un devis personnalisé pour vos projets d'impression 3D. Conseil technique, accompagnement et réalisation sur-mesure.",
        type: 'website',
        locale: 'fr_FR',
        siteName: COMPANY_INFO.name,
        url: `${COMPANY_INFO.siteUrl}/contact`,
        images: [
            {
                url: `${COMPANY_INFO.siteUrl}/logos/hexoprint-logo-impression-3d-with-text-1200x628.png`,
                width: 1200,
                height: 628,
                alt: `${COMPANY_INFO.name} - Contact spécialiste impression 3D`,
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: `Contact ${COMPANY_INFO.name} - Devis impression 3D gratuit`,
        description:
            "Contactez-nous pour votre projet d'impression 3D. Expertise locale, conseil technique et réalisation sur-mesure.",
        images: [
            `${COMPANY_INFO.siteUrl}/logos/hexoprint-logo-impression-3d-with-text-1200x628.png`,
        ],
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
        canonical: `${COMPANY_INFO.siteUrl}/contact`,
    },
};

export default function ContactPage() {
    return (
        <main className="min-h-screen">
            <ContactHero />
            <div className="relative">
                <ContactForm />
                <ContactInfo />
                <ContactMap />
            </div>

            {/* Schema.org JSON-LD pour la page contact */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'ContactPage',
                        name: `Contact ${COMPANY_INFO.name}`,
                        description:
                            "Page de contact pour obtenir un devis personnalisé d'impression 3D et bénéficier de conseils techniques.",
                        url: `${COMPANY_INFO.siteUrl}/contact`,
                        mainEntity: {
                            '@type': 'LocalBusiness',
                            name: COMPANY_INFO.name,
                            url: COMPANY_INFO.siteUrl,
                            telephone: COMPANY_INFO.contact.phone,
                            email: COMPANY_INFO.contact.email,
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
                            geo: {
                                '@type': 'GeoCoordinates',
                                latitude: '43.4973',
                                longitude: '1.3094',
                            },
                            openingHours: [
                                'Mo-Fr 09:00-18:00',
                                'Sa 09:00-12:00',
                            ],
                            contactPoint: {
                                '@type': 'ContactPoint',
                                telephone: COMPANY_INFO.contact.phone,
                                email: COMPANY_INFO.contact.email,
                                contactType: 'customer service',
                                areaServed: 'FR',
                                availableLanguage: 'French',
                                serviceType:
                                    'Impression 3D et fabrication additive',
                            },
                        },
                        potentialAction: {
                            '@type': 'ContactAction',
                            target: `${COMPANY_INFO.siteUrl}/contact`,
                            name: 'Demander un devis impression 3D',
                        },
                    }),
                }}
            />
        </main>
    );
}
