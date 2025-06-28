# Documentation - Blog Hexoprint.fr

## Vue d'ensemble

Le blog d'Hexoprint.fr a été implémenté avec une architecture moderne utilisant Next.js 15, TypeScript, et Tailwind CSS v4. Il est conçu pour être facilement migrable vers Sanity CMS tout en étant fonctionnel avec des données JSON en attendant.

## Architecture

### Structure des fichiers

```
src/
├── app/(client)/blog/
│   ├── page.tsx                    # Page principale du blog
│   └── [slug]/
│       └── page.tsx               # Page d'article individuel
├── components/sections/
│   ├── BlogHero.tsx               # Section hero du blog
│   ├── BlogFilters.tsx            # Filtres par catégorie
│   ├── BlogContent.tsx            # Composant wrapper avec état
│   ├── BlogGrid.tsx               # Grille d'articles
│   └── BlogCard.tsx               # Carte d'article individuelle
├── data/
│   └── mock-articles.json         # Articles de démonstration
├── lib/
│   ├── blog-utils.ts              # Utilitaires pour le blog
│   └── sanity-queries.ts          # Requêtes Sanity (préparées)
├── types/
│   └── blog.ts                    # Types TypeScript
```

### Composants clés

#### 1. BlogHero

- Section d'accueil avec titre, description et statistiques
- Animations blob et effets visuels modernes
- Responsive design mobile-first

#### 2. BlogFilters

- Filtres interactifs par catégorie
- Compteurs d'articles par catégorie
- Gestion d'état côté client avec useState

#### 3. BlogGrid

- Grille responsive d'articles
- Skeleton loading pour l'UX
- État vide avec message informatif

#### 4. BlogCard

- Carte d'article avec image, titre, extrait
- Badges de catégories colorés
- Animations hover subtiles

## Fonctionnalités

### ✅ Implémentées

- **Navigation active** : Le lien blog est maintenant actif dans la navigation
- **SEO optimisé** : Métadonnées complètes avec Open Graph et Twitter Cards
- **Filtres par catégorie** : 6 catégories prédéfinies avec compteurs
- **Design responsive** : Mobile-first avec Tailwind CSS v4
- **Pages d'articles** : Routes dynamiques avec génération statique
- **Loading states** : Skeletons pour une meilleure UX
- **Accessibilité** : Labels ARIA, navigation au clavier
- **Schema.org** : Données structurées pour le SEO

### 🔄 Prêtes pour Sanity

- **Requêtes Sanity** : Définies dans `sanity-queries.ts`
- **Types compatibles** : Basés sur le schéma `article.ts`
- **Migration guidée** : Documentation et exemples fournis

## Types de données

### Article complet

```typescript
type Article = {
    _id: string;
    _type: 'article';
    title: string;
    slug: { current: string };
    publishedAt: string;
    mainImage: ArticleImage;
    body: ArticleBlock[];
    categories: ArticleCategory[];
    seo: ArticleSeo;
};
```

### Catégories disponibles

- `modelisme` - Modélisme
- `prototypage` - Prototypage
- `reparation` - Réparation
- `decoration` - Décoration
- `technique` - Technique
- `materiaux` - Matériaux

## Migration vers Sanity CMS

### Étape 1 : Créer les articles dans Sanity Studio

1. Accéder à `/studio`
2. Créer des articles en utilisant le schéma existant
3. Remplir tous les champs requis :
    - Titre (max 65 caractères pour le SEO)
    - Slug auto-généré
    - Date de publication
    - Image principale avec texte alternatif
    - Contenu avec éditeur WYSIWYG
    - Catégories
    - Métadonnées SEO

### Étape 2 : Modifier blog-utils.ts

Remplacer les fonctions JSON par les requêtes Sanity :

```typescript
// Avant (JSON)
import mockArticles from '@/data/mock-articles.json';

// Après (Sanity)
import { sanityFetch } from '@/sanity/lib/live';
import { articlesQuery, articleBySlugQuery } from '@/lib/sanity-queries';

export async function getAllArticles(): Promise<Article[]> {
    return await sanityFetch({ query: articlesQuery });
}

export async function getArticleBySlug(
    slug: string
): Promise<Article | undefined> {
    return await sanityFetch({
        query: articleBySlugQuery,
        params: { slug },
    });
}
```

### Étape 3 : Avantages de Sanity

#### Éditeur de contenu riche

- **WYSIWYG** : Éditeur visuel pour le formatage
- **Blocs structurés** : Paragraphes, titres, citations, images
- **Liens internes** : Références entre contenus
- **Prévisualisation** : Voir le rendu en temps réel

#### Gestion d'images avancée

- **Upload drag & drop** : Interface intuitive
- **Redimensionnement automatique** : Optimisation pour le web
- **Points chauds** : Recadrage intelligent
- **CDN global** : Livraison rapide des images

#### Workflow de publication

- **Brouillons** : Sauvegarde automatique
- **Planification** : Publication programmée
- **Versions** : Historique des modifications
- **Collaboration** : Multi-utilisateurs en temps réel

## SEO et Performance

### Métadonnées optimisées

Chaque page inclut :

- **Title** optimisé (65 caractères max)
- **Description** pertinente (155 caractères max)
- **Open Graph** pour les réseaux sociaux
- **Twitter Cards** pour un affichage riche
- **Schema.org** pour les données structurées
- **Canonical URLs** pour éviter le contenu dupliqué

### Performance

- **SSG** : Génération statique des pages d'articles
- **Images optimisées** : Next.js Image avec lazy loading
- **Suspense** : Chargement progressif des composants
- **Prefetching** : Liens pré-chargés automatiquement

### Core Web Vitals

- **LCP** : Images optimisées et priorité des ressources
- **CLS** : Dimensions d'images définies, skeletons
- **FID** : Hydratation minimale côté client

## Maintenance et évolution

### Ajout de nouvelles catégories

1. Modifier `ARTICLE_CATEGORIES` dans `types/blog.ts`
2. Ajouter les couleurs dans `CATEGORY_COLORS`
3. Mettre à jour les options dans `sanity/schemaTypes/article.ts`

### Personnalisation du design

- **Couleurs** : Modifier les classes Tailwind dans `CATEGORY_COLORS`
- **Animations** : Ajuster dans `tailwind.config.ts`
- **Layout** : Modifier les composants sections individuellement

### Ajout de fonctionnalités

Fonctionnalités futures possibles :

- **Recherche** : Full-text search avec Sanity
- **Tags** : Système de tags complémentaire aux catégories
- **Commentaires** : Intégration avec un service tiers
- **Newsletter** : Abonnement aux nouveaux articles
- **Partage social** : Boutons de partage
- **Articles liés** : Suggestions basées sur les catégories

## Tests et validation

### Checklist de validation

- [ ] Navigation blog active et fonctionnelle
- [ ] Page `/blog` charge correctement
- [ ] Filtres par catégorie fonctionnent
- [ ] Pages d'articles individuels accessibles
- [ ] Images s'affichent correctement
- [ ] Métadonnées SEO présentes
- [ ] Design responsive sur mobile/desktop
- [ ] Performance acceptable (Lighthouse)
- [ ] Accessibilité respectée

### Commandes utiles

```bash
# Développement
pnpm dev

# Build de production
pnpm build

# Lancement du studio Sanity
pnpm studio

# Génération des types Sanity
pnpm typegen
```

## Support et resources

### Documentation Sanity

- [Guide officiel](https://www.sanity.io/docs)
- [Portable Text](https://portabletext.org/)
- [Schémas](https://www.sanity.io/docs/schema-types)

### Next.js 15

- [App Router](https://nextjs.org/docs/app)
- [Metadata API](https://nextjs.org/docs/app/api-reference/functions/generate-metadata)
- [Images](https://nextjs.org/docs/app/api-reference/components/image)

Cette implémentation offre une base solide pour le blog d'Hexoprint.fr avec une migration facile vers Sanity CMS quand vous serez prêt.
