'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { PrimaryButton } from '@/components/ui/primary-button';
import { CheckCircle, Clock, FileText, Star } from 'lucide-react';
import Link from 'next/link';

const features = [
    {
        icon: FileText,
        title: 'Devis détaillé',
        description:
            'Analyse précise de votre projet avec conseils techniques personnalisés',
    },
    {
        icon: Clock,
        title: 'Réponse rapide',
        description:
            "Retour sous 24h maximum pour tous vos projets d'impression 3D",
    },
    {
        icon: CheckCircle,
        title: 'Sans engagement',
        description:
            'Devis gratuit et sans obligation, pour explorer toutes les possibilités',
    },
];

const trustElements = [
    'Expertise technique garantie',
    'Livraison dans toute la France',
    'Accompagnement personnalisé',
];

export function CallToAction() {
    return (
        <section
            data-cta-section
            className="relative py-24 overflow-hidden bg-gradient-to-br from-primary/10 via-background to-hexo-blue-light/10"
        >
            {/* Animated background pattern */}
            <div className='absolute inset-0 bg-[url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZGVmcz4KICAgIDxwYXR0ZXJuIGlkPSJjdWJlcyIgd2lkdGg9IjYwIiBoZWlnaHQ9IjYwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KICAgICAgPHBhdGggZD0ibTAgMzBsMzAtMzAgMzAgMzB2MzBsLTMwIDMwLTMwLTMweiIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMjQ1NTZBIiBzdHJva2Utd2lkdGg9IjAuNSIgc3Ryb2tlLW9wYWNpdHk9IjAuMSIvPgogICAgPC9wYXR0ZXJuPgogIDwvZGVmcz4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2N1YmVzKSIvPgo8L3N2Zz4K")] opacity-30'></div>

            {/* Floating accent elements */}
            <div className="absolute top-10 left-4 md:top-20 md:left-20 w-32 h-32 md:w-40 md:h-40 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-3xl opacity-60"></div>
            <div className="absolute bottom-10 right-4 md:bottom-20 md:right-20 w-40 h-40 md:w-60 md:h-60 bg-gradient-to-br from-hexo-blue-light/20 to-transparent rounded-full blur-3xl opacity-40"></div>

            <div className="container mx-auto px-4 relative z-10">
                {/* Main CTA Card */}
                <div className="relative max-w-5xl mx-auto">
                    {/* Glass morphism background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-card/80 via-primary/5 to-card/80 backdrop-blur-xl border border-border rounded-3xl shadow-2xl"></div>

                    {/* Content */}
                    <div className="relative z-10 p-8 md:p-16 text-center">
                        {/* Header */}
                        <div className="mb-12">
                            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-6 md:mb-8 text-foreground">
                                Prêt à concrétiser votre{' '}
                                <span className="text-primary">projet</span> ?
                            </h2>
                            <p className="text-base md:text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                                Obtenez un devis personnalisé, rapide et sans
                                engagement. Notre expertise technique transforme
                                vos idées en réalité.
                            </p>
                        </div>

                        {/* Features Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                            {features.map((feature, index) => {
                                const IconComponent = feature.icon;

                                return (
                                    <Card
                                        key={index}
                                        className="border-0 bg-background/50 backdrop-blur-sm hover:bg-background/70 transition-all duration-300 group cursor-pointer"
                                    >
                                        <CardContent className="p-6 text-center">
                                            {/* Icon */}
                                            <div className="mb-4 mx-auto">
                                                <div className="relative inline-block">
                                                    <div className="p-3 bg-gradient-to-br from-primary/20 to-primary/30 rounded-xl backdrop-blur-sm border border-border group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                                                        <div className="p-2 bg-primary rounded-lg shadow-lg shadow-primary/30">
                                                            <IconComponent className="w-5 h-5 text-primary-foreground" />
                                                        </div>
                                                    </div>
                                                    {/* Floating glow */}
                                                    <div className="absolute inset-0 bg-primary/20 rounded-xl blur-lg scale-150 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                                </div>
                                            </div>

                                            {/* Content */}
                                            <h3 className="text-base md:text-lg font-semibold text-foreground mb-3 group-hover:text-primary transition-colors duration-300">
                                                {feature.title}
                                            </h3>
                                            <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                                                {feature.description}
                                            </p>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>

                        {/* Main CTA Button */}
                        <div className="mb-8">
                            <PrimaryButton href="/devis" icon={Star}>
                                Demander mon devis gratuit
                            </PrimaryButton>
                        </div>

                        {/* Secondary Actions */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
                            <Link href="/contact" className="w-full sm:w-auto">
                                <Button
                                    variant="outline"
                                    size="lg"
                                    className="border-border text-foreground hover:bg-primary/10 hover:border-primary/50 hover:text-primary font-medium px-6 py-3 md:px-8 transition-all duration-300 w-full sm:w-auto"
                                >
                                    Nous contacter
                                </Button>
                            </Link>

                            <Link href="/galerie" className="w-full sm:w-auto">
                                <Button
                                    variant="ghost"
                                    size="lg"
                                    className="text-muted-foreground hover:text-primary hover:bg-primary/5 font-medium px-6 py-3 md:px-8 transition-all duration-300 w-full sm:w-auto"
                                >
                                    Voir nos réalisations
                                </Button>
                            </Link>
                        </div>

                        {/* Trust Elements */}
                        <div className="pt-8 border-t border-border">
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm">
                                {trustElements.map((element, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center group"
                                    >
                                        <div className="p-1 bg-primary/20 rounded-full mr-3 group-hover:bg-primary/30 transition-colors duration-300">
                                            <CheckCircle className="w-4 h-4 text-primary" />
                                        </div>
                                        <span className="text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                                            {element}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Subtle background glow */}
                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/5 to-hexo-blue-light/5 blur-2xl"></div>
                </div>

                {/* Bottom decorative section */}
                <div className="mt-16 text-center">
                    <p className="text-sm md:text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                        Rejoignez nos{' '}
                        <span className="text-primary font-semibold">
                            500+ clients satisfaits
                        </span>{' '}
                        qui nous font confiance pour leurs projets
                        d&apos;impression 3D.
                    </p>
                </div>
            </div>
        </section>
    );
}
