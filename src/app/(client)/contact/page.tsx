import { ContactForm } from '@/components/sections/ContactForm';
import { ContactHero } from '@/components/sections/ContactHero';
import { ContactInfo } from '@/components/sections/ContactInfo';
import { ContactMap } from '@/components/sections/ContactMap';
import { StructuredData } from '@/components/seo/structured-data';
import { COMPANY_INFO } from '@/lib/company-info';
import { getStaticSeoPage } from '@/lib/seo-config';
import {
    BUSINESS_ID,
    generateBreadcrumbStructuredData,
    generateSEOMetadata,
} from '@/lib/seo-utils';

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

            <StructuredData
                id="hexoprint-contact"
                data={[
                    {
                        '@context': 'https://schema.org',
                        '@type': 'ContactPage',
                        name: `Contact ${COMPANY_INFO.name}`,
                        url: new URL('/contact', COMPANY_INFO.siteUrl).toString(),
                        mainEntity: { '@id': BUSINESS_ID },
                    },
                    generateBreadcrumbStructuredData([
                        { name: 'Accueil', url: new URL('/', COMPANY_INFO.siteUrl).toString() },
                        { name: 'Contact', url: new URL('/contact', COMPANY_INFO.siteUrl).toString() },
                    ]),
                ]}
            />
        </main>
    );
}
