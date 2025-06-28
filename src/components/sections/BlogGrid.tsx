'use client';

import { useBlogFilters } from '@/hooks/use-blog-filters';
import { getArticleSummaries } from '@/lib/blog-utils';
import type { ArticleSummary } from '@/types/blog';
import { ARTICLE_CATEGORIES, type ArticleCategory } from '@/types/blog';
import { AnimatePresence, motion } from 'framer-motion';
import { Filter } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { BlogCard } from './BlogCard';

// Animation variants
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
            ease: 'easeOut',
        },
    },
};

// Skeleton de chargement
function BlogSkeleton() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {[...Array(6)].map((_, i) => (
                <div
                    key={i}
                    className="bg-card rounded-2xl border border-border animate-pulse overflow-hidden"
                >
                    <div className="aspect-video bg-muted"></div>
                    <div className="p-6 space-y-4">
                        <div className="flex gap-2">
                            <div className="h-6 bg-muted rounded-full w-20"></div>
                            <div className="h-6 bg-muted rounded-full w-16"></div>
                        </div>
                        <div className="space-y-2">
                            <div className="h-6 bg-muted rounded w-3/4"></div>
                            <div className="h-4 bg-muted rounded"></div>
                            <div className="h-4 bg-muted rounded w-5/6"></div>
                        </div>
                        <div className="flex justify-between items-center">
                            <div className="h-4 bg-muted rounded w-24"></div>
                            <div className="h-4 bg-muted rounded w-16"></div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

// État vide
function EmptyState() {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16 md:py-24"
        >
            <div className="max-w-md mx-auto">
                <div className="mb-6">
                    <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center">
                        <Filter className="w-8 h-8 text-muted-foreground" />
                    </div>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-foreground">
                    Aucun article trouvé
                </h3>
                <p className="text-muted-foreground">
                    Aucun article ne correspond à votre sélection. Essayez de
                    changer de catégorie ou revenez plus tard pour découvrir de
                    nouveaux contenus.
                </p>
            </div>
        </motion.div>
    );
}

export function BlogGrid() {
    const { category } = useBlogFilters();
    const [articles, setArticles] = useState<ArticleSummary[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Charger les articles
    useEffect(() => {
        async function loadArticles() {
            try {
                setIsLoading(true);
                const allArticles = await getArticleSummaries();
                setArticles(allArticles);
            } catch (error) {
                console.error('Erreur lors du chargement des articles:', error);
                setArticles([]);
            } finally {
                setIsLoading(false);
            }
        }

        loadArticles();
    }, []);

    // Filtrer les articles selon la catégorie sélectionnée
    const filteredArticles = useMemo(() => {
        if (category === 'all') {
            return articles;
        }
        return articles.filter((article) =>
            article.categories.includes(category)
        );
    }, [articles, category]);

    if (isLoading) {
        return (
            <section className="py-16 md:py-24">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        <BlogSkeleton />
                    </div>
                </div>
            </section>
        );
    }

    if (filteredArticles.length === 0) {
        return (
            <section className="py-16 md:py-24">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        <EmptyState />
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="py-16 md:py-24">
            <div className="container mx-auto px-4">
                <div className="max-w-6xl mx-auto">
                    {/* Résumé du filtrage */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={category}
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="mb-8"
                        >
                            <p className="text-sm text-muted-foreground">
                                {filteredArticles.length} article
                                {filteredArticles.length > 1 ? 's' : ''} trouvé
                                {filteredArticles.length > 1 ? 's' : ''}
                                {category !== 'all' && (
                                    <>
                                        {' '}
                                        dans la catégorie{' '}
                                        <span className="font-medium text-foreground">
                                            {
                                                ARTICLE_CATEGORIES[
                                                    category as ArticleCategory
                                                ]
                                            }
                                        </span>
                                    </>
                                )}
                            </p>
                        </motion.div>
                    </AnimatePresence>

                    {/* Grille d'articles */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={`${category}-${filteredArticles.length}`}
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            exit="hidden"
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
                        >
                            {filteredArticles.map((article, index) => (
                                <motion.div
                                    key={article._id}
                                    variants={itemVariants}
                                >
                                    <BlogCard
                                        article={article}
                                        priority={index < 3}
                                    />
                                </motion.div>
                            ))}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </section>
    );
}
