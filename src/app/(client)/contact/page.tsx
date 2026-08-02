import { ContactForm } from '@/components/sections/ContactForm';
import { ContactHero } from '@/components/sections/ContactHero';
import { ContactInfo } from '@/components/sections/ContactInfo';
import { ContactMap } from '@/components/sections/ContactMap';
import { COMPANY_INFO } from '@/lib/company-info';
import { getStaticSeoPage } from '@/lib/seo-config';
import { generateSEOMetadata } from '@/lib/seo-utils';

const seo = getStaticSeoPage('/contact');

export const metadata = generateSEOMetadata({
    title: seo.title,
    description: seo.description,
    path: seo.path,
});

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
