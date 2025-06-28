import mockArticles from '@/data/mock-articles.json';
import type { Article, ArticleCategory, ArticleSummary } from '@/types/blog';

/**
 * Charge tous les articles depuis le fichier JSON
 * @returns Promise avec la liste des articles
 */
export async function getAllArticles(): Promise<Article[]> {
    // Simule un délai d'API pour un comportement réaliste
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Tri par date de publication décroissante
    return (mockArticles as Article[]).sort(
        (a, b) =>
            new Date(b.publishedAt).getTime() -
            new Date(a.publishedAt).getTime()
    );
}

/**
 * Charge les articles résumés (sans body) pour la liste
 * @returns Promise avec la liste des résumés d'articles
 */
export async function getArticleSummaries(): Promise<ArticleSummary[]> {
    const articles = await getAllArticles();

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return articles.map(({ body: _, ...article }) => article);
}

/**
 * Récupère un article par son slug
 * @param slug - Le slug de l'article
 * @returns Promise avec l'article ou undefined
 */
export async function getArticleBySlug(
    slug: string
): Promise<Article | undefined> {
    const articles = await getAllArticles();

    return articles.find((article) => article.slug.current === slug);
}

/**
 * Filtre les articles par catégorie
 * @param articles - Liste des articles
 * @param category - Catégorie à filtrer
 * @returns Articles filtrés
 */
export function filterArticlesByCategory(
    articles: ArticleSummary[],
    category: ArticleCategory | 'all'
): ArticleSummary[] {
    if (category === 'all') {
        return articles;
    }

    return articles.filter((article) => article.categories.includes(category));
}

/**
 * Récupère les catégories uniques des articles
 * @param articles - Liste des articles
 * @returns Liste des catégories présentes
 */
export function getUniqueCategories(
    articles: ArticleSummary[]
): ArticleCategory[] {
    const categories = new Set<ArticleCategory>();

    articles.forEach((article) => {
        article.categories.forEach((category) => {
            categories.add(category);
        });
    });

    return Array.from(categories);
}

/**
 * Formate une date pour l'affichage
 * @param dateString - Date au format ISO
 * @returns Date formatée en français
 */
export function formatDate(dateString: string): string {
    const date = new Date(dateString);

    return new Intl.DateTimeFormat('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    }).format(date);
}

/**
 * Calcule le temps de lecture estimé
 * @param bodyBlocks - Contenu de l'article
 * @returns Temps de lecture en minutes
 */
export function calculateReadingTime(bodyBlocks: Article['body']): number {
    const wordsPerMinute = 200;

    const totalWords = bodyBlocks.reduce((count, block) => {
        if (block._type === 'block') {
            const blockText = block.children
                .map((child) => child.text)
                .join(' ');
            return count + blockText.split(/\s+/).length;
        }
        return count;
    }, 0);

    return Math.max(1, Math.ceil(totalWords / wordsPerMinute));
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
    const fullText = bodyBlocks
        .filter((block) => block._type === 'block')
        .map((block) => block.children.map((child) => child.text).join(' '))
        .join(' ');

    if (fullText.length <= maxLength) {
        return fullText;
    }

    return fullText.substring(0, maxLength).trim() + '...';
}
