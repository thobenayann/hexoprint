import { COMPANY_INFO } from '@/lib/company-info';
import { getStaticSeoPage } from '@/lib/seo-config';
import { generateSEOMetadata } from '@/lib/seo-utils';
import {
    AlertTriangle,
    Cookie,
    Database,
    Eye,
    Globe,
    Lock,
    Mail,
    Printer,
    Settings,
    Shield,
    Users,
} from 'lucide-react';
const seo = getStaticSeoPage('/politique-confidentialite');

export const metadata = generateSEOMetadata({
    title: seo.title,
    description: seo.description,
    path: seo.path,
});

export default function PolitiqueConfidentialitePage() {
    const currentDate = new Date().toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    return (
        <main className="min-h-screen bg-gradient-to-br from-background to-muted/30">
            {/* Header Section */}
            <div className="relative overflow-hidden bg-hexo-blue-dark/50 text-white pt-16">
                <div className='absolute inset-0 bg-[url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZGVmcz4KICAgIDxwYXR0ZXJuIGlkPSJkb3RzIiB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPgogICAgICA8Y2lyY2xlIGN4PSIxMCIgY3k9IjEwIiByPSIxIiBmaWxsPSIjZmZmZmZmIiBmaWxsLW9wYWNpdHk9IjAuMSIvPgogICAgPC9wYXR0ZXJuPgogIDwvZGVmcz4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2RvdHMpIi8+Cjwvc3ZnPgo=")] opacity-30'></div>
                <div className="container mx-auto px-4 py-16 relative z-10">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="flex items-center justify-center mb-6">
                            <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm border border-white/20">
                                <Shield className="w-8 h-8" />
                            </div>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold mb-6">
                            Politique de Confidentialité
                        </h1>
                        <p className="text-xl text-white/90 leading-relaxed max-w-2xl mx-auto">
                            Protection et respect de vos données personnelles
                            conformément au RGPD. Votre confiance est notre
                            priorité absolue.
                        </p>
                        <div className="flex items-center justify-center gap-4 mt-8 text-sm">
                            <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full">
                                <Shield className="w-4 h-4" />
                                <span>RGPD Conforme</span>
                            </div>
                            <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full">
                                <Lock className="w-4 h-4" />
                                <span>Données Sécurisées</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-16">
                <div className="max-w-4xl mx-auto">
                    <div className="space-y-12">
                        {/* Introduction */}
                        <section className="bg-card rounded-xl p-8 shadow-lg border border-border/50">
                            <h2 className="flex items-center text-2xl font-bold mb-6">
                                <Eye className="w-6 h-6 mr-3 text-primary" />
                                Introduction
                            </h2>
                            <div className="prose prose-sm max-w-none text-muted-foreground space-y-4">
                                <p>
                                    <strong>{COMPANY_INFO.name}</strong>,
                                    spécialiste en impression 3D basé à{' '}
                                    {COMPANY_INFO.contact.address.city},
                                    s&apos;engage à protéger et respecter votre
                                    vie privée. Cette politique de
                                    confidentialité explique comment nous
                                    collectons, utilisons, partageons et
                                    protégeons vos informations personnelles
                                    lorsque vous utilisez notre site web ou nos
                                    services d&apos;impression 3D.
                                </p>
                                <p>
                                    Cette politique est conforme au Règlement
                                    Général sur la Protection des Données (RGPD)
                                    et à la loi française Informatique et
                                    Libertés. Elle s&apos;applique à tous les
                                    services d&apos;impression 3D, de
                                    prototypage rapide et de fabrication
                                    additive que nous proposons.
                                </p>
                                <div className="bg-primary/10 p-4 rounded-lg border border-primary/20">
                                    <p className="text-primary font-semibold mb-2">
                                        <AlertTriangle className="w-4 h-4 inline mr-2" />
                                        Mise à jour importante
                                    </p>
                                    <p className="text-sm">
                                        Dernière mise à jour : {currentDate}.
                                        Nous vous recommandons de consulter
                                        régulièrement cette page pour vous tenir
                                        informé de nos pratiques en matière de
                                        protection des données.
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* Responsable du traitement */}
                        <section className="bg-card rounded-xl p-8 shadow-lg border border-border/50">
                            <h2 className="flex items-center text-2xl font-bold mb-6">
                                <Users className="w-6 h-6 mr-3 text-primary" />
                                Responsable du traitement des données
                            </h2>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div>
                                        <h3 className="font-semibold text-lg mb-2">
                                            Entreprise
                                        </h3>
                                        <p className="text-muted-foreground">
                                            {COMPANY_INFO.name}
                                        </p>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg mb-2">
                                            Responsable
                                        </h3>
                                        <p className="text-muted-foreground">
                                            {COMPANY_INFO.founder}
                                        </p>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg mb-2">
                                            Statut
                                        </h3>
                                        <p className="text-muted-foreground">
                                            {COMPANY_INFO.legal.status}
                                        </p>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <h3 className="font-semibold text-lg mb-2">
                                            Adresse
                                        </h3>
                                        <p className="text-muted-foreground">
                                            {
                                                COMPANY_INFO.contact.address
                                                    .fullAddress
                                            }
                                        </p>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg mb-2">
                                            Contact
                                        </h3>
                                        <p className="text-muted-foreground">
                                            Email : {COMPANY_INFO.contact.email}
                                            <br />
                                            Téléphone :{' '}
                                            {COMPANY_INFO.contact.phone}
                                        </p>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg mb-2">
                                            SIRET
                                        </h3>
                                        <p className="text-muted-foreground font-mono">
                                            {COMPANY_INFO.legal.siret}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Données collectées */}
                        <section className="bg-card rounded-xl p-8 shadow-lg border border-border/50">
                            <h2 className="flex items-center text-2xl font-bold mb-6">
                                <Database className="w-6 h-6 mr-3 text-primary" />
                                Quelles données collectons-nous ?
                            </h2>
                            <div className="space-y-6">
                                <div>
                                    <h3 className="font-semibold text-lg mb-3 text-primary">
                                        1. Données d&apos;identification
                                    </h3>
                                    <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                                        <li>Nom et prénom</li>
                                        <li>Adresse email</li>
                                        <li>Numéro de téléphone</li>
                                        <li>
                                            Adresse postale (pour les
                                            livraisons)
                                        </li>
                                        <li>
                                            Nom de l&apos;entreprise (pour les
                                            professionnels)
                                        </li>
                                    </ul>
                                </div>

                                <div>
                                    <h3 className="font-semibold text-lg mb-3 text-primary">
                                        2. Données de projet d&apos;impression
                                        3D
                                    </h3>
                                    <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                                        <li>Fichiers 3D (STL, OBJ, etc.)</li>
                                        <li>
                                            Spécifications techniques des pièces
                                        </li>
                                        <li>
                                            Préférences de matériaux (PLA, ABS,
                                            PETG, résine)
                                        </li>
                                        <li>
                                            Instructions particulières de
                                            fabrication
                                        </li>
                                        <li>
                                            Photos de références pour les
                                            projets
                                        </li>
                                    </ul>
                                </div>

                                <div>
                                    <h3 className="font-semibold text-lg mb-3 text-primary">
                                        3. Données de navigation
                                    </h3>
                                    <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                                        <li>Adresse IP</li>
                                        <li>Type de navigateur et version</li>
                                        <li>Pages visitées sur notre site</li>
                                        <li>Temps passé sur le site</li>
                                        <li>
                                            Données de géolocalisation
                                            approximative
                                        </li>
                                    </ul>
                                </div>

                                <div>
                                    <h3 className="font-semibold text-lg mb-3 text-primary">
                                        4. Données de communication
                                    </h3>
                                    <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                                        <li>
                                            Messages via formulaire de contact
                                        </li>
                                        <li>Échanges par email</li>
                                        <li>
                                            Conversations téléphoniques (notes
                                            prises)
                                        </li>
                                        <li>Préférences de communication</li>
                                    </ul>
                                </div>
                            </div>
                        </section>

                        {/* Finalités du traitement */}
                        <section className="bg-card rounded-xl p-8 shadow-lg border border-border/50">
                            <h2 className="flex items-center text-2xl font-bold mb-6">
                                <Settings className="w-6 h-6 mr-3 text-primary" />
                                Pourquoi utilisons-nous vos données ?
                            </h2>
                            <div className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="bg-muted/50 p-4 rounded-lg">
                                        <div className="flex items-center mb-3">
                                            <Printer className="w-5 h-5 mr-2 text-primary" />
                                            <h3 className="font-semibold">
                                                Services d&apos;impression 3D
                                            </h3>
                                        </div>
                                        <ul className="text-sm text-muted-foreground space-y-1">
                                            <li>
                                                • Réalisation de vos projets
                                                d&apos;impression
                                            </li>
                                            <li>• Devis personnalisés</li>
                                            <li>• Suivi de commandes</li>
                                            <li>• Support technique</li>
                                        </ul>
                                    </div>

                                    <div className="bg-muted/50 p-4 rounded-lg">
                                        <div className="flex items-center mb-3">
                                            <Mail className="w-5 h-5 mr-2 text-primary" />
                                            <h3 className="font-semibold">
                                                Communication
                                            </h3>
                                        </div>
                                        <ul className="text-sm text-muted-foreground space-y-1">
                                            <li>• Réponse à vos demandes</li>
                                            <li>• Actualités impression 3D</li>
                                            <li>• Conseils techniques</li>
                                            <li>• Service après-vente</li>
                                        </ul>
                                    </div>

                                    <div className="bg-muted/50 p-4 rounded-lg">
                                        <div className="flex items-center mb-3">
                                            <Shield className="w-5 h-5 mr-2 text-primary" />
                                            <h3 className="font-semibold">
                                                Obligations légales
                                            </h3>
                                        </div>
                                        <ul className="text-sm text-muted-foreground space-y-1">
                                            <li>
                                                • Facturation et comptabilité
                                            </li>
                                            <li>• Déclarations fiscales</li>
                                            <li>• Archivage légal</li>
                                            <li>• Lutte anti-fraude</li>
                                        </ul>
                                    </div>

                                    <div className="bg-muted/50 p-4 rounded-lg">
                                        <div className="flex items-center mb-3">
                                            <Globe className="w-5 h-5 mr-2 text-primary" />
                                            <h3 className="font-semibold">
                                                Amélioration des services
                                            </h3>
                                        </div>
                                        <ul className="text-sm text-muted-foreground space-y-1">
                                            <li>
                                                • Analyse d&apos;audience du
                                                site
                                            </li>
                                            <li>• Optimisation des services</li>
                                            <li>
                                                • Développement de nouveaux
                                                matériaux
                                            </li>
                                            <li>• Études de satisfaction</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Base légale */}
                        <section className="bg-card rounded-xl p-8 shadow-lg border border-border/50">
                            <h2 className="flex items-center text-2xl font-bold mb-6">
                                <Lock className="w-6 h-6 mr-3 text-primary" />
                                Base légale du traitement
                            </h2>
                            <div className="space-y-4">
                                <div className="prose prose-sm max-w-none text-muted-foreground">
                                    <p>
                                        Conformément au RGPD, nous ne traitons
                                        vos données personnelles que sur la base
                                        des fondements juridiques suivants :
                                    </p>
                                </div>
                                <div className="grid gap-4">
                                    <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                                        <h3 className="font-semibold text-green-800 dark:text-green-400 mb-2">
                                            ✓ Exécution du contrat
                                        </h3>
                                        <p className="text-sm text-green-700 dark:text-green-300">
                                            Pour la réalisation de vos projets
                                            d&apos;impression 3D, le suivi des
                                            commandes et la facturation.
                                        </p>
                                    </div>

                                    <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                                        <h3 className="font-semibold text-blue-800 dark:text-blue-400 mb-2">
                                            ✓ Intérêt légitime
                                        </h3>
                                        <p className="text-sm text-blue-700 dark:text-blue-300">
                                            Pour l&apos;amélioration de nos
                                            services, la sécurité du site et la
                                            prospection commerciale pour nos
                                            clients existants.
                                        </p>
                                    </div>

                                    <div className="bg-purple-50 dark:bg-purple-950/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
                                        <h3 className="font-semibold text-purple-800 dark:text-purple-400 mb-2">
                                            ✓ Consentement
                                        </h3>
                                        <p className="text-sm text-purple-700 dark:text-purple-300">
                                            Pour l&apos;envoi de newsletters,
                                            l&apos;utilisation de cookies non
                                            essentiels et toute communication
                                            marketing.
                                        </p>
                                    </div>

                                    <div className="bg-orange-50 dark:bg-orange-950/20 p-4 rounded-lg border border-orange-200 dark:border-orange-800">
                                        <h3 className="font-semibold text-orange-800 dark:text-orange-400 mb-2">
                                            ✓ Obligation légale
                                        </h3>
                                        <p className="text-sm text-orange-700 dark:text-orange-300">
                                            Pour la comptabilité, les
                                            déclarations fiscales et
                                            l&apos;archivage conformément à la
                                            législation française.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Cookies */}
                        <section className="bg-card rounded-xl p-8 shadow-lg border border-border/50">
                            <h2 className="flex items-center text-2xl font-bold mb-6">
                                <Cookie className="w-6 h-6 mr-3 text-primary" />
                                Utilisation des cookies
                            </h2>
                            <div className="space-y-6">
                                <div className="prose prose-sm max-w-none text-muted-foreground">
                                    <p>
                                        Notre site utilise des cookies pour
                                        améliorer votre expérience de navigation
                                        et analyser l&apos;utilisation de nos
                                        services d&apos;impression 3D.
                                    </p>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <h3 className="font-semibold text-lg mb-3 text-primary">
                                            Cookies essentiels
                                        </h3>
                                        <p className="text-sm text-muted-foreground mb-3">
                                            Nécessaires au fonctionnement du
                                            site. Ils ne nécessitent pas votre
                                            consentement.
                                        </p>
                                        <ul className="text-sm text-muted-foreground space-y-1">
                                            <li>
                                                • Gestion des sessions
                                                utilisateur
                                            </li>
                                            <li>
                                                • Sécurité et authentification
                                            </li>
                                            <li>• Préférences de langue</li>
                                            <li>• Panier de devis</li>
                                        </ul>
                                    </div>

                                    <div>
                                        <h3 className="font-semibold text-lg mb-3 text-primary">
                                            Analytics sans cookies
                                        </h3>
                                        <p className="text-sm text-muted-foreground mb-3">
                                            Vercel Web Analytics mesure de façon
                                            agrégée les pages consultées et les
                                            interactions principales sans cookie
                                            publicitaire. Les événements
                                            personnalisés ne contiennent ni nom,
                                            ni adresse e-mail, ni téléphone, ni
                                            message, ni nom de fichier.
                                        </p>
                                        <ul className="text-sm text-muted-foreground space-y-1">
                                            <li>
                                                • Vercel Web Analytics (pages
                                                consultées et interactions
                                                agrégées)
                                            </li>
                                            <li>
                                                • Vercel Speed Insights collecte
                                                des mesures techniques de
                                                performance lorsque ce service
                                                est activé pour le projet
                                            </li>
                                            <li>
                                                • Pages populaires
                                                d&apos;impression 3D
                                            </li>
                                            <li>
                                                • Statistiques de navigation
                                                agrégées
                                            </li>
                                            <li>
                                                • Aucune identification
                                                individuelle
                                            </li>
                                        </ul>
                                    </div>
                                </div>

                                <div className="bg-muted/50 p-4 rounded-lg">
                                    <p className="text-sm text-muted-foreground">
                                        <strong>Gestion des cookies :</strong>{' '}
                                        Vous pouvez à tout moment modifier vos
                                        préférences de cookies via les
                                        paramètres de votre navigateur ou en
                                        nous contactant à l&apos;adresse{' '}
                                        {COMPANY_INFO.contact.email}.
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* Vos droits */}
                        <section className="bg-card rounded-xl p-8 shadow-lg border border-border/50">
                            <h2 className="flex items-center text-2xl font-bold mb-6">
                                <Users className="w-6 h-6 mr-3 text-primary" />
                                Vos droits sur vos données
                            </h2>
                            <div className="space-y-6">
                                <div className="prose prose-sm max-w-none text-muted-foreground">
                                    <p>
                                        Conformément au RGPD, vous disposez des
                                        droits suivants concernant vos données
                                        personnelles relatives à vos projets
                                        d&apos;impression 3D :
                                    </p>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <div className="bg-muted/50 p-4 rounded-lg">
                                            <h3 className="font-semibold mb-2">
                                                🔍 Droit d&apos;accès
                                            </h3>
                                            <p className="text-sm text-muted-foreground">
                                                Connaître les données que nous
                                                possédons sur vous et vos
                                                projets d&apos;impression.
                                            </p>
                                        </div>

                                        <div className="bg-muted/50 p-4 rounded-lg">
                                            <h3 className="font-semibold mb-2">
                                                ✏️ Droit de rectification
                                            </h3>
                                            <p className="text-sm text-muted-foreground">
                                                Corriger les informations
                                                inexactes ou incomplètes.
                                            </p>
                                        </div>

                                        <div className="bg-muted/50 p-4 rounded-lg">
                                            <h3 className="font-semibold mb-2">
                                                🗑️ Droit à l&apos;effacement
                                            </h3>
                                            <p className="text-sm text-muted-foreground">
                                                Demander la suppression de vos
                                                données (sous certaines
                                                conditions).
                                            </p>
                                        </div>

                                        <div className="bg-muted/50 p-4 rounded-lg">
                                            <h3 className="font-semibold mb-2">
                                                ⏸️ Droit à la limitation
                                            </h3>
                                            <p className="text-sm text-muted-foreground">
                                                Limiter l&apos;utilisation de
                                                vos données dans certains cas.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="bg-muted/50 p-4 rounded-lg">
                                            <h3 className="font-semibold mb-2">
                                                📦 Droit à la portabilité
                                            </h3>
                                            <p className="text-sm text-muted-foreground">
                                                Récupérer vos données dans un
                                                format structuré et lisible.
                                            </p>
                                        </div>

                                        <div className="bg-muted/50 p-4 rounded-lg">
                                            <h3 className="font-semibold mb-2">
                                                🚫 Droit d&apos;opposition
                                            </h3>
                                            <p className="text-sm text-muted-foreground">
                                                Vous opposer au traitement de
                                                vos données (marketing,
                                                profilage).
                                            </p>
                                        </div>

                                        <div className="bg-muted/50 p-4 rounded-lg">
                                            <h3 className="font-semibold mb-2">
                                                ❌ Retrait du consentement
                                            </h3>
                                            <p className="text-sm text-muted-foreground">
                                                Retirer votre consentement à
                                                tout moment.
                                            </p>
                                        </div>

                                        <div className="bg-muted/50 p-4 rounded-lg">
                                            <h3 className="font-semibold mb-2">
                                                ⚖️ Droit de réclamation
                                            </h3>
                                            <p className="text-sm text-muted-foreground">
                                                Déposer une plainte auprès de la
                                                CNIL si nécessaire.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-primary/10 p-4 rounded-lg border border-primary/20">
                                    <h3 className="font-semibold text-primary mb-2">
                                        📧 Comment exercer vos droits ?
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        Pour exercer l&apos;un de ces droits,
                                        contactez-nous par email à{' '}
                                        <a
                                            href={`mailto:${COMPANY_INFO.contact.email}`}
                                            className="text-primary hover:underline"
                                        >
                                            {COMPANY_INFO.contact.email}
                                        </a>{' '}
                                        ou par courrier à l&apos;adresse
                                        mentionnée dans nos mentions légales.
                                        Nous vous répondrons dans un délai de 30
                                        jours maximum.
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* Sécurité */}
                        <section className="bg-card rounded-xl p-8 shadow-lg border border-border/50">
                            <h2 className="flex items-center text-2xl font-bold mb-6">
                                <Lock className="w-6 h-6 mr-3 text-primary" />
                                Sécurité de vos données
                            </h2>
                            <div className="space-y-6">
                                <div className="prose prose-sm max-w-none text-muted-foreground">
                                    <p>
                                        La sécurité de vos données personnelles
                                        et de vos fichiers d&apos;impression 3D
                                        est notre priorité absolue. Nous mettons
                                        en place les mesures suivantes :
                                    </p>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <h3 className="font-semibold text-lg text-primary">
                                            Mesures techniques
                                        </h3>
                                        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                                            <li>
                                                Chiffrement SSL/TLS pour toutes
                                                les transmissions
                                            </li>
                                            <li>
                                                Sauvegarde sécurisée des
                                                fichiers 3D
                                            </li>
                                            <li>
                                                Accès restreint aux données
                                                personnelles
                                            </li>
                                            <li>
                                                Surveillance continue des
                                                systèmes
                                            </li>
                                            <li>
                                                Mises à jour de sécurité
                                                régulières
                                            </li>
                                        </ul>
                                    </div>

                                    <div className="space-y-4">
                                        <h3 className="font-semibold text-lg text-primary">
                                            Mesures organisationnelles
                                        </h3>
                                        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                                            <li>
                                                Formation à la protection des
                                                données
                                            </li>
                                            <li>
                                                Procédures de gestion des
                                                incidents
                                            </li>
                                            <li>
                                                Contrôle d&apos;accès physique
                                                aux locaux
                                            </li>
                                            <li>
                                                Destruction sécurisée des
                                                supports
                                            </li>
                                            <li>Audit de sécurité annuel</li>
                                        </ul>
                                    </div>
                                </div>

                                <div className="bg-red-50 dark:bg-red-950/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
                                    <h3 className="font-semibold text-red-800 dark:text-red-400 mb-2">
                                        🚨 En cas de violation de données
                                    </h3>
                                    <p className="text-sm text-red-700 dark:text-red-300">
                                        Conformément au RGPD, nous nous
                                        engageons à vous notifier dans les 72
                                        heures en cas de violation de vos
                                        données personnelles présentant un
                                        risque pour vos droits et libertés.
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* Conservation des données */}
                        <section className="bg-card rounded-xl p-8 shadow-lg border border-border/50">
                            <h2 className="flex items-center text-2xl font-bold mb-6">
                                <Database className="w-6 h-6 mr-3 text-primary" />
                                Durée de conservation
                            </h2>
                            <div className="space-y-6">
                                <div className="prose prose-sm max-w-none text-muted-foreground">
                                    <p>
                                        Nous ne conservons vos données que le
                                        temps nécessaire aux finalités pour
                                        lesquelles elles ont été collectées,
                                        conformément aux obligations légales :
                                    </p>
                                </div>

                                <div className="grid gap-4">
                                    <div className="bg-muted/50 p-4 rounded-lg border border-border/50">
                                        <h3 className="font-semibold mb-2">
                                            📋 Données de contact et devis
                                        </h3>
                                        <p className="text-sm text-muted-foreground">
                                            <strong>3 ans</strong> à compter du
                                            dernier contact pour les prospects
                                            non clients
                                        </p>
                                    </div>

                                    <div className="bg-muted/50 p-4 rounded-lg border border-border/50">
                                        <h3 className="font-semibold mb-2">
                                            🧾 Données de facturation
                                        </h3>
                                        <p className="text-sm text-muted-foreground">
                                            <strong>10 ans</strong> à compter de
                                            la clôture de l&apos;exercice
                                            comptable (obligation légale)
                                        </p>
                                    </div>

                                    <div className="bg-muted/50 p-4 rounded-lg border border-border/50">
                                        <h3 className="font-semibold mb-2">
                                            🗃️ Fichiers 3D et projets
                                        </h3>
                                        <p className="text-sm text-muted-foreground">
                                            <strong>2 ans</strong> après
                                            livraison pour d&apos;éventuelles
                                            reprises ou modifications
                                        </p>
                                    </div>

                                    <div className="bg-muted/50 p-4 rounded-lg border border-border/50">
                                        <h3 className="font-semibold mb-2">
                                            📊 Données de navigation
                                        </h3>
                                        <p className="text-sm text-muted-foreground">
                                            <strong>30 jours</strong> maximum
                                            pour les données anonymisées (Vercel
                                            Analytics)
                                        </p>
                                    </div>

                                    <div className="bg-muted/50 p-4 rounded-lg border border-border/50">
                                        <h3 className="font-semibold mb-2">
                                            📧 Données marketing
                                        </h3>
                                        <p className="text-sm text-muted-foreground">
                                            <strong>3 ans</strong> à compter du
                                            dernier contact ou retrait du
                                            consentement
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Transferts internationaux */}
                        <section className="bg-card rounded-xl p-8 shadow-lg border border-border/50">
                            <h2 className="flex items-center text-2xl font-bold mb-6">
                                <Globe className="w-6 h-6 mr-3 text-primary" />
                                Transferts de données
                            </h2>
                            <div className="space-y-4">
                                <div className="prose prose-sm max-w-none text-muted-foreground">
                                    <p>
                                        Vos données personnelles sont
                                        principalement traitées en France et
                                        dans l&apos;Union Européenne. Cependant,
                                        certains de nos prestataires peuvent
                                        être situés en dehors de l&apos;UE :
                                    </p>
                                </div>

                                <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                                    <h3 className="font-semibold text-blue-800 dark:text-blue-400 mb-2">
                                        🌍 Hébergement du site web
                                    </h3>
                                    <p className="text-sm text-blue-700 dark:text-blue-300">
                                        Notre site est hébergé par Vercel
                                        (États-Unis), certifié selon les clauses
                                        contractuelles types de la Commission
                                        européenne pour garantir un niveau de
                                        protection adéquat.
                                    </p>
                                </div>

                                <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                                    <h3 className="font-semibold text-green-800 dark:text-green-400 mb-2">
                                        🛡️ Garanties de protection
                                    </h3>
                                    <p className="text-sm text-green-700 dark:text-green-300">
                                        Tous les transferts vers des pays tiers
                                        respectent les mécanismes de transfert
                                        approuvés par la Commission européenne
                                        (clauses contractuelles types, décisions
                                        d&apos;adéquation).
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* Contact DPO */}
                        <section className="bg-card rounded-xl p-8 shadow-lg border border-border/50">
                            <h2 className="flex items-center text-2xl font-bold mb-6">
                                <Mail className="w-6 h-6 mr-3 text-primary" />
                                Nous contacter
                            </h2>
                            <div className="space-y-4">
                                <div className="prose prose-sm max-w-none text-muted-foreground">
                                    <p>
                                        Pour toute question concernant cette
                                        politique de confidentialité ou
                                        l&apos;exercice de vos droits sur vos
                                        données personnelles :
                                    </p>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="bg-primary/10 p-4 rounded-lg border border-primary/20">
                                        <h3 className="font-semibold text-primary mb-3">
                                            📧 Contact direct
                                        </h3>
                                        <div className="space-y-2 text-sm">
                                            <p>
                                                <strong>Email :</strong>{' '}
                                                {COMPANY_INFO.contact.email}
                                            </p>
                                            <p>
                                                <strong>Téléphone :</strong>{' '}
                                                {COMPANY_INFO.contact.phone}
                                            </p>
                                            <p>
                                                <strong>
                                                    Délai de réponse :
                                                </strong>{' '}
                                                30 jours maximum
                                            </p>
                                        </div>
                                    </div>

                                    <div className="bg-orange-50 dark:bg-orange-950/20 p-4 rounded-lg border border-orange-200 dark:border-orange-800">
                                        <h3 className="font-semibold text-orange-800 dark:text-orange-400 mb-3">
                                            ⚖️ Autorité de contrôle
                                        </h3>
                                        <div className="space-y-2 text-sm text-orange-700 dark:text-orange-300">
                                            <p>
                                                <strong>CNIL</strong>
                                            </p>
                                            <p>3 Place de Fontenoy</p>
                                            <p>
                                                TSA 80715 - 75334 Paris Cedex 07
                                            </p>
                                            <p>
                                                <a
                                                    href="https://www.cnil.fr"
                                                    className="text-primary hover:underline"
                                                >
                                                    www.cnil.fr
                                                </a>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Modifications */}
                        <section className="bg-card rounded-xl p-8 shadow-lg border border-border/50">
                            <h2 className="flex items-center text-2xl font-bold mb-6">
                                <Settings className="w-6 h-6 mr-3 text-primary" />
                                Modifications de cette politique
                            </h2>
                            <div className="prose prose-sm max-w-none text-muted-foreground space-y-4">
                                <p>
                                    Nous nous réservons le droit de modifier
                                    cette politique de confidentialité à tout
                                    moment pour nous conformer aux évolutions
                                    légales ou améliorer nos services
                                    d&apos;impression 3D.
                                </p>
                                <p>
                                    En cas de modification substantielle, nous
                                    vous en informerons par email ou via une
                                    notification sur notre site web au moins 30
                                    jours avant l&apos;entrée en vigueur des
                                    changements.
                                </p>
                                <p>
                                    La version actuelle de cette politique est
                                    datée du {currentDate} et remplace toutes
                                    les versions antérieures.
                                </p>
                            </div>
                        </section>
                    </div>

                    {/* Footer */}
                    <div className="mt-16 text-center">
                        <div className="bg-muted/30 p-6 rounded-lg">
                            <p className="text-sm text-muted-foreground mb-4">
                                <strong>Dernière mise à jour :</strong>{' '}
                                {currentDate}
                            </p>
                            <div className="pt-4 border-t border-border/50">
                                <p className="text-xs text-muted-foreground">
                                    Cette politique de confidentialité est
                                    conforme au RGPD et à la loi française
                                    Informatique et Libertés. Pour plus
                                    d&apos;informations sur vos droits,
                                    consultez le site de la CNIL :
                                    <a
                                        href="https://www.cnil.fr"
                                        className="text-primary hover:underline ml-1"
                                    >
                                        www.cnil.fr
                                    </a>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
