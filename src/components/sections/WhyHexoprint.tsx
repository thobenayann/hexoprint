'use client';

import { GlareCard } from '@/components/ui/glare-card';
import { motion } from 'framer-motion';
import { Clock, Target, Truck, Users } from 'lucide-react';

const values = [
    {
        icon: Users,
        title: 'Accompagnement personnalisé',
        description:
            "Nous prenons le temps de comprendre vos besoins et vous accompagnons de A à Z dans vos projets d'impression 3D.",
    },
    {
        icon: Target,
        title: 'Impressions de précision',
        description:
            'Maîtrise technique avancée pour des pièces parfaitement ajustées, quelle que soit la complexité de votre projet.',
    },
    {
        icon: Clock,
        title: 'Rapidité et disponibilité',
        description:
            'Devis rapide, production efficace et écoute permanente pour répondre à vos urgences et demandes spécifiques.',
    },
    {
        icon: Truck,
        title: 'Livraison dans toute la France',
        description:
            'Service de livraison sécurisé pour recevoir vos pièces imprimées où que vous soyez en France métropolitaine.',
    },
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
        },
    },
};

const cardVariants = {
    hidden: { opacity: 0, y: 60, scale: 0.8 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            duration: 0.7,
            ease: [0.25, 0.46, 0.45, 0.94],
        },
    },
};

export function WhyHexoprint() {
    return (
        <section className="relative py-24 overflow-hidden bg-gradient-to-br from-background via-primary/20 to-background">
            {/* Pattern overlay */}
            <div className='absolute inset-0 bg-[url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZGVmcz4KICAgIDxwYXR0ZXJuIGlkPSJkb3RzIiB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPgogICAgICA8Y2lyY2xlIGN4PSIxMCIgY3k9IjEwIiByPSIxLjUiIGZpbGw9InJnYmEoMjUwLDI1MCwyNTAsMC4xKSIvPgogICAgPC9wYXR0ZXJuPgogIDwvZGVmcz4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2RvdHMpIi8+Cjwvc3ZnPg==")] opacity-30'></div>

            <div className="container mx-auto px-4 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    viewport={{ once: true, margin: '-100px' }}
                    className="text-center mb-20"
                >
                    <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-6 md:mb-8 text-foreground">
                        Pourquoi choisir{' '}
                        <span className="text-primary">Hexoprint</span>?
                    </h2>
                    <p className="text-base md:text-lg lg:text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
                        Notre promesse : un résultat qui répond précisément à
                        vos attentes, quelle que soit la complexité de votre
                        projet.
                    </p>
                </motion.div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-100px' }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6 justify-items-center"
                >
                    {values.map((value, index) => {
                        const IconComponent = value.icon;
                        return (
                            <motion.div
                                key={index}
                                variants={cardVariants}
                                className="w-full max-w-sm md:max-w-none"
                            >
                                <GlareCard className="h-full min-h-[320px] md:p-8 flex flex-col items-center justify-center text-center group cursor-pointer">
                                    {/* Glass morphism background */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-card/50 via-card/30 to-card/50 backdrop-blur-xl border border-border rounded-[var(--radius)] group-hover:from-card/70 group-hover:via-card/50 group-hover:to-card/70 transition-all duration-500"></div>

                                    {/* Content */}
                                    <div className="relative z-10 flex flex-col items-center justify-center h-full">
                                        {/* Icon with colorful gradient background */}
                                        <div className="mb-6 p-4 bg-gradient-to-br from-primary/20 to-primary/30 rounded-2xl backdrop-blur-sm border border-border group-hover:scale-110 group-hover:from-primary/30 group-hover:to-primary/40 transition-all duration-300">
                                            <div className="p-3 bg-primary rounded-xl shadow-lg shadow-primary/30">
                                                <IconComponent
                                                    className="w-8 h-8 text-primary-foreground"
                                                    aria-hidden="true"
                                                />
                                            </div>
                                        </div>

                                        {/* Title */}
                                        <h3 className="text-lg md:text-xl font-bold text-foreground mb-3 md:mb-4 leading-tight group-hover:text-primary transition-colors duration-300">
                                            {value.title}
                                        </h3>

                                        {/* Description */}
                                        <p className="text-sm md:text-base text-muted-foreground leading-relaxed group-hover:text-foreground transition-colors duration-300">
                                            {value.description}
                                        </p>
                                    </div>

                                    {/* Subtle glow effect */}
                                    <div className="absolute inset-0 rounded-[var(--radius)] bg-gradient-to-br from-primary/5 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                </GlareCard>
                            </motion.div>
                        );
                    })}
                </motion.div>

                {/* Additional Content Section with colorful glassmorphism */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    viewport={{ once: true, margin: '-100px' }}
                    className="mt-20"
                >
                    <div className="relative">
                        {/* Glass morphism background with subtle colors */}
                        <div className="absolute inset-0 bg-gradient-to-br from-card/50 via-primary/10 to-card/50 backdrop-blur-xl border border-border rounded-3xl"></div>

                        {/* Content */}
                        <div className="relative z-10 p-8 md:p-12 text-center">
                            <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-foreground mb-4 md:mb-6">
                                Une expertise technique au service de vos{' '}
                                <span className="text-primary">idées</span>
                            </h3>
                            <p className="text-sm md:text-base lg:text-lg text-muted-foreground max-w-4xl mx-auto leading-relaxed">
                                Fondée par Yann, un technicien passionné par
                                l&apos;impression 3D, Hexoprint mêle
                                savoir-faire artisanal et rigueur technique. De
                                la création des plans jusqu&apos;au produit
                                final, chaque étape est maîtrisée avec minutie.
                            </p>

                            {/* Decorative elements with brand colors */}
                            <div
                                className="mt-8 flex justify-center space-x-2"
                                role="img"
                                aria-label="Indicateurs de chargement décoratifs"
                            >
                                <div className="w-2 h-2 bg-primary rounded-full animate-pulse motion-reduce:animate-none"></div>
                                <div className="w-2 h-2 bg-primary/70 rounded-full animate-pulse delay-75 motion-reduce:animate-none"></div>
                                <div className="w-2 h-2 bg-primary rounded-full animate-pulse delay-150 motion-reduce:animate-none"></div>
                            </div>
                        </div>

                        {/* Subtle colorful glow for the box */}
                        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/5 to-primary/10 blur-xl"></div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
