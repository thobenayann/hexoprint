/**
 * Types pour les articles de blog
 * Basés sur le schéma Sanity article.ts
 */

export type ArticleSlug = {
    current: string;
};

export type ArticleImage = {
    asset: {
        _id: string;
        url: string;
    };
    alt: string;
    crop?: {
        _type: 'sanity.imageCrop';
        top: number;
        bottom: number;
        left: number;
        right: number;
    } | null;
    hotspot?: {
        _type: 'sanity.imageHotspot';
        x: number;
        y: number;
        height: number;
        width: number;
    } | null;
};

export type ArticleBlock = {
    _type: 'block';
    style: string;
    children: Array<{
        _type: 'span';
        text: string;
    }>;
};

export type ArticleSeo = {
    metaTitle?: string;
    metaDescription?: string;
};

export type ArticleCategory =
    | 'modelisme'
    | 'prototypage'
    | 'reparation'
    | 'decoration'
    | 'technique'
    | 'materiaux';

export type Article = {
    _id: string;
    _type: 'article';
    title: string;
    slug: ArticleSlug;
    publishedAt: string;
    mainImage: ArticleImage;
    body: ArticleBlock[];
    categories: ArticleCategory[];
    seo: ArticleSeo;
};

/**
 * Type pour les articles résumés (liste)
 */
export type ArticleSummary = Pick<
    Article,
    | '_id'
    | '_type'
    | 'title'
    | 'slug'
    | 'publishedAt'
    | 'mainImage'
    | 'categories'
    | 'seo'
>;

/**
 * Catégories avec labels français
 */
export const ARTICLE_CATEGORIES: Record<ArticleCategory, string> = {
    modelisme: 'Modélisme',
    prototypage: 'Prototypage',
    reparation: 'Réparation',
    decoration: 'Décoration',
    technique: 'Technique',
    materiaux: 'Matériaux',
};

/**
 * Couleurs des badges de catégories - Design sobre inspiré de GalleryFilters
 */
export const CATEGORY_COLORS: Record<ArticleCategory, string> = {
    modelisme: 'bg-primary/10 text-primary border-primary/20',
    prototypage: 'bg-primary/10 text-primary border-primary/20',
    reparation: 'bg-primary/10 text-primary border-primary/20',
    decoration: 'bg-primary/10 text-primary border-primary/20',
    technique: 'bg-primary/10 text-primary border-primary/20',
    materiaux: 'bg-primary/10 text-primary border-primary/20',
};

/**
 * Couleurs pour les filtres actifs vs inactifs
 */
export const FILTER_COLORS = {
    active: 'bg-primary text-primary-foreground shadow-md shadow-primary/20 scale-105',
    inactive:
        'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground hover:scale-105',
    hover: 'transition-all duration-200 cursor-pointer',
};
