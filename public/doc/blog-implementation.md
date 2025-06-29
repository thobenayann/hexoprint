# Documentation - Implémentation du Blog Hexoprint.fr

> **Mise à jour** : ✅ **Basculement vers Sanity terminé** - Le blog utilise maintenant Sanity CMS

## Architecture

### Structure des fichiers

```
src/
├── lib/
│   ├── blog-utils.ts           # Fonctions côté serveur (Sanity Live)
│   ├── blog-client-utils.ts    # Fonctions côté client (filtres, formatage)
│   └── sanity-queries.ts       # Requêtes Sanity (actives)
├── components/sections/
│   ├── BlogHero.tsx           # Hero avec lamp effect et statistiques
│   ├── BlogFilters.tsx        # Filtres par catégorie (client)
│   ├── BlogGrid.tsx           # Grille d'articles avec loading states
│   ├── BlogCard.tsx           # Carte d'article individuelle
│   ├── BlogContent.tsx        # Wrapper principal
│   └── RelatedArticles.tsx    # Articles recommandés avec design avancé
├── app/(client)/blog/
│   ├── page.tsx               # Page principale du blog
│   └── [slug]/page.tsx        # Page d'article individuel
├── sanity/schemaTypes/
│   └── article.ts             # Schéma Sanity (actif)
└── types/
    └── blog.ts                # Types TypeScript
```

### Configuration Sanity

#### **blog-utils.ts** (Fonctions Server-side avec Sanity)

- `getAllArticles()` - Charge tous les articles depuis Sanity avec cache React
- `getArticleSummaries()` - Articles sans body pour les listes
- `getArticleBySlug()` - Article individuel par slug depuis Sanity
- `getRelatedArticles()` - Articles recommandés intelligents

#### **blog-client-utils.ts** (Fonctions Client-side safe)

- `filterArticlesByCategory()` - Filtrage par catégorie
- `getUniqueCategories()` - Extraction des catégories
- `formatDate()` - Formatage des dates
- `calculateReadingTime()` - Calcul temps de lecture
- `generateExcerpt()` - Génération d'extraits
- `isValidArticle()` - Validation des articles

### Imports corrects

```typescript
// Dans les Server Components (pages, layouts)
import { getArticleBySlug, getRelatedArticles } from '@/lib/blog-utils';

// Dans les Client Components (composants interactifs)
import { formatDate, calculateReadingTime } from '@/lib/blog-client-utils';

// Pour les filtres côté client
import {
    filterArticlesByCategory,
    getUniqueCategories,
} from '@/lib/blog-client-utils';
```

## Fonctionnalités

### 1. Navigation

- **Statut** : ✅ Activé dans `navigation-config.ts`
- **Icône** : BookOpen (Lucide)
- **Mobile** : Intégré dans la navigation mobile

### 2. Page principale `/blog`

- **Hero dynamique** : LampContainer avec effet dramatique
- **Statistiques** : Style glass morphism (inspiré de GalleryHero)
- **Filtres** : Catégories avec état actif/inactif uniforme
- **Grille** : Layout responsive avec animations Framer Motion
- **Loading states** : Skeletons et états d'erreur

### 3. Pages d'articles `/blog/[slug]`

- **Navigation sticky** : Retour au blog toujours visible
- **Contenu riche** : PortableText avec composants personnalisés
- **Métadonnées** : Temps de lecture, date, catégories
- **Articles liés** : Recommandations intelligentes par catégorie
- **Animations** : Transitions fluides et effets de hover

### 4. SEO et performance

- **Métadonnées complètes** : Title, description, Open Graph, Twitter Cards
- **Structured Data** : JSON-LD pour les articles
- **Images optimisées** : Next.js Image avec sizes appropriées
- **Cache React** : Toutes les requêtes Sanity sont mise en cache

## Sanity CMS Integration

### ✅ Configuration active

Le blog utilise maintenant **Sanity CMS** avec **Sanity Live** pour :

- Chargement des articles en temps réel
- Cache automatique des requêtes
- Prévisualisation en direct dans le studio
- Gestion de contenu riche avec PortableText

### Studio Sanity

**Accès** : `http://localhost:3000/studio` (dev) ou `/studio` (production)

**Schéma Article** configuré avec :

- **Titre** (requis, max 65 caractères SEO)
- **Slug** (auto-généré depuis le titre)
- **Date de publication** (requise)
- **Image principale** avec texte alternatif
- **Contenu riche** (PortableText avec images, liens, formatage)
- **Catégories** (6 disponibles)
- **SEO** (titre et description meta)

### Requêtes Sanity actives

```typescript
// Articles complets (pour pages individuelles)
export const articleBySlugQuery = groq`
  *[_type == "article" && slug.current == $slug][0] {
    _id, title, slug, publishedAt, mainImage, body, categories, seo
  }
`;

// Articles résumés (pour listes)
export const articlesQuery = groq`
  *[_type == "article"] | order(publishedAt desc) {
    _id, title, slug, publishedAt, mainImage, categories, seo
  }
`;
```

## Corrections apportées

### ✅ Résolution des erreurs Sanity Live

**Problème initial** : `defineLive can only be used in React Server Components`

**Solution mise en place** :

1. Séparation des fonctions utilitaires en deux fichiers
2. `blog-utils.ts` exclusivement pour les fonctions serveur avec Sanity
3. `blog-client-utils.ts` pour les fonctions sûres côté client
4. Configuration Sanity Live avec fallbacks en cas d'erreur

### Améliorations design

1. **Hero** : Intégration du LampContainer pour un effet visuel moderne
2. **Catégories** : Couleurs uniformes basées sur la palette Hexoprint
3. **Articles liés** : Design sophistiqué avec glass morphism
4. **Animations** : Transitions fluides partout

## Structure de données Sanity

### Catégories disponibles (schéma Sanity)

```typescript
const ARTICLE_CATEGORIES = {
    modelisme: 'Modélisme',
    prototypage: 'Prototypage',
    reparation: 'Réparation',
    decoration: 'Décoration',
    technique: 'Technique',
    materiaux: 'Matériaux',
};
```

### Schéma Article Sanity

```typescript
{
  _id: string;
  _type: 'article';
  title: string;
  slug: { current: string };
  publishedAt: string;
  mainImage: {
    asset: { _id: string; url: string };
    alt: string;
    crop?: SanityCrop;
    hotspot?: SanityHotspot;
  };
  body: PortableTextBlock[];
  categories: ArticleCategory[];
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
  };
}
```

## Création de contenu

### Pour ajouter un nouvel article :

1. **Accéder au Studio** : `/studio`
2. **Créer un article** : Cliquer sur "Article" → "Créer"
3. **Remplir les champs** :
    - Titre (max 65 caractères pour SEO)
    - Slug (auto-généré)
    - Date de publication
    - Image principale + texte alt
    - Contenu avec l'éditeur riche
    - Catégories (sélection multiple)
    - Métadonnées SEO (optionnel)
4. **Publier** : Sauvegarder pour mise en ligne immédiate

### Éditeur de contenu riche

- **Titres** : H2, H3, H4 pour structurer
- **Formatage** : Gras, italique, code
- **Liens** : Internes et externes
- **Images** : Upload avec recadrage intelligent
- **Citations** : Style blockquote

## Tests et validation

### ✅ À vérifier après déploiement

1. **Articles visibles** : Vérifier que les articles Sanity s'affichent
2. **Navigation** : Tous les liens fonctionnent
3. **Responsive** : Mobile, tablette, desktop
4. **Performance** : Core Web Vitals avec cache Sanity
5. **SEO** : Métadonnées et structured data
6. **Studio** : Création et modification d'articles

### Commandes utiles

```bash
# Développement avec studio
npm run dev

# Studio uniquement
npm run studio

# Build de production
npm run build

# Génération des types Sanity
npm run typegen
```

### Troubleshooting

**Articles non visibles** :

- Vérifier les variables d'environnement Sanity
- S'assurer que des articles sont publiés dans le studio
- Vérifier les logs de sanityFetch dans la console

**Erreurs de cache** :

- Les requêtes sont mises en cache par React
- Redémarrer le serveur de dev si nécessaire
- Vérifier la configuration Sanity Live

---

**Statut** : ✅ **Production Ready avec Sanity CMS**  
**Dernière mise à jour** : Décembre 2024  
**Studio** : Accessible via `/studio`
