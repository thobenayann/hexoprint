import { Button } from '@/components/ui/button';
import { COMPANY_INFO } from '@/lib/company-info';
import { AlertTriangle, Home, Search } from 'lucide-react';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'Page non trouvée - Hexoprint | Erreur 404',
    description:
        "La page que vous recherchez n'existe pas. Regrnez à l'accueil d'Hexoprint pour découvrir nos services d'impression 3D à Seysses.",
    robots: 'noindex, nofollow',
};

export default function NotFound() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 flex items-center justify-center px-4">
            {/* Background Pattern */}
            <div className='absolute inset-0 bg-[url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZGVmcz4KICAgIDxwYXR0ZXJuIGlkPSJkb3RzIiB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPgogICAgICA8Y2lyY2xlIGN4PSIxMCIgY3k9IjEwIiByPSIxIiBmaWxsPSIjMjQ1NTZhIiBmaWxsLW9wYWNpdHk9IjAuMDUiLz4KICAgIDwvcGF0dGVybj4KICA8L2RlZnM+CiAgPHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNkb3RzKSIvPgo8L3N2Zz4K")] opacity-50'></div>

            <div className="relative z-10 text-center max-w-2xl mx-auto">
                {/* 404 Number with Hexoprint styling */}
                <div className="mb-8 max-sm:pt-16">
                    <div className="relative inline-block">
                        <h1 className="text-8xl md:text-9xl font-bold bg-clip-text text-hexo-blue-light leading-none">
                            404
                        </h1>
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-hexo-blue-light to-hexo-blue-dark rounded-full animate-pulse"></div>
                    </div>
                </div>

                {/* Error Icon */}
                <div className="mb-6 flex justify-center">
                    <div className="p-4 bg-hexo-blue-dark/50 rounded-full border border-border/50">
                        <AlertTriangle className="w-8 h-8 text-hexo-blue-light" />
                    </div>
                </div>

                {/* Main Content */}
                <div className="space-y-6 mb-8">
                    <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                        Cette page n&apos;existe pas
                    </h2>

                    <p className="text-lg text-muted-foreground leading-relaxed max-w-lg mx-auto">
                        Oups ! Il semblerait que cette page soit aussi
                        introuvable qu&apos;une pièce sans fichier STL. Mais pas
                        de panique, nous avons d&apos;autres créations à vous
                        montrer !
                    </p>

                    <div className="bg-muted/30 p-4 rounded-lg border border-border/50 max-w-md mx-auto">
                        <p className="text-sm text-muted-foreground">
                            <strong className="text-hexo-blue-light">
                                Astuce :
                            </strong>{' '}
                            Vérifiez l&apos;URL ou utilisez notre menu de
                            navigation pour trouver ce que vous cherchez.
                        </p>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <Button
                        asChild
                        size="lg"
                        className="bg-gradient-to-r from-hexo-blue-dark to-hexo-blue-light hover:from-hexo-blue-dark/90 hover:to-hexo-blue-light/90 text-white shadow-lg"
                    >
                        <Link href="/" className="flex items-center gap-2">
                            <Home className="w-5 h-5" />
                            Retour à l&apos;accueil
                        </Link>
                    </Button>

                    <Button
                        asChild
                        variant="outline"
                        size="lg"
                        className="border-hexo-blue-dark/20 hover:border-hexo-blue-dark/40 hover:bg-hexo-blue-dark/5"
                    >
                        <Link
                            href="/prestations"
                            className="flex items-center gap-2"
                        >
                            <Search className="w-5 h-5" />
                            Découvrir nos services
                        </Link>
                    </Button>
                </div>

                {/* Contact Info */}
                <div className="mt-12 pt-8 border-t border-border/50">
                    <p className="text-sm text-muted-foreground">
                        Besoin d&apos;aide ? Contactez {COMPANY_INFO.name} au{' '}
                        <a
                            href={`tel:${COMPANY_INFO.contact.phone.replace(
                                /\s/g,
                                ''
                            )}`}
                            className="text-hexo-blue-light hover:underline font-medium"
                        >
                            {COMPANY_INFO.contact.phone}
                        </a>{' '}
                        ou par email à{' '}
                        <a
                            href={`mailto:${COMPANY_INFO.contact.email}`}
                            className="text-hexo-blue-light hover:underline font-medium"
                        >
                            {COMPANY_INFO.contact.email}
                        </a>
                    </p>
                </div>

                {/* Decorative Elements */}
                <div className="absolute -top-10 -left-10 w-20 h-20 bg-gradient-to-r from-hexo-blue-light/20 to-transparent rounded-full blur-xl"></div>
                <div className="hidden md:block absolute -bottom-10 -right-10 w-32 h-32 bg-gradient-to-r from-hexo-blue-dark/10 to-transparent rounded-full blur-2xl"></div>
            </div>
        </div>
    );
}
