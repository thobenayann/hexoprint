import { COMPANY_INFO, formatPhone } from '@/lib/company-info';
import {
    Building2,
    FileText,
    Gavel,
    Globe,
    Mail,
    MapPin,
    Phone,
    Printer,
    ShieldCheck,
} from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Mentions Légales - Hexoprint | Impression 3D Professionnelle Seysses',
    description:
        "Mentions légales d'Hexoprint, spécialiste en impression 3D à Seysses (31). Informations légales, coordonnées et obligations réglementaires pour vos projets de fabrication additive.",
    keywords: [
        'mentions légales impression 3D',
        'Hexoprint Seysses',
        'auto-entrepreneur impression 3D',
        'fabrication additive Haute-Garonne',
        'prototypage rapide mentions légales',
        'artisan impression 3D Toulouse',
        'SIRET impression 3D',
        'réglementation fabrication additive',
    ],
    robots: 'index, follow',
    openGraph: {
        title: 'Mentions Légales - Hexoprint Impression 3D',
        description:
            "Informations légales d'Hexoprint, votre spécialiste en impression 3D à Seysses. Transparence et conformité pour vos projets de fabrication additive.",
        url: 'https://hexoprint.fr/mentions-legales',
        siteName: 'Hexoprint',
        locale: 'fr_FR',
        type: 'website',
    },
    alternates: {
        canonical: 'https://hexoprint.fr/mentions-legales',
    },
};

export default function MentionsLegalesPage() {
    const currentYear = new Date().getFullYear();

    return (
        <div className='min-h-screen bg-gradient-to-br from-background to-muted/30'>
            {/* Header Section */}
            <div className='relative overflow-hidden bg-hexo-blue-dark/50 text-white pt-16'>
                <div className='absolute inset-0 bg-[url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZGVmcz4KICAgIDxwYXR0ZXJuIGlkPSJkb3RzIiB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPgogICAgICA8Y2lyY2xlIGN4PSIxMCIgY3k9IjEwIiByPSIxIiBmaWxsPSIjZmZmZmZmIiBmaWxsLW9wYWNpdHk9IjAuMSIvPgogICAgPC9wYXR0ZXJuPgogIDwvZGVmcz4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2RvdHMpIi8+Cjwvc3ZnPgo=")] opacity-30'></div>
                <div className='container mx-auto px-4 py-16 relative z-10'>
                    <div className='max-w-4xl mx-auto text-center'>
                        <div className='flex items-center justify-center mb-6'>
                            <div className='p-3 bg-white/20 rounded-2xl backdrop-blur-sm border border-white/20'>
                                <Gavel className='w-8 h-8' />
                            </div>
                        </div>
                        <h1 className='text-4xl md:text-5xl font-bold mb-6'>
                            Mentions Légales
                        </h1>
                        <p className='text-xl text-white/90 leading-relaxed max-w-2xl mx-auto'>
                            Informations légales et réglementaires
                            d&apos;Hexoprint, votre spécialiste en impression 3D
                            à Seysses
                        </p>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className='container mx-auto px-4 py-16'>
                <div className='max-w-4xl mx-auto'>
                    <div className='space-y-12'>
                        {/* Identification de l'entreprise */}
                        <section className='bg-card rounded-xl p-8 shadow-lg border border-border/50'>
                            <h2 className='flex items-center text-2xl font-bold mb-6'>
                                <Building2 className='w-6 h-6 mr-3 text-primary' />
                                Identification de l&apos;entreprise
                            </h2>
                            <div className='grid md:grid-cols-2 gap-6'>
                                <div className='space-y-4'>
                                    <div>
                                        <h3 className='font-semibold text-lg mb-2'>
                                            Dénomination sociale
                                        </h3>
                                        <p className='text-muted-foreground'>
                                            {COMPANY_INFO.name}
                                        </p>
                                    </div>
                                    <div>
                                        <h3 className='font-semibold text-lg mb-2'>
                                            Représentant légal
                                        </h3>
                                        <p className='text-muted-foreground'>
                                            {COMPANY_INFO.founder} -
                                            Auto-entrepreneur (EI)
                                        </p>
                                    </div>
                                    <div>
                                        <h3 className='font-semibold text-lg mb-2'>
                                            Statut juridique
                                        </h3>
                                        <p className='text-muted-foreground'>
                                            {COMPANY_INFO.legal.status}
                                        </p>
                                    </div>
                                </div>
                                <div className='space-y-4'>
                                    <div>
                                        <h3 className='font-semibold text-lg mb-2'>
                                            SIRET
                                        </h3>
                                        <p className='text-muted-foreground font-mono'>
                                            {COMPANY_INFO.legal.siret}
                                        </p>
                                    </div>
                                    <div>
                                        <h3 className='font-semibold text-lg mb-2'>
                                            Secteur d&apos;activité
                                        </h3>
                                        <p className='text-muted-foreground'>
                                            Impression 3D, Fabrication additive,
                                            Prototypage rapide
                                        </p>
                                    </div>
                                    <div>
                                        <h3 className='font-semibold text-lg mb-2'>
                                            Zone de service
                                        </h3>
                                        <p className='text-muted-foreground'>
                                            Haute-Garonne (31) et France entière
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Coordonnées */}
                        <section className='bg-card rounded-xl p-8 shadow-lg border border-border/50'>
                            <h2 className='flex items-center text-2xl font-bold mb-6'>
                                <Phone className='w-6 h-6 mr-3 text-primary' />
                                Coordonnées de contact
                            </h2>
                            <div className='grid md:grid-cols-2 gap-6'>
                                <div className='space-y-4'>
                                    <div className='flex items-start space-x-3'>
                                        <MapPin className='w-5 h-5 text-primary flex-shrink-0 mt-1' />
                                        <div>
                                            <h3 className='font-semibold mb-1'>
                                                Adresse
                                            </h3>
                                            <p className='text-muted-foreground'>
                                                {
                                                    COMPANY_INFO.contact.address
                                                        .street
                                                }
                                                <br />
                                                {
                                                    COMPANY_INFO.contact.address
                                                        .postalCode
                                                }{' '}
                                                {
                                                    COMPANY_INFO.contact.address
                                                        .city
                                                }
                                                <br />
                                                {
                                                    COMPANY_INFO.contact.address
                                                        .department
                                                }
                                                ,{' '}
                                                {
                                                    COMPANY_INFO.contact.address
                                                        .country
                                                }
                                            </p>
                                        </div>
                                    </div>
                                    <div className='flex items-start space-x-3'>
                                        <Phone className='w-5 h-5 text-primary flex-shrink-0 mt-1' />
                                        <div>
                                            <h3 className='font-semibold mb-1'>
                                                Téléphone
                                            </h3>
                                            <p className='text-muted-foreground'>
                                                {formatPhone(
                                                    COMPANY_INFO.contact.phone
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className='space-y-4'>
                                    <div className='flex items-start space-x-3'>
                                        <Mail className='w-5 h-5 text-primary flex-shrink-0 mt-1' />
                                        <div>
                                            <h3 className='font-semibold mb-1'>
                                                Email
                                            </h3>
                                            <p className='text-muted-foreground'>
                                                {COMPANY_INFO.contact.email}
                                            </p>
                                        </div>
                                    </div>
                                    <div className='flex items-start space-x-3'>
                                        <Globe className='w-5 h-5 text-primary flex-shrink-0 mt-1' />
                                        <div>
                                            <h3 className='font-semibold mb-1'>
                                                Site web
                                            </h3>
                                            <p className='text-muted-foreground'>
                                                {COMPANY_INFO.website.url}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Hébergement */}
                        <section className='bg-card rounded-xl p-8 shadow-lg border border-border/50'>
                            <h2 className='flex items-center text-2xl font-bold mb-6'>
                                <Globe className='w-6 h-6 mr-3 text-primary' />
                                Hébergement du site
                            </h2>
                            <div>
                                <h3 className='font-semibold text-lg mb-2'>
                                    Hébergeur
                                </h3>
                                <p className='text-muted-foreground mb-4'>
                                    Ce site est hébergé par Vercel Inc.
                                </p>
                                <div className='bg-muted/50 p-4 rounded-lg'>
                                    <p className='text-sm text-muted-foreground'>
                                        <strong>Vercel Inc.</strong>
                                        <br />
                                        340 S Lemon Ave #4133
                                        <br />
                                        Walnut, CA 91789, États-Unis
                                        <br />
                                        <a
                                            href='https://vercel.com'
                                            className='text-primary hover:underline'
                                        >
                                            https://vercel.com
                                        </a>
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* Propriété intellectuelle */}
                        <section className='bg-card rounded-xl p-8 shadow-lg border border-border/50'>
                            <h2 className='flex items-center text-2xl font-bold mb-6'>
                                <ShieldCheck className='w-6 h-6 mr-3 text-primary' />
                                Propriété intellectuelle
                            </h2>
                            <div className='prose prose-sm max-w-none text-muted-foreground space-y-4'>
                                <p>
                                    L&apos;ensemble de ce site relève de la
                                    législation française et internationale sur
                                    le droit d&apos;auteur et la propriété
                                    intellectuelle. Tous les droits de
                                    reproduction sont réservés, y compris pour
                                    les documents téléchargeables et les
                                    représentations iconographiques et
                                    photographiques.
                                </p>
                                <p>
                                    La reproduction de tout ou partie de ce site
                                    sur un support électronique quelconque est
                                    formellement interdite sauf autorisation
                                    expresse du directeur de la publication.
                                </p>
                                <p>
                                    Les marques et logos figurant sur le site
                                    sont la propriété exclusive de{' '}
                                    {COMPANY_INFO.name} ou de ses partenaires.
                                    Toute reproduction ou représentation totale
                                    ou partielle de ces marques ou logos, seuls
                                    ou intégrés dans d&apos;autres éléments,
                                    sans autorisation expresse et préalable, est
                                    prohibée.
                                </p>
                            </div>
                        </section>

                        {/* Activité réglementée */}
                        <section className='bg-card rounded-xl p-8 shadow-lg border border-border/50'>
                            <h2 className='flex items-center text-2xl font-bold mb-6'>
                                <Printer className='w-6 h-6 mr-3 text-primary' />
                                Activité d&apos;impression 3D
                            </h2>
                            <div className='prose prose-sm max-w-none text-muted-foreground space-y-4'>
                                <p>
                                    {COMPANY_INFO.name} exerce une activité de
                                    fabrication additive (impression 3D)
                                    comprenant :
                                </p>
                                <ul className='list-disc pl-6 space-y-2'>
                                    <li>
                                        <strong>Prototypage rapide</strong> :
                                        création de prototypes fonctionnels et
                                        esthétiques pour l&apos;industrie
                                    </li>
                                    <li>
                                        <strong>
                                            Fabrication de pièces sur-mesure
                                        </strong>{' '}
                                        : production de pièces uniques ou en
                                        petite série
                                    </li>
                                    <li>
                                        <strong>
                                            Réparation par impression 3D
                                        </strong>{' '}
                                        : reproduction de pièces cassées ou
                                        obsolètes
                                    </li>
                                    <li>
                                        <strong>
                                            Services de modélisation
                                        </strong>{' '}
                                        : création et adaptation de modèles 3D
                                        pour l&apos;impression
                                    </li>
                                </ul>
                                <p>
                                    Matériaux utilisés : PLA, ABS, PETG, résine
                                    photopolymère, et autres matériaux certifiés
                                    pour l&apos;impression 3D.
                                </p>
                            </div>
                        </section>

                        {/* Responsabilité */}
                        <section className='bg-card rounded-xl p-8 shadow-lg border border-border/50'>
                            <h2 className='flex items-center text-2xl font-bold mb-6'>
                                <Gavel className='w-6 h-6 mr-3 text-primary' />
                                Limitation de responsabilité
                            </h2>
                            <div className='prose prose-sm max-w-none text-muted-foreground space-y-4'>
                                <p>
                                    Les informations contenues sur ce site sont
                                    aussi précises que possible et le site remis
                                    à jour à différentes périodes de
                                    l&apos;année, mais peut toutefois contenir
                                    des inexactitudes ou des omissions.
                                </p>
                                <p>
                                    Si vous constatez une lacune, erreur ou ce
                                    qui parait être un dysfonctionnement, merci
                                    de bien vouloir le signaler par email à
                                    l&apos;adresse {COMPANY_INFO.contact.email},
                                    en décrivant le problème de la manière la
                                    plus précise possible.
                                </p>
                                <p>
                                    {COMPANY_INFO.name} ne pourra être tenu
                                    responsable des dommages directs et
                                    indirects causés au matériel de
                                    l&apos;utilisateur, lors de l&apos;accès au
                                    site, et résultant soit de
                                    l&apos;utilisation d&apos;un matériel ne
                                    répondant pas aux spécifications techniques
                                    requises, soit de l&apos;apparition
                                    d&apos;un bug ou d&apos;une incompatibilité.
                                </p>
                            </div>
                        </section>

                        {/* Droit applicable */}
                        <section className='bg-card rounded-xl p-8 shadow-lg border border-border/50'>
                            <h2 className='flex items-center text-2xl font-bold mb-6'>
                                <FileText className='w-6 h-6 mr-3 text-primary' />
                                Droit applicable et juridiction
                            </h2>
                            <div className='prose prose-sm max-w-none text-muted-foreground space-y-4'>
                                <p>
                                    Tout litige en relation avec
                                    l&apos;utilisation du site{' '}
                                    {COMPANY_INFO.website.domain}
                                    est soumis au droit français. Il est fait
                                    attribution exclusive de juridiction aux
                                    tribunaux compétents de Toulouse.
                                </p>
                                <p>
                                    La langue de référence, pour le règlement de
                                    contentieux éventuels, est le français.
                                </p>
                            </div>
                        </section>

                        {/* Informations complémentaires */}
                        <section className='bg-card rounded-xl p-8 shadow-lg border border-border/50'>
                            <h2 className='flex items-center text-2xl font-bold mb-6'>
                                <ShieldCheck className='w-6 h-6 mr-3 text-primary' />
                                Informations complémentaires
                            </h2>
                            <div className='prose prose-sm max-w-none text-muted-foreground space-y-4'>
                                <p>
                                    <strong>
                                        Assurance responsabilité civile
                                        professionnelle :
                                    </strong>
                                    {COMPANY_INFO.name} est couvert par une
                                    assurance responsabilité civile
                                    professionnelle pour les activités
                                    d&apos;impression 3D et de fabrication
                                    additive.
                                </p>
                                <p>
                                    <strong>Déclaration CNIL :</strong> En
                                    application de la loi n°78-87 du 6 janvier
                                    1978 relative à l&apos;informatique, aux
                                    fichiers et aux libertés, les traitements
                                    automatisés de données nominatives réalisés
                                    à partir de ce site ont fait l&apos;objet
                                    d&apos;une déclaration simplifiée auprès de
                                    la Commission Nationale de
                                    l&apos;Informatique et des Libertés (CNIL).
                                </p>
                                <p>
                                    <strong>
                                        Médiation de la consommation :
                                    </strong>{' '}
                                    Conformément aux dispositions du Code de la
                                    consommation concernant le règlement amiable
                                    des litiges,
                                    {COMPANY_INFO.name} adhère au Service du
                                    Médiateur du e-commerce de la FEVAD
                                    (Fédération du e-commerce et de la vente à
                                    distance) dont les coordonnées sont les
                                    suivantes : 60 Rue La Boétie – 75008 Paris –
                                    <a
                                        href='http://www.mediateurfevad.fr'
                                        className='text-primary hover:underline'
                                    >
                                        http://www.mediateurfevad.fr
                                    </a>
                                </p>
                            </div>
                        </section>
                    </div>

                    {/* Footer */}
                    <div className='mt-16 text-center'>
                        <div className='bg-muted/30 p-6 rounded-lg'>
                            <p className='text-sm text-muted-foreground'>
                                <strong>Dernière mise à jour :</strong>{' '}
                                {new Date().toLocaleDateString('fr-FR', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                })}
                            </p>
                            <div className='mt-4 pt-4 border-t border-border/50'>
                                <p className='text-xs text-muted-foreground'>
                                    © {currentYear} {COMPANY_INFO.name} -{' '}
                                    {COMPANY_INFO.founder}. Tous droits
                                    réservés. |
                                    <span className='ml-2'>
                                        Spécialiste impression 3D Seysses |
                                        Fabrication additive Haute-Garonne
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
