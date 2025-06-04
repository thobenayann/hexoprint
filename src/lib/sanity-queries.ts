import { groq } from 'next-sanity';
// import type { Article, Gallery, Configuration } from '../../sanity.types'

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
      alt
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
      alt
    },
    body,
    categories,
    seo {
      metaTitle,
      metaDescription
    }
  }
`;

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
      alt
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
      alt
    },
    description,
    category,
    material,
    printTime,
    createdAt
  }
`;

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
