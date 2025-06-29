'use client';

import { ScrollIndicator } from '@/components/ui/scroll-indicator';
import { motion } from 'framer-motion';
import { BookOpen, FileText, Grid3X3, Lightbulb, Sparkles } from 'lucide-react';

const heroStats = [
    {
        icon: FileText,
        value: '6',
        label: 'Articles',
        description: "Guides d'expertise",
    },
    {
        icon: Grid3X3,
        value: '6',
        label: 'Catégories',
        description: 'Domaines couverts',
    },
    {
        icon: Lightbulb,
        value: '100%',
        label: 'Expertise',
        description: 'Savoir-faire',
    },
    {
        icon: BookOpen,
        value: '∞',
        label: 'Inspiration',
        description: 'Idées créatives',
    },
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2,
            delayChildren: 0.3,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
            ease: [0.25, 0.46, 0.45, 0.94],
        },
    },
};

const statsVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: {
            duration: 0.5,
            ease: 'easeOut',
        },
    },
};

export function BlogHero() {
    // Fonction pour scroller vers les filtres de blog
    const scrollToFilters = () => {
        const filtersSection = document.querySelector(
            '[data-blog-filters-section]'
        );
        if (filtersSection) {
            filtersSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
            });
        } else {
            // Fallback : scroll vers la section suivante
            const nextSection = document.querySelector(
                'main > section:nth-child(2)'
            );
            nextSection?.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
            });
        }
    };

    return (
        <section className="relative min-h-screen flex flex-col overflow-hidden bg-gradient-to-br from-background via-primary/5 to-hexo-blue-light/10 max-sm:mt-10">
            {/* Animated background pattern */}
            <div
                className="absolute inset-0 opacity-30"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3e%3cdefs%3e%3cpattern id='blog-grid' width='50' height='50' patternUnits='userSpaceOnUse'%3e%3crect width='50' height='50' fill='none' stroke='%2324556A' stroke-width='0.5' stroke-opacity='0.1'/%3e%3ccircle cx='25' cy='25' r='2' fill='%2396CFE7' fill-opacity='0.1'/%3e%3c/pattern%3e%3c/defs%3e%3crect width='100%25' height='100%25' fill='url(%23blog-grid)'/%3e%3c/svg%3e")`,
                }}
            ></div>

            {/* Floating accent elements */}
            <div className="absolute top-20 left-10 w-40 h-40 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-3xl opacity-60"></div>
            <div className="absolute bottom-20 right-10 w-60 h-60 bg-gradient-to-br from-hexo-blue-light/20 to-transparent rounded-full blur-3xl opacity-40"></div>

            {/* Contenu principal - prend l'espace disponible */}
            <div className="container mx-auto px-4 relative z-10 flex-1 flex items-center justify-center">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="text-center max-w-5xl mx-auto py-8 md:py-12"
                >
                    {/* Badge */}
                    <motion.div
                        variants={itemVariants}
                        className="mb-6 md:mb-8"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm">
                            <BookOpen className="w-4 h-4 text-primary" />
                            <span className="text-sm font-medium text-primary">
                                Blog d&apos;expertise
                            </span>
                        </div>
                    </motion.div>

                    {/* Titre principal */}
                    <motion.h1
                        variants={itemVariants}
                        className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 text-foreground"
                    >
                        Notre{' '}
                        <span className="bg-gradient-to-r from-primary to-hexo-blue-light bg-clip-text text-transparent">
                            Blog
                        </span>
                        <Sparkles className="inline-block ml-2 w-6 h-6 md:w-8 md:h-8 text-primary animate-pulse" />
                    </motion.h1>

                    {/* Sous-titre */}
                    <motion.p
                        variants={itemVariants}
                        className="text-lg md:text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-8 md:mb-12"
                    >
                        Conseils pratiques, inspiration et expertise pour vos
                        projets d&apos;impression 3D
                    </motion.p>

                    {/* Description */}
                    <motion.div
                        variants={itemVariants}
                        className="max-w-2xl mx-auto mb-12"
                    >
                        <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                            Découvrez nos articles dédiés à l&apos;impression 3D
                            : guides techniques, conseils de matériaux,
                            inspirations créatives et retours d&apos;expérience.
                            Que vous soyez débutant ou expert, notre blog vous
                            accompagne dans tous vos projets.
                        </p>
                    </motion.div>

                    {/* Stats Grid - inspiré de GalleryHero */}
                    <motion.div
                        variants={containerVariants}
                        className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 lg:gap-8 max-w-4xl mx-auto"
                    >
                        {heroStats.map((stat, index) => {
                            const IconComponent = stat.icon;

                            return (
                                <motion.div
                                    key={index}
                                    variants={statsVariants}
                                    className="group cursor-pointer"
                                >
                                    {/* Glass morphism card */}
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-gradient-to-br from-card/50 via-card/30 to-card/50 backdrop-blur-xl border border-border rounded-2xl group-hover:from-card/70 group-hover:via-card/50 group-hover:to-card/70 transition-all duration-500"></div>

                                        <div className="relative z-10 p-4 md:p-6 text-center">
                                            {/* Icon */}
                                            <div className="mb-3 md:mb-4 mx-auto">
                                                <div className="relative inline-block">
                                                    <div className="p-2 md:p-3 bg-gradient-to-br from-primary/20 to-primary/30 rounded-xl backdrop-blur-sm border border-border group-hover:scale-110 transition-transform duration-300">
                                                        <div className="p-1.5 md:p-2 bg-primary rounded-lg shadow-lg shadow-primary/30">
                                                            <IconComponent className="w-4 h-4 md:w-5 md:h-5 text-primary-foreground" />
                                                        </div>
                                                    </div>
                                                    {/* Floating glow */}
                                                    <div className="absolute inset-0 bg-primary/20 rounded-xl blur-xl scale-150 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                                </div>
                                            </div>

                                            {/* Value */}
                                            <div className="text-xl md:text-2xl lg:text-3xl font-bold text-primary mb-1 group-hover:scale-110 transition-transform duration-300">
                                                {stat.value}
                                            </div>

                                            {/* Label */}
                                            <div className="text-xs md:text-sm lg:text-base font-semibold text-foreground mb-1 group-hover:text-primary transition-colors duration-300">
                                                {stat.label}
                                            </div>

                                            {/* Description */}
                                            <div className="text-xs md:text-sm text-muted-foreground">
                                                {stat.description}
                                            </div>
                                        </div>

                                        {/* Subtle background glow */}
                                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-hexo-blue-light/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                </motion.div>
            </div>

            {/* Scroll indicator - responsive : block en mobile, absolute en desktop */}
            <ScrollIndicator
                text="Découvrir nos articles"
                onClick={scrollToFilters}
                mode="responsive"
            />
        </section>
    );
}
