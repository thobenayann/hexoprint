'use client';

import { useBlogFilters } from '@/hooks/use-blog-filters';
import { filterArticlesByCategory } from '@/lib/blog-client-utils';
import type { ArticleSummary } from '@/types/blog';
import {
    ARTICLE_CATEGORIES,
    getArticleCategoryLabel,
    type ArticleCategory,
} from '@/types/blog';
import { AnimatePresence, motion } from 'framer-motion';
import { Filter } from 'lucide-react';
import { useMemo } from 'react';
import { BlogCard } from './BlogCard';

// Types pour les props
type BlogGridProps = {
    articles: ArticleSummary[];
};

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
                <p className="text-muted-foreground mb-6">
                    Aucun article ne correspond à votre sélection. Essayez de
                    changer de catégorie ou revenez plus tard pour découvrir de
                    nouveaux contenus.
                </p>
            </div>
        </motion.div>
    );
}

export function BlogGrid({ articles }: BlogGridProps) {
    const { category } = useBlogFilters();

    // Filtrer les articles selon la catégorie sélectionnée (côté client)
    const filteredArticles = useMemo(() => {
        return filterArticlesByCategory(articles, category);
    }, [articles, category]);

    // Aucun article trouvé après filtrage
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
                                            {getArticleCategoryLabel(category)}
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

                    {/* Message informatif si pas d'articles en base */}
                    {articles.length === 0 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center mt-12 p-6 bg-muted/30 rounded-lg"
                        >
                            <p className="text-muted-foreground">
                                💡 <strong>Astuce :</strong> Pour voir des
                                articles, ajoutez-en dans le{' '}
                                <a
                                    href="/studio"
                                    className="text-primary hover:underline"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Sanity Studio
                                </a>
                            </p>
                        </motion.div>
                    )}
                </div>
            </div>
        </section>
    );
}
