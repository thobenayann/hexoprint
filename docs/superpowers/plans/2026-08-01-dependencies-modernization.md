# Hexoprint Dependency Modernization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Mettre toutes les dépendances directes d’Hexoprint à leur dernière version stable compatible, supprimer les paquets dépréciés et rétablir une chaîne de vérification fiable.

**Architecture:** Les mises à jour sont réparties en cohortes compatibles : socle Next/React, CMS Sanity, e-mail/validation, puis outillage et UI. Chaque cohorte modifie le lockfile une seule fois et doit passer les mêmes contrôles avant que la suivante commence.

**Tech Stack:** pnpm 10, Next.js 16 App Router, React 19, TypeScript, ESLint Flat Config, Sanity, Zod, React Email, Resend.

## Global Constraints

- Utiliser pnpm exclusivement et conserver `pnpm-lock.yaml` comme source reproductible.
- Refaire `pnpm outdated --format json` au début de l’exécution ; les versions ci-dessous sont celles observées le 1er août 2026.
- Toutes les dépendances directes doivent finir à leur dernière version stable compatible, ou apparaître dans le rapport final avec une justification vérifiable.
- Le code doit rester compatible avec le runtime Node.js 22 utilisé par le projet Vercel.
- Après chaque cohorte, exécuter le lint, TypeScript, `seo:validate`, le build et l’audit de sécurité.
- Ne pas utiliser `pnpm audit --fix --force`, `overrides` ou `resolutions` comme contournement permanent.
- Ne réaliser aucun déploiement Vercel dans ce plan.

---

## File Structure

- Modify: `package.json` — scripts de qualité et versions directes.
- Modify: `pnpm-lock.yaml` — résolution reproductible générée uniquement par pnpm.
- Modify: `eslint.config.mjs` — configuration ESLint Flat Config compatible Next.js.
- Modify: `sanity.config.ts`, `sanity.cli.ts`, `src/sanity/**`, `src/lib/sanity-queries.ts` — compatibilité Sanity 6 / next-sanity 13 si les contrôles l’exigent.
- Modify: `src/components/emails/contact-form-admin-email.tsx` — imports React Email 6.
- Modify: `src/components/emails/contact-form-confirmation-email.tsx` — imports React Email 6.
- Modify: `src/lib/email-service.ts` — rendu React Email 6 et client Resend 6.
- Modify: `src/lib/email-schemas.ts`, `src/lib/file-upload.ts` — compatibilité Zod 4.
- Create: `docs/audits/2026-08-01-dependency-upgrade.md` — versions finales, vulnérabilités et exceptions.

### Task 1: Restaurer les commandes de qualité

**Files:**

- Modify: `package.json`
- Modify: `pnpm-lock.yaml`
- Modify: `eslint.config.mjs`

**Interfaces:**

- Consumes: configuration FlatCompat existante et scripts pnpm actuels.
- Produces: scripts `lint`, `typecheck` et `verify` utilisables par toutes les tâches suivantes.

- [ ] **Step 1: Capturer l’échec actuel du lint**

Run: `pnpm lint`

Expected: FAIL avec `Invalid project directory provided ...\hexoprint\lint`, car Next.js 16 ne fournit plus `next lint`.

- [ ] **Step 2: Capturer l’échec de FlatCompat**

Run: `.\node_modules\.bin\eslint.cmd .`

Expected: FAIL avec `TypeError: Converting circular structure to JSON`, ce qui confirme que FlatCompat doit également être retiré.

- [ ] **Step 3: Remplacer les scripts de vérification**

Dans `package.json`, utiliser exactement :

```json
{
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build",
    "start": "next start",
    "lint": "eslint .",
    "typecheck": "tsc --noEmit",
    "typegen": "sanity typegen generate",
    "typegen:watch": "sanity typegen generate --watch",
    "seo:validate": "node scripts/validate-seo.js",
    "verify": "pnpm lint && pnpm typecheck && pnpm seo:validate && pnpm build"
  }
}
```

Conserver toutes les sections de dépendances non montrées dans cet extrait.

- [ ] **Step 4: Remplacer FlatCompat par la configuration directe**

Remplacer `eslint.config.mjs` par :

```js
import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTypeScript from 'eslint-config-next/typescript';

export default defineConfig([
  ...nextVitals,
  ...nextTypeScript,
  globalIgnores([
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
    'src/sanity/types.ts',
  ]),
]);
```

- [ ] **Step 5: Retirer la dépendance FlatCompat**

Run: `pnpm remove @eslint/eslintrc`

Expected: `@eslint/eslintrc` disparaît de `package.json` et du lockfile direct.

- [ ] **Step 6: Vérifier la nouvelle configuration ESLint**

Run: `pnpm lint`

Expected: ESLint charge la configuration sans erreur de répertoire ni structure circulaire. Les éventuelles erreurs applicatives sont corrigées dans les fichiers signalés sans désactiver `next/core-web-vitals` ou `next/typescript`, puis la commande termine avec le code 0.

- [ ] **Step 7: Exécuter le socle complet**

Run: `pnpm typecheck && pnpm seo:validate && pnpm build`

Expected: les trois commandes terminent avec le code 0.

- [ ] **Step 8: Commit**

```bash
git add package.json pnpm-lock.yaml eslint.config.mjs src
git commit -m "chore: restore project quality checks"
```

### Task 2: Mettre à jour Next, React et les versions non majeures

**Files:**

- Modify: `package.json`
- Modify: `pnpm-lock.yaml`

**Interfaces:**

- Consumes: scripts de vérification de la Task 1.
- Produces: socle Next.js 16.2.12 / React 19.2.8 et dépendances mineures ou correctives à jour.

- [ ] **Step 1: Confirmer la cohorte depuis le registre**

Run: `pnpm outdated --format json`

Expected: la sortie contient encore les paquets de cette tâche. Si une version stable plus récente existe, prendre cette version à la place de la cible auditée.

- [ ] **Step 2: Mettre à jour le socle plateforme**

Run:

```bash
pnpm up next@16.2.12 react@19.2.8 react-dom@19.2.8 eslint-config-next@16.2.12 @types/react@19.2.18 @types/react-dom@19.2.4
```

Expected: `package.json` et `pnpm-lock.yaml` sont mis à jour sans erreur de peer dependency.

- [ ] **Step 3: Mettre à jour la cohorte mineure/corrective**

Run:

```bash
pnpm up @radix-ui/react-accordion@1.2.20 @radix-ui/react-avatar@1.2.6 @radix-ui/react-hover-card@1.1.23 @radix-ui/react-navigation-menu@1.2.22 @radix-ui/react-popover@1.1.23 @radix-ui/react-slot@1.3.3 @radix-ui/react-tabs@1.1.21 @radix-ui/react-tooltip@1.2.16 @react-three/drei@10.7.7 @react-three/fiber@9.7.0 @sanity/image-url@2.1.1 @splinetool/react-spline@4.1.0 @splinetool/runtime@1.12.98 @tailwindcss/postcss@4.3.3 @tanstack/react-query@5.101.4 @tanstack/react-query-devtools@5.101.4 @types/three@0.185.3 framer-motion@12.43.0 nuqs@2.9.4 prettier@3.9.6 styled-components@6.4.4 tailwindcss@4.3.3 tailwind-merge@3.6.0 three@0.185.1 tw-animate-css@1.4.0
```

Expected: installation terminée sans paquet forcé. Ne pas mettre à jour ici les cohortes Sanity, React Email, Vercel, ESLint, TypeScript, Zod ou Lucide.

- [ ] **Step 4: Vérifier la cohorte**

Run: `pnpm verify`

Expected: PASS.

- [ ] **Step 5: Auditer la sécurité**

Run: `pnpm audit --prod`

Expected: les alertes Next.js corrigées par 16.2.12 ne sont plus présentes. Les alertes restantes doivent appartenir à une cohorte non encore migrée.

- [ ] **Step 6: Commit**

```bash
git add package.json pnpm-lock.yaml
git commit -m "chore: update platform and compatible dependencies"
```

### Task 3: Mettre à jour les dépendances Vercel

**Files:**

- Modify: `package.json`
- Modify: `pnpm-lock.yaml`

**Interfaces:**

- Consumes: routes upload existantes et composant Analytics déjà monté.
- Produces: `@vercel/analytics` 2.0.1, `@vercel/blob` 2.6.1 et `@vercel/speed-insights` 2.0.0 installés ; leur instrumentation fonctionnelle appartient au plan Analytics.

- [ ] **Step 1: Installer la cohorte Vercel**

Run:

```bash
pnpm up @vercel/analytics@2.0.1 @vercel/blob@2.6.1
pnpm add @vercel/speed-insights@2.0.0
```

Expected: installation sans peer dependency non satisfaite.

- [ ] **Step 2: Vérifier les APIs existantes**

Run: `pnpm typecheck && pnpm build`

Expected: PASS ; `<Analytics />` et `/api/upload` compilent avec les versions majeures mises à jour.

- [ ] **Step 3: Vérifier la sécurité**

Run: `pnpm audit --prod`

Expected: les avis corrigés par Analytics v2 ou Blob v2 ne sont plus présents.

- [ ] **Step 4: Commit**

```bash
git add package.json pnpm-lock.yaml src/app/api/upload/route.ts src/app/layout.tsx
git commit -m "chore: update Vercel dependencies"
```

### Task 4: Migrer l’écosystème Sanity

**Files:**

- Modify: `package.json`
- Modify: `pnpm-lock.yaml`
- Modify if required by the official migration: `sanity.config.ts`
- Modify if required by the official migration: `sanity.cli.ts`
- Modify if required by the official migration: `src/sanity/env.ts`
- Modify if required by the official migration: `src/sanity/lib/client.ts`
- Modify if required by the official migration: `src/sanity/lib/image.ts`
- Modify if required by the official migration: `src/sanity/lib/live.ts`
- Modify if required by the official migration: `src/sanity/structure.ts`
- Modify if required by the official migration: `src/sanity/schemaTypes/article.ts`
- Modify if required by the official migration: `src/sanity/schemaTypes/configuration.ts`
- Modify if required by the official migration: `src/sanity/schemaTypes/gallery.ts`
- Modify if required by the official migration: `src/sanity/schemaTypes/index.ts`
- Modify if required by the official migration: `src/lib/sanity-queries.ts`

**Interfaces:**

- Consumes: `sanityFetch<T>({ query, params, tags }): Promise<{ data: T | null }>` exposé par `src/sanity/lib/live.ts`.
- Produces: même interface applicative, avec Sanity 6.8.0, next-sanity 13.2.3, Codegen 8.0.0, Vision 6.8.0 et Portable Text 7.0.1.

- [ ] **Step 1: Capturer le contrôle Sanity avant migration**

Run: `pnpm typegen && pnpm typecheck && pnpm build`

Expected: PASS et génération des types sans modification inattendue du schéma.

- [ ] **Step 2: Installer la cohorte Sanity**

Run:

```bash
pnpm up sanity@6.8.0 next-sanity@13.2.3 @sanity/vision@6.8.0 @sanity/codegen@8.0.0 @portabletext/react@7.0.1
```

Expected: installation sans peer dependency non satisfaite. `styled-components` reste installé comme peer dependency du Studio embarqué.

- [ ] **Step 3: Préserver le contrat de lecture existant**

Dans `src/sanity/lib/live.ts`, conserver ce contrat public, même si les imports internes changent :

```ts
type SanityFetchOptions = {
  query: string;
  params?: Record<string, unknown>;
  tags?: string[];
};

type SanityFetchResult<T> = {
  data: T | null;
};

export { sanityFetch, SanityLive };
```

Ne pas activer `cacheComponents` ni une nouvelle stratégie Draft Mode dans cette migration : ce serait une évolution d’architecture distincte.

- [ ] **Step 4: Régénérer les types et vérifier le Studio**

Run: `pnpm typegen && pnpm typecheck && pnpm build`

Expected: PASS ; les routes `/studio` et les pages alimentées par Sanity sont compilées.

- [ ] **Step 5: Vérifier toute l’application et la sécurité**

Run: `pnpm verify && pnpm audit --prod`

Expected: PASS ; aucune alerte restante ne doit être corrigible uniquement par une version Sanity plus récente disponible.

- [ ] **Step 6: Commit**

```bash
git add package.json pnpm-lock.yaml sanity.config.ts sanity.cli.ts src/sanity src/lib/sanity-queries.ts
git commit -m "chore: migrate Sanity dependencies"
```

### Task 5: Migrer React Email, Resend et Zod

**Files:**

- Modify: `package.json`
- Modify: `pnpm-lock.yaml`
- Modify: `src/components/emails/contact-form-admin-email.tsx`
- Modify: `src/components/emails/contact-form-confirmation-email.tsx`
- Modify: `src/lib/email-service.ts`
- Modify: `src/lib/email-schemas.ts`
- Modify: `src/lib/file-upload.ts`
- Verify: `src/app/api/contact/route.ts`
- Verify: `src/app/api/upload/route.ts`

**Interfaces:**

- Consumes: `ContactFormSchema`, `ContactFormData`, `EmailResponseSchema` et `UploadResult` actuels.
- Produces: mêmes types métier, imports React Email unifiés depuis `react-email`, validation Zod 4 et client Resend 6.

- [ ] **Step 1: Capturer le comportement des schémas**

Run: `pnpm typecheck && pnpm build`

Expected: PASS avant migration.

- [ ] **Step 2: Remplacer les paquets React Email dépréciés**

Run:

```bash
pnpm remove @react-email/components @react-email/render
pnpm add react-email@6.9.1 resend@6.18.1 zod@4.4.3
```

Expected: `@react-email/components` et `@react-email/render` ne figurent plus dans `package.json`.

- [ ] **Step 3: Unifier les imports React Email**

Dans les deux templates et `src/lib/email-service.ts`, remplacer les imports des anciens paquets par :

```ts
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from 'react-email';
```

Importer également `render` depuis `react-email` dans `src/lib/email-service.ts` :

```ts
import { render } from 'react-email';
```

Ne conserver dans chaque fichier que les symboles réellement utilisés.

- [ ] **Step 4: Adapter uniquement les APIs Zod 4 effectivement utilisées**

Run: `rg -n "\.errors\b|\.format\(|\.flatten\(|z\.record\([^,]+\)|errorMap" src`

Expected: la route contact signale `validationResult.error.errors`. La remplacer exactement par :

```ts
const errors = validationResult.error.issues.map(
  (issue) => `${issue.path.join('.')}: ${issue.message}`
);
```

Pour toute autre correspondance, appliquer l’équivalent officiel : `z.treeifyError(error)`, `z.record(keySchema, valueSchema)` ou le paramètre `error` de Zod 4, puis refaire la recherche jusqu’à ne plus trouver d’API supprimée.

- [ ] **Step 5: Vérifier les routes e-mail et upload**

Run: `pnpm typecheck && pnpm build`

Expected: PASS ; `/api/contact` et `/api/upload` sont présentes dans la sortie du build.

- [ ] **Step 6: Vérifier toute l’application et la sécurité**

Run: `pnpm verify && pnpm audit --prod`

Expected: PASS ; aucune dépendance React Email dépréciée dans `pnpm outdated`.

- [ ] **Step 7: Commit**

```bash
git add package.json pnpm-lock.yaml src/components/emails src/lib/email-service.ts src/lib/email-schemas.ts src/lib/file-upload.ts src/app/api/contact/route.ts src/app/api/upload/route.ts
git commit -m "chore: migrate email and validation stack"
```

### Task 6: Migrer l’outillage et les majors UI restants

**Files:**

- Modify: `package.json`
- Modify: `pnpm-lock.yaml`
- Verify: `eslint.config.mjs`
- Modify: `tsconfig.json` only if TypeScript 7 rejects an existing option.
- Verify: all `src/**/*.tsx` imports from `lucide-react`.

**Interfaces:**

- Consumes: chaîne de vérification et application stables après les Tasks 1–5.
- Produces: ESLint 10.8.0, TypeScript 7.0.2, `@types/node` 26.1.2 et Lucide React 1.28.0.

- [ ] **Step 1: Installer les majors restantes**

Run:

```bash
pnpm up eslint@10.8.0 typescript@7.0.2 @types/node@26.1.2 lucide-react@1.28.0
```

Expected: installation terminée sans override.

- [ ] **Step 2: Vérifier ESLint 10 avec la configuration directe**

Run: `pnpm lint`

Expected: PASS avec `eslint.config.mjs` de la Task 1 et sans dépendance directe `@eslint/eslintrc`.

- [ ] **Step 3: Vérifier TypeScript et les icônes**

Run: `pnpm typecheck`

Expected: PASS. Une icône Lucide renommée doit être remplacée par son export public équivalent sans modifier le libellé accessible du composant.

- [ ] **Step 4: Exécuter le portail complet**

Run: `pnpm verify && pnpm audit`

Expected: PASS ; aucun avis de sécurité critique ou élevé corrigible par une dépendance directe plus récente.

- [ ] **Step 5: Commit**

```bash
git add package.json pnpm-lock.yaml eslint.config.mjs tsconfig.json src
git commit -m "chore: update lint TypeScript and UI tooling"
```

### Task 7: Prouver l’état final des dépendances

**Files:**

- Create: `docs/audits/2026-08-01-dependency-upgrade.md`

**Interfaces:**

- Consumes: manifeste et lockfile stabilisés.
- Produces: preuve lisible des versions, contrôles et éventuelles exceptions.

- [ ] **Step 1: Vérifier les dépendances directes restantes**

Run: `pnpm outdated --format json`

Expected: `{}`. Si le registre publie une nouvelle version pendant l’intervention, l’ajouter à la cohorte appropriée et refaire ses contrôles.

- [ ] **Step 2: Vérifier une installation reproductible**

Run: `pnpm install --frozen-lockfile`

Expected: PASS sans modification de `pnpm-lock.yaml`.

- [ ] **Step 3: Exécuter les preuves finales**

Run: `pnpm verify && pnpm audit --prod`

Expected: toutes les commandes applicatives passent ; toute alerte restante est transitive, non corrigeable par une version directe disponible et documentée.

- [ ] **Step 4: Rédiger le rapport de dépendances**

Créer le document avec ces sections exactes :

```markdown
# Audit des dépendances Hexoprint — 1er août 2026

## Versions directes finales
## Paquets supprimés ou remplacés
## Résultats des commandes de vérification
## Vulnérabilités résiduelles
## Exceptions documentées
```

Sous chaque section, inscrire les résultats réellement observés ; écrire `Aucune` lorsqu’une section est vide.

- [ ] **Step 5: Commit**

```bash
git add docs/audits/2026-08-01-dependency-upgrade.md
git commit -m "docs: record dependency upgrade audit"
```
