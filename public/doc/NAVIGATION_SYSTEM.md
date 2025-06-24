# 🧭 Système de Navigation Intelligent - Hexoprint

## 📖 Vue d'ensemble

Ce système permet de contrôler de manière centralisée et type-safe quelles routes sont visibles dans la navigation du site. Il suit les principes de **Clean Code** et de **Séparation des Préoccupations (SOC)**.

## 🏗️ Architecture

### Fichiers principaux

1. **`src/lib/navigation-config.ts`** - Configuration centralisée des routes
2. **`src/components/layout/desktop-navigation.tsx`** - Navigation desktop refactorisée
3. **`src/components/layout/mobile-bottom-navigation.tsx`** - Navigation mobile refactorisée
4. **`src/components/layout/Footer.tsx`** - Footer refactorisé

## 🔧 Configuration des routes

### Types disponibles

```typescript
type RouteStatus = 'active' | 'inactive' | 'coming-soon';
```

- **`active`** : Route développée et accessible
- **`inactive`** : Route non développée, masquée dans la navigation
- **`coming-soon`** : Route en cours de développement, visible avec indicateur

### Structure d'une route

```typescript
type NavigationRoute = {
    id: string; // Identifiant unique
    title: string; // Titre affiché
    path: string; // Chemin de la route
    icon: LucideIcon; // Icône pour mobile
    status: RouteStatus; // État de la route
    description?: string; // Description (optionnel)
    subRoutes?: NavigationSubRoute[]; // Sous-routes
};
```

## 🚀 Utilisation

### 1. Activer/Désactiver une route

Dans `src/lib/navigation-config.ts`, modifiez le statut :

```typescript
{
    id: 'blog',
    title: 'Blog',
    path: '/blog',
    icon: BookOpen,
    status: 'inactive', // ❌ Masqué
    // status: 'active',   // ✅ Visible et actif
    // status: 'coming-soon', // 🔄 Visible avec indicateur
}
```

### 2. Ajouter une nouvelle route

```typescript
{
    id: 'new-feature',
    title: 'Nouvelle fonctionnalité',
    path: '/new-feature',
    icon: Star,
    status: 'coming-soon',
}
```

### 3. Ajouter des sous-routes

```typescript
{
    id: 'services',
    title: 'Prestations',
    path: '/prestations',
    icon: Printer,
    status: 'active',
    subRoutes: [
        {
            id: 'services-pro',
            title: 'Professionnels',
            path: '/prestations/pro',
            description: 'Services pour les entreprises',
            status: 'active',
        }
    ],
}
```

## 🛠️ API du NavigationService

### Méthodes disponibles

```typescript
// Récupère toutes les routes actives
NavigationService.getActiveRoutes();

// Récupère les routes visibles (active + coming-soon)
NavigationService.getVisibleRoutes();

// Vérifie si une route est active
NavigationService.isRouteActive('blog');

// Récupère une route par ID
NavigationService.getRouteById('home');

// Récupère une route par chemin
NavigationService.getRouteByPath('/contact');

// Récupère les sous-routes actives
NavigationService.getActiveSubRoutes('services');

// Vérifie si une route a des sous-routes actives
NavigationService.hasActiveSubRoutes('services');
```

## 🎨 Design et UX

### Indicateurs visuels "coming-soon"

- **Desktop** : Icône horloge bleue (cohérente avec la charte graphique)
- **Mobile** : Badge circulaire bleu discret + texte "(bientôt)"
- **Footer** : Mention "(bientôt)" en bleu
- **Tooltips** : ShadcnUI tooltips modernes avec "Bientôt disponible"
- **Opacité** : 70% pour indiquer l'état non-actif

### Charte graphique respectée

- ✅ Utilisation des couleurs de l'app (bleu au lieu d'orange)
- ✅ Tooltips ShadcnUI consistants
- ✅ Animations et transitions cohérentes
- ✅ Respect de la hiérarchie visuelle

## 🎯 Avantages

### ✅ Type Safety

- Configuration TypeScript complète
- Pas d'erreurs de typage
- IntelliSense automatique

### ✅ Centralisation

- Une seule source de vérité
- Modifications propagées automatiquement
- Cohérence garantie entre tous les composants

### ✅ Flexibilité

- Support des sous-routes
- Statuts multiples (active/inactive/coming-soon)
- Extensible facilement

### ✅ UX/UI

- Design cohérent avec la charte graphique
- Tooltips modernes ShadcnUI
- Indicateurs visuels clairs
- Accessibilité respectée

## 📝 Exemple d'utilisation

### Scénario : Désactiver temporairement le Blog

1. **Ouvrir** `src/lib/navigation-config.ts`
2. **Modifier** le statut de la route blog :

```typescript
{
    id: 'blog',
    title: 'Blog',
    path: '/blog',
    icon: BookOpen,
    status: 'inactive', // ✅ Route masquée automatiquement
}
```

3. **Résultat** : Le blog disparaît automatiquement de :
    - Navigation desktop
    - Navigation mobile
    - Footer
    - Tout autre composant utilisant `NavigationService`

### Scénario : Préparer une nouvelle fonctionnalité

```typescript
{
    id: 'estimate',
    title: 'Devis en ligne',
    path: '/estimate',
    icon: Calculator,
    status: 'coming-soon', // ✅ Visible avec indicateur cohérent
}
```

## 🚨 Bonnes pratiques

### ✅ À faire

- Utiliser des IDs uniques et descriptifs
- Maintenir la cohérence des icônes
- Tester les changements sur mobile et desktop
- Respecter la charte graphique existante

### ❌ À éviter

- Modifier directement les composants de navigation
- Créer des routes sans passer par la configuration
- Utiliser des couleurs incohérentes
- Laisser des routes `coming-soon` trop longtemps

## 🔄 Migration depuis l'ancien système

Si vous avez des routes codées en dur, voici comment migrer :

### Avant

```typescript
// Navigation codée en dur
<Link href="/galerie">Galerie</Link>
```

### Après

```typescript
// Navigation dynamique
{NavigationService.getVisibleRoutes().map(route => (
    <Link key={route.id} href={route.path}>
        {route.title}
    </Link>
))}
```

## 🎉 Conclusion

Ce système de navigation intelligent offre :

- **Flexibilité** pour gérer les routes en développement
- **Type safety** pour éviter les erreurs
- **Design cohérent** respectant la charte graphique
- **UX moderne** avec tooltips ShadcnUI
- **Maintenabilité** pour les futures évolutions

Il s'intègre parfaitement avec Next.js 15 et respecte les meilleures pratiques de développement React moderne.
