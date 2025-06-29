import type { Article, ArticleCategory, ArticleSummary } from '@/types/blog';

// ==========================================
// FONCTIONS UTILITAIRES (CLIENT-SIDE UNIQUEMENT)
// ==========================================

/**
 * Filtre les articles par catégorie (côté client)
 * @param articles - Liste des articles
 * @param category - Catégorie à filtrer
 * @returns Articles filtrés
 */
export function filterArticlesByCategory(
    articles: ArticleSummary[],
    category: ArticleCategory | 'all'
): ArticleSummary[] {
    if (!articles || !Array.isArray(articles)) {
        return [];
    }

    if (category === 'all') {
        return articles;
    }

    return articles.filter(
        (article) => article.categories && article.categories.includes(category)
    );
}

/**
 * Récupère les catégories uniques des articles
 * @param articles - Liste des articles
 * @returns Liste des catégories présentes
 */
export function getUniqueCategories(
    articles: ArticleSummary[]
): ArticleCategory[] {
    if (!articles || !Array.isArray(articles)) {
        return [];
    }

    const categories = new Set<ArticleCategory>();

    articles.forEach((article) => {
        if (article.categories && Array.isArray(article.categories)) {
            article.categories.forEach((category) => {
                if (typeof category === 'string') {
                    categories.add(category as ArticleCategory);
                }
            });
        }
    });

    return Array.from(categories);
}

/**
 * Formate une date pour l'affichage
 * @param dateString - Date au format ISO
 * @returns Date formatée en français
 */
export function formatDate(dateString: string): string {
    try {
        if (!dateString) return 'Date non définie';

        const date = new Date(dateString);

        if (isNaN(date.getTime())) {
            return 'Date invalide';
        }

        return new Intl.DateTimeFormat('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        }).format(date);
    } catch (error) {
        console.error('[Blog] Erreur formatage date:', error);
        return 'Date non disponible';
    }
}

/**
 * Calcule le temps de lecture estimé
 * @param bodyBlocks - Contenu de l'article
 * @returns Temps de lecture en minutes
 */
export function calculateReadingTime(bodyBlocks: Article['body']): number {
    if (!bodyBlocks || !Array.isArray(bodyBlocks)) {
        return 1;
    }

    const wordsPerMinute = 200;

    try {
        const totalWords = bodyBlocks.reduce((count, block) => {
            if (
                block._type === 'block' &&
                block.children &&
                Array.isArray(block.children)
            ) {
                const blockText = block.children
                    .filter((child) => child && typeof child.text === 'string')
                    .map((child) => child.text)
                    .join(' ');

                const words = blockText
                    .trim()
                    .split(/\s+/)
                    .filter((word) => word.length > 0);
                return count + words.length;
            }
            return count;
        }, 0);

        return Math.max(1, Math.ceil(totalWords / wordsPerMinute));
    } catch (error) {
        console.error('[Blog] Erreur calcul temps de lecture:', error);
        return 1;
    }
}

/**
 * Génère un extrait de l'article
 * @param bodyBlocks - Contenu de l'article
 * @param maxLength - Longueur maximale de l'extrait
 * @returns Extrait de l'article
 */
export function generateExcerpt(
    bodyBlocks: Article['body'],
    maxLength: number = 150
): string {
    if (!bodyBlocks || !Array.isArray(bodyBlocks)) {
        return 'Aucun contenu disponible.';
    }

    try {
        const fullText = bodyBlocks
            .filter((block) => block._type === 'block' && block.children)
            .map((block) =>
                block.children
                    .filter((child) => child && typeof child.text === 'string')
                    .map((child) => child.text)
                    .join(' ')
            )
            .join(' ')
            .trim();

        if (!fullText) {
            return 'Contenu non disponible.';
        }

        if (fullText.length <= maxLength) {
            return fullText;
        }

        // Trouver la dernière phrase complète dans la limite
        const truncated = fullText.substring(0, maxLength);
        const lastSentence = truncated.lastIndexOf('.');

        if (lastSentence > maxLength * 0.7) {
            return truncated.substring(0, lastSentence + 1);
        }

        return truncated.trim() + '…';
    } catch (error) {
        console.error('[Blog] Erreur génération extrait:', error);
        return 'Extrait non disponible.';
    }
}

/**
 * Vérifie si un article est valide
 * @param article - Article à vérifier
 * @returns True si l'article est valide
 */
export function isValidArticle(article: unknown): article is Article {
    if (!article || typeof article !== 'object') return false;

    const a = article as Article;
    return !!(
        a._id &&
        a.title &&
        a.slug?.current &&
        a.publishedAt &&
        a.mainImage?.asset?.url &&
        Array.isArray(a.categories) &&
        Array.isArray(a.body)
    );
}
