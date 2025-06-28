'use client';

import { formatDate } from '@/lib/blog-utils';
import {
    ARTICLE_CATEGORIES,
    type ArticleCategory,
    type ArticleSummary,
} from '@/types/blog';
import { motion } from 'framer-motion';
import { ArrowRight, Clock, Eye, Sparkles } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

type RelatedArticlesProps = {
    currentArticle: ArticleSummary;
    allArticles: ArticleSummary[];
};

function getRelatedArticles(
    currentArticle: ArticleSummary,
    allArticles: ArticleSummary[],
    limit: number = 3
) {
    // Exclure l'article actuel
    const otherArticles = allArticles.filter(
        (article) => article._id !== currentArticle._id
    );

    // Articles de la même catégorie en priorité
    const sameCategory = otherArticles.filter((article) =>
        article.categories.some((cat) =>
            currentArticle.categories.includes(cat)
        )
    );

    // Articles récents si pas assez d'articles de même catégorie
    const recentArticles = otherArticles.sort(
        (a, b) =>
            new Date(b.publishedAt).getTime() -
            new Date(a.publishedAt).getTime()
    );

    // Combiner et prendre les premiers articles uniques
    const relatedArticles = [...sameCategory];
    for (const article of recentArticles) {
        if (relatedArticles.length >= limit) break;
        if (!relatedArticles.find((related) => related._id === article._id)) {
            relatedArticles.push(article);
        }
    }

    return relatedArticles.slice(0, limit);
}

export function RelatedArticles({
    currentArticle,
    allArticles,
}: RelatedArticlesProps) {
    const relatedArticles = getRelatedArticles(currentArticle, allArticles, 3);

    if (relatedArticles.length === 0) {
        return null;
    }

    return (
        <section className="py-16 md:py-24 bg-gradient-to-br from-muted/20 via-background to-primary/5">
            <div className="container mx-auto px-4">
                <div className="max-w-6xl mx-auto">
                    {/* Header avec animation */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-12"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm mb-6">
                            <Sparkles className="w-4 h-4 text-primary" />
                            <span className="text-sm font-medium text-primary">
                                Continuez votre lecture
                            </span>
                        </div>

                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            Articles{' '}
                            <span className="bg-gradient-to-r from-primary to-hexo-blue-light bg-clip-text text-transparent">
                                recommandés
                            </span>
                        </h2>

                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            Découvrez d&apos;autres articles qui pourraient vous
                            intéresser
                        </p>
                    </motion.div>

                    {/* Grid d'articles avec design unique */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                        {relatedArticles.map((article, index) => (
                            <motion.div
                                key={article._id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{
                                    duration: 0.6,
                                    delay: index * 0.1,
                                }}
                                className="group"
                            >
                                <Link
                                    href={`/blog/${article.slug.current}`}
                                    className="block h-full"
                                >
                                    {/* Carte avec effet glass morphism */}
                                    <div className="relative h-full bg-gradient-to-br from-card/50 via-card/30 to-card/50 backdrop-blur-xl border border-border rounded-2xl overflow-hidden group-hover:from-card/70 group-hover:via-card/50 group-hover:to-card/70 transition-all duration-500 group-hover:scale-105 group-hover:shadow-xl">
                                        {/* Image avec overlay gradient */}
                                        <div className="relative aspect-video overflow-hidden">
                                            <Image
                                                src={
                                                    article.mainImage.asset.url
                                                }
                                                alt={article.mainImage.alt}
                                                fill
                                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                                                sizes="(max-width: 768px) 100vw, 33vw"
                                            />

                                            {/* Gradient overlay animé */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />

                                            {/* Badge catégorie flottant */}
                                            <div className="absolute top-4 left-4">
                                                {article.categories
                                                    .slice(0, 1)
                                                    .map((category) => (
                                                        <span
                                                            key={category}
                                                            className="inline-block px-3 py-1 text-xs font-medium bg-primary/90 text-primary-foreground rounded-full backdrop-blur-sm"
                                                        >
                                                            {
                                                                ARTICLE_CATEGORIES[
                                                                    category as ArticleCategory
                                                                ]
                                                            }
                                                        </span>
                                                    ))}
                                            </div>

                                            {/* Icône de lecture flottante */}
                                            <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-110">
                                                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-lg">
                                                    <ArrowRight className="w-4 h-4 text-primary-foreground" />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Contenu avec design moderne */}
                                        <div className="p-6">
                                            {/* Métadonnées */}
                                            <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                                                <div className="flex items-center gap-1">
                                                    <Clock className="w-3 h-3" />
                                                    <span>
                                                        {formatDate(
                                                            article.publishedAt
                                                        )}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Eye className="w-3 h-3" />
                                                    <span>2 min</span>
                                                </div>
                                            </div>

                                            {/* Titre avec effet hover */}
                                            <h3 className="text-lg font-bold mb-3 line-clamp-2 group-hover:text-primary transition-colors duration-200">
                                                {article.title}
                                            </h3>

                                            {/* Description courte */}
                                            {article.seo?.metaDescription && (
                                                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                                                    {
                                                        article.seo
                                                            .metaDescription
                                                    }
                                                </p>
                                            )}

                                            {/* Call to action avec animation */}
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm font-medium text-primary group-hover:underline">
                                                    Lire l&apos;article
                                                </span>
                                                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center transition-all duration-200 group-hover:bg-primary/20 group-hover:scale-110">
                                                    <ArrowRight className="w-3 h-3 text-primary transition-transform duration-200 group-hover:translate-x-0.5" />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Subtle glow effect */}
                                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-hexo-blue-light/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>

                    {/* Call to action vers le blog */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="text-center mt-12"
                    >
                        <Link
                            href="/blog"
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-medium transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-primary/20"
                        >
                            <Eye className="w-4 h-4" />
                            Voir tous les articles
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
