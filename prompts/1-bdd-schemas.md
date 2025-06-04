# 🎯 Objectif

Tu vas créer les schémas Sanity nécessaires pour le site Hexoprint.fr, dans le but de gérer 3 collections de contenus dans le Studio Sanity.  
Le projet utilise Sanity V3, TypeScript, et doit être cohérent avec les meilleures pratiques de modélisation CMS.

Le style attendu est **techniquement propre**, avec des **types explicites**, une **validation basique utile** et une orientation SEO.

---

## 📰 Schéma 1 – Articles

Cette collection représente les **articles de blog**.

Champs attendus :

-   `title` (string) – Titre de l’article (SEO friendly, max 65 caractères recommandé)
-   `slug` (slug) – Généré automatiquement à partir du titre
-   `publishedAt` (datetime) – Date de publication
-   `mainImage` (image) – Image principale, avec champ `alt` obligatoire
-   `body` (rich text) – Contenu de l’article ; utiliser un système de blocs si possible (portable text)
-   `categories` (tags ou enum) – Tags associés à l’article, idéalement sous forme de liste fermée (par ex. : `Modélisme`, `Prototypage`, `Réparation`, `Décoration`)
-   `seo` (object) – Groupe de champs pour les données SEO :
    -   `metaTitle` (string) – max 65 caractères
    -   `metaDescription` (string) – max 155 caractères

Prévoir une preview sur le titre et l’image.

---

## 🖼️ Schéma 2 – Galerie

Cette collection représente une galerie de réalisations.

Champs attendus :

-   `title` (string) – Titre court
-   `image` (image) – Image illustrant la création (avec `alt`)
-   `description` (text) – Description courte (max 160 caractères)

Prévoir une preview sur le titre et l’image.

---

## ⚙️ Schéma 3 – Configuration

Cette collection stocke des données techniques que Yann (le gérant) pourra modifier pour piloter des calculs de prix dans le futur.  
Il n’y aura **qu’un seul document** dans cette collection (singleton).

Champs attendus :

### 1. `hourlyRate`

-   number – Le taux horaire de la main d’œuvre (€)

### 2. `filaments`

-   array of objects  
    Chaque filament contient :
    -   `material` (string) – Exemple : PLA, PETG, ABS
    -   `pricePerKg` (number) – Prix d’achat au kg (€)

### 3. `machines`

-   array of objects  
    Chaque machine contient :
    -   `model` (string) – Nom du modèle
    -   `volume` (string) – Exemple : 220x220x250 mm
    -   `precision` (number) – En mm

### 4. `additionalCosts`

-   array of objects  
    Chaque élément contient :
    -   `label` (string)
    -   `amount` (number) – en €

Prévoir une preview fixe (ex. : "Configuration générale").

---

## Contraintes techniques

-   Utiliser `defineType` et `defineField` de Sanity V3
-   Respecter l’ordre logique des champs
-   Valider les champs essentiels (`required`, `min`, `max` si pertinent)
-   Structurer les schémas dans le dossier `src/sanity/schemaTypes`
-   Compatible TypeScript
-   Intégrable facilement dans un studio Next.js 15 + App Router

---

## Ce que je veux

Que tu me génères les 3 fichiers TypeScript distincts correspondant à ces schémas (`article.ts`, `gallery.ts`, `configuration.ts`)  
Et que tu mettes à jour ou me proposes un `index.ts` qui les regroupe pour Sanity.

---
