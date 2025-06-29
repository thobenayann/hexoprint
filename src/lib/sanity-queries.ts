import { groq } from 'next-sanity';
// import type { Article, Gallery, Configuration } from '../../sanity.types'

// ==========================================
// REQUÊTES POUR LES ARTICLES DE BLOG
// ==========================================

/**
 * IMPORTANT : Migration depuis les articles JSON vers Sanity
 *
 * Pour basculer de mock-articles.json vers Sanity :
 * 1. Décommenter les requêtes ci-dessous
 * 2. Modifier blog-utils.ts pour utiliser sanityFetch() au lieu du JSON
 * 3. Importer { sanityFetch } depuis '@/sanity/lib/live'
 * 4. Remplacer les fonctions dans blog-utils.ts
 *
 * Exemple de migration :
 * export async function getAllArticles(): Promise<Article[]> {
 *   return await sanityFetch({ query: articlesQuery });
 * }
 */

// Requêtes pour les articles
export const articlesQuery = groq`
  *[_type == "article"] | order(publishedAt desc) {
    _id,
    _type,
    title,
    slug,
    publishedAt,
    mainImage {
      asset->{
        _id,
        url
      },
      alt,
      crop,
      hotspot
    },
    categories,
    seo {
      metaTitle,
      metaDescription
    }
  }
`;

export const articleBySlugQuery = groq`
  *[_type == "article" && slug.current == $slug][0] {
    _id,
    _type,
    title,
    slug,
    publishedAt,
    mainImage {
      asset->{
        _id,
        url
      },
      alt,
      crop,
      hotspot
    },
    body,
    categories,
    seo {
      metaTitle,
      metaDescription
    }
  }
`;

// ==========================================
// REQUÊTES POUR LA GALERIE (DÉJÀ ACTIVES)
// ==========================================

// Requêtes pour la galerie
export const galleryQuery = groq`
  *[_type == "gallery"] | order(createdAt desc) {
    _id,
    _type,
    title,
    image {
      asset->{
        _id,
        url
      },
      alt,
      crop,
      hotspot
    },
    description,
    category,
    material,
    printTime,
    featured,
    createdAt
  }
`;

export const featuredGalleryQuery = groq`
  *[_type == "gallery" && featured == true] | order(createdAt desc) {
    _id,
    _type,
    title,
    image {
      asset->{
        _id,
        url
      },
      alt,
      crop,
      hotspot
    },
    description,
    category,
    material,
    printTime,
    createdAt
  }
`;

// Alias pour la compatibilité
export const allGalleryQuery = galleryQuery;

// ==========================================
// REQUÊTES POUR LA CONFIGURATION
// ==========================================

// Requête pour la configuration
export const configurationQuery = groq`
  *[_type == "configuration"][0] {
    _id,
    _type,
    hourlyRate,
    filaments[] {
      material,
      pricePerKg,
      color,
      brand
    },
    machines[] {
      model,
      volume,
      precision,
      technology,
      isActive
    },
    additionalCosts[] {
      label,
      amount,
      description,
      isActive
    },
    lastUpdated
  }
`;

// ==========================================
// TYPES POUR FUTURE INTÉGRATION SANITY
// ==========================================

// Fonctions typées (à décommenter après génération des types)
/*
export type ArticleQueryResult = Array<Pick<Article, '_id' | '_type' | 'title' | 'slug' | 'publishedAt' | 'categories' | 'seo'> & {
  mainImage: {
    asset: {
      _id: string
      url: string
    }
    alt: string
  }
}>

export type ArticleDetailResult = Pick<Article, '_id' | '_type' | 'title' | 'slug' | 'publishedAt' | 'body' | 'categories' | 'seo'> & {
  mainImage: {
    asset: {
      _id: string
      url: string
    }
    alt: string
  }
}

export type GalleryQueryResult = Array<Pick<Gallery, '_id' | '_type' | 'title' | 'description' | 'category' | 'material' | 'printTime' | 'featured' | 'createdAt'> & {
  image: {
    asset: {
      _id: string
      url: string
    }
    alt: string
  }
}>

export type ConfigurationResult = Configuration | null
*/

// ==========================================
// GUIDE D'INTÉGRATION SANITY
// ==========================================

/**
 * ÉTAPES POUR BASCULER VERS SANITY :
 *
 * 1. CRÉER LES ARTICLES DANS SANITY STUDIO
 *    - Aller sur /studio
 *    - Créer des articles en utilisant le schéma article.ts
 *    - Remplir tous les champs requis
 *
 * 2. MODIFIER blog-utils.ts
 *    - Remplacer l'import JSON par sanityFetch
 *    - Utiliser les requêtes ci-dessus
 *
 * 3. TESTER LA MIGRATION
 *    - Vérifier que les articles s'affichent correctement
 *    - Tester les filtres et la navigation
 *
 * 4. SUPPRIMER LE FICHIER JSON
 *    - Une fois la migration confirmée
 *
 * AVANTAGES DE SANITY :
 * - Éditeur WYSIWYG pour le contenu riche
 * - Prévisualisation en temps réel
 * - Gestion d'images avancée avec redimensionnement automatique
 * - Support des brouillons et planification de publication
 * - API GraphQL et REST disponibles
 * - Collaboration multi-utilisateurs
 */
