# 🏠 Page d’accueil Hexoprint – Brief complet pour génération de code

## 🎯 Objectif

Créer une **page d’accueil immersive, engageante et cohérente avec l’univers de l’impression 3D artisanale et technique** de la marque Hexoprint.

La structure de la page doit raconter une **histoire fluide et convaincante**.  
On s’adresse autant à un professionnel qu’à un particulier, en mettant en avant :

-   L’expertise technique (prototypage, dépannage, précision)
-   L’accessibilité et l'accompagnement (modélisme, objets déco)
-   La passion de Yann, artisan-imprimeur 3D à Seysses (31)

---

## 🧱 Structure de la page

### 1. **Header immersif avec composant Spline animé**

-   Utiliser le composant `SplineScene` (fourni dans le prompt)
-   Animation 3D non bloquante (React Suspense + lazy import)
-   Fond sombre (`bg-black/[0.96]`) pour bien faire ressortir la lumière
-   Texte d’accroche + CTA « Demandez votre devis »
-   Spot lumineux (component `Spotlight`) dans le fond
-   Responsive mobile first
-   Path composant : `/components/ui/splite.tsx`

### 2. **Section “Pourquoi Hexoprint ?”**

-   Composant `Card` (shadcnUI) avec animation d’apparition (ex: framer-motion)
-   3 à 4 valeurs clés :
    -   Accompagnement personnalisé
    -   Impressions de précision
    -   Rapidité et disponibilité
    -   Livraison dans toute la France
-   Illustration : `lucide-react` icons ou images Unsplash
-   Path composant : `/components/sections/WhyHexoprint.tsx`

### 3. **Section “Pour qui ?”**

-   Deux colonnes (Professionnels / Particuliers)
-   Composants `Tabs` (shadcnUI) ou `Accordion` (mobile friendly)
-   Chaque profil contient :
    -   Icône / image
    -   Quelques exemples : pièce de réparation, prototype fonctionnel, figurine modélisme, objet décoratif...
-   Animation légère (fade/slide, via `framer-motion`)
-   Path composant : `/components/sections/TargetAudience.tsx`

### 4. **Section “Exemples de réalisations”**

-   Galerie avec composant `Card` ou `GridCard` (shadcnUI)
-   Chargement RSC : contenu statique d’abord, animation au survol uniquement
-   Composant `Image` (Next.js optimisé) avec `alt` fourni via CMS
-   Possibilité d’ajouter un bouton “Voir plus” vers `/galerie`
-   Path composant : `/components/sections/GalleryPreview.tsx`

### 5. **Section “Témoignages & retours clients”**

-   Slider type `Testimonials` (MagicUI ou custom shadcnUI)
-   3 avis (issus de Google Business)
-   Mobile first, tactile-friendly
-   Animation discrète, fluide
-   Path composant : `/components/sections/Testimonials.tsx`

### 6. **Section “Demander un devis”**

-   CTA clair, centré, animé sur hover
-   Bouton dirigeant vers la page `/devis`
-   Style shadcnUI (`Button`, `Card`, `Spotlight` possible)
-   Texte rassurant sur le délai, la personnalisation
-   Path composant : `/components/sections/CallToAction.tsx`

### 7. **Footer avec lien social**

-   Icône Instagram (`lucide-react` ou SVG animé)
-   Lien : [https://www.instagram.com/hexoprint3d](https://www.instagram.com/hexoprint3d)
-   Hover animé discret (glow, bounce, scale ou blur subtil)
-   Informations légales simples (mentions, SIRET...)
-   Responsive bien géré
-   Path composant : `/components/layout/Footer.tsx`

---

## 🧪 Animation & UI/UX

-   Utiliser **Framer Motion** pour des transitions **douces et progressives**
-   Utiliser **Aceternity Spotlight** dans les composants de fond ou CTA
-   Intégration de composants “funs” sans sacrifier l’accessibilité
-   Éviter les animations bloquantes : **prioriser la vitesse du LCP** (Lazy load + `use client` si animation)

---

## 📱 Mobile first

-   Tous les composants doivent être pensés **d’abord pour le mobile** puis enrichis sur desktop
-   Utiliser `flex-col`, `gap`, `overflow-x` si besoin
-   Favoriser des tailles de polices adaptatives (`text-lg md:text-2xl`, etc.)

---

## ⚙️ Contraintes techniques

-   **Next.js 15** avec React Server Components activés (utiliser des composants client uniquement si nécessaire)
-   **shadcnUI** avec structure `/components/ui/`
-   **Tailwind CSS v4**
-   **TypeScript**
-   Architecture propre : **SOC (Separation of Concerns)**, chaque composant a son rôle
-   Si besoin, composants `lib/` pour helpers, `types/` pour les interfaces

---

## 📦 Dépendances à prévoir

```bash
pnpm add @splinetool/react-spline @splinetool/runtime framer-motion lucide-react
```

---

## ✅ Composants à intégrer (selon prompt précédent)

-   /components/ui/splite.tsx – SplineScene
-   /components/ui/spotlight.tsx – Spotlight
-   /components/ui/card.tsx – Card (shadcnUI)
-   /components/sections/\*.tsx – Sections de la page d’accueil

---

## 💡 Ce que l’IA doit faire

-   Générer les composants React fonctionnels pour chaque section, selon cette structure
-   Respecter les bonnes pratiques : props typées, composants réutilisables, code clair
-   Créer une page src/app/page.tsx qui importe ces sections dans l’ordre défini ci-dessus
-   Ne pas s’occuper du contenu textuel (déjà fourni ailleurs)

---

## 📚 Références

-   [shadcn/ui](https://ui.shadcn.com/)
-   [magicui.dev](https://magicui.design/)
-   [aceternity-ui](https://ui.aceternity.com/)
-   [lucide-react](https://lucide.dev/guide/packages/lucide-react)
-   [splinetool](https://spline.design/)
