import { sanityFetch } from '@/sanity/lib/live';
import type { Article, ArticleCategory, ArticleSummary } from '@/types/blog';
import { notFound } from 'next/navigation';
import { cache } from 'react';
import { articleBySlugQuery, articlesQuery } from './sanity-queries';

// ==========================================
// FONCTIONS AVEC CACHE ET OPTIMISATIONS (SERVER-SIDE)
// ==========================================

/**
 * Charge tous les articles depuis Sanity
 * Utilise React cache() pour éviter les requêtes dupliquées
 * @returns Promise avec la liste des articles
 */
export const getAllArticles = cache(async (): Promise<Article[]> => {
    try {
        const { data: articles } = await sanityFetch({
            query: articlesQuery,
        });

        if (!articles || !Array.isArray(articles)) {
            console.warn('[Blog] Aucun article trouvé dans Sanity');
            return [];
        }

        return articles;
    } catch (error) {
        console.error('[Blog] Erreur lors du chargement des articles:', error);
        // En cas d'erreur, retourner un tableau vide plutôt que de faire planter l'app
        return [];
    }
});

/**
 * Charge les articles résumés (sans body) pour la liste
 * Optimisé pour les performances avec cache React
 * @returns Promise avec la liste des résumés d'articles
 */
export const getArticleSummaries = cache(
    async (): Promise<ArticleSummary[]> => {
        try {
            const articles = await getAllArticles();

            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            return articles.map(({ body: _, ...article }) => article);
        } catch (error) {
            console.error(
                '[Blog] Erreur lors du chargement des résumés:',
                error
            );
            return [];
        }
    }
);

/**
 * Type pour les statistiques du blog
 */
export type BlogStats = {
    totalArticles: number;
    totalCategories: number;
    categories: ArticleCategory[];
};

/**
 * Récupère les statistiques du blog (nombre d'articles, catégories)
 * Utilise cache() pour optimiser les performances
 * @returns Promise avec les statistiques du blog
 */
export const getBlogStats = cache(async (): Promise<BlogStats> => {
    try {
        const articles = await getArticleSummaries();

        if (!articles || articles.length === 0) {
            return {
                totalArticles: 0,
                totalCategories: 0,
                categories: [],
            };
        }

        // Récupérer toutes les catégories uniques
        const uniqueCategories = new Set<ArticleCategory>();

        articles.forEach((article) => {
            if (article.categories && Array.isArray(article.categories)) {
                article.categories.forEach((category) => {
                    uniqueCategories.add(category as ArticleCategory);
                });
            }
        });

        const categoriesArray = Array.from(uniqueCategories);

        return {
            totalArticles: articles.length,
            totalCategories: categoriesArray.length,
            categories: categoriesArray,
        };
    } catch (error) {
        console.error('[Blog] Erreur lors du calcul des statistiques:', error);
        return {
            totalArticles: 0,
            totalCategories: 0,
            categories: [],
        };
    }
});

/**
 * Récupère un article par son slug
 * Utilise cache() et gère automatiquement notFound()
 * @param slug - Le slug de l'article
 * @returns Promise avec l'article
 */
export const getArticleBySlug = cache(
    async (slug: string): Promise<Article> => {
        try {
            if (!slug || typeof slug !== 'string') {
                console.error('[Blog] Slug invalide:', slug);
                notFound();
            }

            const { data: article } = await sanityFetch({
                query: articleBySlugQuery,
                params: { slug },
            });

            if (!article) {
                console.warn(`[Blog] Article non trouvé pour le slug: ${slug}`);
                notFound();
            }

            return article as Article;
        } catch (error) {
            console.error(
                `[Blog] Erreur lors du chargement de l'article ${slug}:`,
                error
            );
            notFound();
        }
    }
);

// ==========================================
// FONCTIONS DE RECOMMANDATION (SERVER-SIDE)
// ==========================================

/**
 * Obtient les articles recommandés (même catégorie ou récents)
 * @param currentArticleId - ID de l'article actuel
 * @param currentCategories - Catégories de l'article actuel
 * @param maxResults - Nombre maximum de résultats
 * @returns Promise avec les articles recommandés
 */
export const getRelatedArticles = cache(
    async (
        currentArticleId: string,
        currentCategories: ArticleCategory[],
        maxResults: number = 3
    ): Promise<ArticleSummary[]> => {
        try {
            const allArticles = await getArticleSummaries();

            if (!allArticles || allArticles.length === 0) {
                return [];
            }

            // Filtrer l'article actuel
            const otherArticles = allArticles.filter(
                (article) => article._id !== currentArticleId
            );

            if (otherArticles.length === 0) {
                return [];
            }

            // Articles de même catégorie
            const sameCategory = otherArticles.filter((article) =>
                article.categories?.some((cat) =>
                    currentCategories.includes(cat as ArticleCategory)
                )
            );

            // Compléter avec des articles récents si nécessaire
            const recentArticles = otherArticles
                .sort(
                    (a, b) =>
                        new Date(b.publishedAt).getTime() -
                        new Date(a.publishedAt).getTime()
                )
                .slice(0, maxResults);

            // Combiner et dédupliquer
            const related = [...sameCategory];
            for (const recent of recentArticles) {
                if (related.length >= maxResults) break;
                if (!related.find((r) => r._id === recent._id)) {
                    related.push(recent);
                }
            }

            return related.slice(0, maxResults);
        } catch (error) {
            console.error('[Blog] Erreur articles recommandés:', error);
            return [];
        }
    }
);
