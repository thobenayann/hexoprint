'use client';

import { useBlogFilters, useBlogStickyFilters } from '@/hooks/use-blog-filters';
import {
    ARTICLE_CATEGORIES,
    FILTER_COLORS,
    type ArticleCategory,
} from '@/types/blog';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, Filter, Settings, X } from 'lucide-react';
import { useState } from 'react';

const containerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.4,
            staggerChildren: 0.05,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: {
            duration: 0.3,
            ease: 'easeOut',
        },
    },
};

const mobileFilterVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.9 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            duration: 0.3,
            ease: 'easeOut',
        },
    },
    exit: {
        opacity: 0,
        y: 20,
        scale: 0.9,
        transition: {
            duration: 0.2,
        },
    },
};

export function BlogFilters() {
    const { category, setFilter, clearFilters } = useBlogFilters();
    const [showMobileFilters, setShowMobileFilters] = useState(false);
    const isSticky = useBlogStickyFilters();

    const categoryOptions = Object.entries(ARTICLE_CATEGORIES).map(
        ([value, label]) => ({
            value: value as ArticleCategory,
            label,
        })
    );

    const hasActiveFilter = category !== 'all';

    // Obtenir le label du filtre actif pour l'affichage mobile
    const getActiveFilterLabel = () => {
        if (category !== 'all') {
            return ARTICLE_CATEGORIES[category];
        }
        return 'Toutes les catégories';
    };

    return (
        <div data-blog-filters-section>
            {/* Version Desktop - Section normale */}
            <section
                data-blog-filters-desktop
                className="hidden md:block py-4 md:py-6 bg-gradient-to-br from-muted/5 via-background to-muted/10"
            >
                <div className="container mx-auto px-4">
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: '-30px' }}
                        className="max-w-6xl mx-auto"
                    >
                        {/* Header compact */}
                        <motion.div
                            variants={itemVariants}
                            className="text-center mb-4"
                        >
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm mb-2">
                                <Filter className="w-3 h-3 text-primary" />
                                <span className="text-xs font-medium text-primary">
                                    Filtres
                                </span>
                            </div>
                            <div className="flex items-center justify-center gap-4">
                                <h2 className="text-xl md:text-2xl font-bold text-foreground">
                                    Explorez nos{' '}
                                    <span className="text-primary">
                                        articles
                                    </span>
                                </h2>
                                {hasActiveFilter && (
                                    <button
                                        onClick={clearFilters}
                                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground transition-all duration-200 cursor-pointer"
                                    >
                                        <X className="w-3 h-3" />
                                        <span className="text-xs">Effacer</span>
                                    </button>
                                )}
                            </div>
                        </motion.div>

                        {/* Container principal compact */}
                        <motion.div
                            variants={itemVariants}
                            className="relative"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-card/40 via-card/20 to-card/40 backdrop-blur-xl border border-border rounded-2xl"></div>

                            <div className="relative z-10 p-4">
                                <div className="flex flex-wrap gap-1.5 justify-center">
                                    {/* Filtre "Toutes" */}
                                    <button
                                        onClick={() => setFilter('all', 'all')}
                                        className={`px-3 py-1.5 rounded-full text-sm font-medium ${FILTER_COLORS.hover} ${
                                            !hasActiveFilter
                                                ? FILTER_COLORS.active
                                                : FILTER_COLORS.inactive
                                        }`}
                                    >
                                        Toutes les catégories
                                    </button>

                                    {/* Filtres par catégorie */}
                                    {categoryOptions.map((categoryOption) => (
                                        <button
                                            key={categoryOption.value}
                                            onClick={() =>
                                                setFilter(
                                                    'category',
                                                    categoryOption.value
                                                )
                                            }
                                            className={`px-3 py-1.5 rounded-full text-sm font-medium ${FILTER_COLORS.hover} ${
                                                category ===
                                                categoryOption.value
                                                    ? FILTER_COLORS.active
                                                    : FILTER_COLORS.inactive
                                            }`}
                                        >
                                            {categoryOption.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Subtle background glow */}
                            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/3 to-hexo-blue-light/3 blur-xl opacity-50"></div>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Version Mobile */}
            <div className="md:hidden">
                {/* Header mobile simple - section normale */}
                <section
                    data-blog-filters-mobile
                    className="py-4 bg-gradient-to-br from-muted/5 via-background to-muted/10"
                >
                    <div className="container mx-auto px-4">
                        <div className="text-center">
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm mb-2">
                                <Filter className="w-3 h-3 text-primary" />
                                <span className="text-xs font-medium text-primary">
                                    Filtres
                                </span>
                            </div>
                            <h2 className="text-xl font-bold text-foreground">
                                Explorez nos{' '}
                                <span className="text-primary">articles</span>
                            </h2>
                        </div>
                    </div>
                </section>

                {/* Panneau de filtres - sticky intelligent */}
                <div className="fixed top-12 left-4 right-4 z-50 transition-all duration-300">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{
                            opacity: isSticky ? 1 : 0,
                            y: isSticky ? 0 : -20,
                            scale: isSticky ? 1 : 0.95,
                        }}
                        transition={{
                            duration: 0.3,
                            ease: 'easeOut',
                        }}
                        className="relative"
                        style={{
                            pointerEvents: isSticky ? 'auto' : 'none',
                        }}
                    >
                        {/* Panneau principal compact */}
                        <div
                            className={`${
                                isSticky
                                    ? 'bg-card/95 backdrop-blur-xl border border-border shadow-lg shadow-black/20'
                                    : 'bg-card/80 backdrop-blur-md border border-border/50 shadow-md'
                            } rounded-2xl transition-all duration-300`}
                        >
                            <div className="p-3">
                                <div className="flex items-center justify-between gap-3">
                                    {/* Filtre actuel */}
                                    <button
                                        onClick={() =>
                                            setShowMobileFilters(
                                                !showMobileFilters
                                            )
                                        }
                                        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-primary/10 border border-primary/20 flex-1 cursor-pointer"
                                    >
                                        <Settings className="w-4 h-4 text-primary" />
                                        <span className="text-sm font-medium text-primary truncate">
                                            {getActiveFilterLabel()}
                                        </span>
                                        <ChevronDown
                                            className={`w-4 h-4 text-primary transition-transform duration-200 ${
                                                showMobileFilters
                                                    ? 'rotate-180'
                                                    : ''
                                            }`}
                                        />
                                    </button>

                                    {/* Bouton reset si filtres actifs */}
                                    {hasActiveFilter && (
                                        <button
                                            onClick={clearFilters}
                                            className="p-2 rounded-xl bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground transition-all duration-200 cursor-pointer"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Panneau de filtres étendu */}
                        <AnimatePresence>
                            {showMobileFilters && (
                                <motion.div
                                    variants={mobileFilterVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit="exit"
                                    className="absolute top-full left-0 right-0 mt-2"
                                >
                                    <div className="bg-card/95 backdrop-blur-xl border border-border rounded-2xl shadow-lg shadow-black/10 p-4">
                                        <div className="mb-4">
                                            <h3 className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">
                                                Catégories
                                            </h3>
                                            <div className="flex flex-wrap gap-2">
                                                <button
                                                    onClick={() => {
                                                        setFilter('all', 'all');
                                                        setShowMobileFilters(
                                                            false
                                                        );
                                                    }}
                                                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${
                                                        !hasActiveFilter
                                                            ? 'bg-primary text-primary-foreground'
                                                            : 'bg-muted/50 text-muted-foreground hover:bg-muted'
                                                    }`}
                                                >
                                                    Toutes
                                                </button>
                                                {categoryOptions.map(
                                                    (categoryOption) => (
                                                        <button
                                                            key={
                                                                categoryOption.value
                                                            }
                                                            onClick={() => {
                                                                setFilter(
                                                                    'category',
                                                                    categoryOption.value
                                                                );
                                                                setShowMobileFilters(
                                                                    false
                                                                );
                                                            }}
                                                            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${
                                                                category ===
                                                                categoryOption.value
                                                                    ? 'bg-primary text-primary-foreground'
                                                                    : 'bg-muted/50 text-muted-foreground hover:bg-muted'
                                                            }`}
                                                        >
                                                            {
                                                                categoryOption.label
                                                            }
                                                        </button>
                                                    )
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
