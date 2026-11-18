# Mise à jour des dépendances Hexoprint, 18 novembre 2026

Mise à jour de maintenance après le lot 1 sécurité du 2 novembre. Elle part de `master` (commit `7c067cc`) et suit les mêmes règles : pnpm uniquement, aucun `override`, aucun `resolutions`, aucun `pnpm audit --fix --force`. Manifeste et lockfile vérifiés avec pnpm `10.33.0` et Node.js `24.11.0` en local.

## Versions avant et après

Toutes les cibles sont la dernière version stable de leur majeure dans le registre au 18 novembre 2026 (`pnpm outdated --format json`).

### Cohorte 1 : Next.js et paquets porteurs d'avis de sécurité

| Paquet | Avant | Après | Remarque |
|---|---|---|---|
| `next` | 16.4.4 | 16.4.6 | Version figée, comme avant |
| `eslint-config-next` | 16.4.4 | 16.4.6 | Version figée, alignée sur `next` |
| `sanity` | ^6.21.0 | ^6.24.0 | |
| `@sanity/vision` | ^6.21.0 | ^6.24.0 | |
| `next-sanity` | ^13.4.0 | ^13.5.1 | |
| `@sanity/codegen` | ^8.3.0 | ^8.3.1 | Dépendance de développement |
| `react-email` | ^6.11.6 | ^6.11.16 | |
| `resend` | ^6.37.0 | ^6.38.1 | |
| `@vercel/blob` | ^2.8.2 | ^2.9.0 | |
| `botid` | ^1.5.12 | ^1.5.13 | |

Next.js 16.4.5 (3 novembre) est une publication de sécurité : 7 avis modérés, dont un contournement du refus des SVG dans l'optimiseur d'images (GHSA-7qx7-33qx-rqx2). Les autres portent sur `use cache`, Cache Components, le runtime Edge et l'auto-hébergement, que le site n'utilise pas. Next.js 16.4.6 (9 novembre) ne contient que des correctifs : compression automatique des réponses des route handlers et corrections du ramasse-miettes de Turbopack en développement.

### Cohorte 2 : entretien dans la même majeure

| Paquet | Avant | Après |
|---|---|---|
| `@radix-ui/react-accordion` | ^1.2.20 | ^1.3.1 |
| `@radix-ui/react-avatar` | ^1.2.6 | ^1.3.1 |
| `@radix-ui/react-hover-card` | ^1.1.23 | ^1.2.1 |
| `@radix-ui/react-navigation-menu` | ^1.2.22 | ^1.4.1 |
| `@radix-ui/react-popover` | ^1.1.23 | ^1.3.1 |
| `@radix-ui/react-slot` | ^1.3.3 | ^1.5.0 |
| `@radix-ui/react-tabs` | ^1.1.21 | ^1.2.1 |
| `@radix-ui/react-tooltip` | ^1.2.16 | ^1.4.1 |
| `@react-three/drei` | ^10.7.7 | ^10.7.9 |
| `@sanity/image-url` | ^2.1.1 | ^2.2.0 |
| `@splinetool/react-spline` | ^4.1.0 | ^4.2.0 |
| `@tanstack/react-query` | ^5.101.4 | ^5.108.0 |
| `@tanstack/react-query-devtools` | ^5.101.4 | ^5.108.0 |
| `@vercel/speed-insights` | 2.0.0 | 2.1.0 |
| `lucide-react` | ^1.28.0 | ^1.75.0 |
| `nuqs` | ^2.9.4 | ^2.10.3 |
| `styled-components` | ^6.4.4 | ^6.6.0 |
| `tailwind-merge` | ^3.6.0 | ^3.7.0 |
| `tailwindcss` | ^4.3.3 | ^4.3.5 |
| `@tailwindcss/postcss` | ^4.3.3 | ^4.3.5 |
| `@types/node` | ^26.1.2 | ^26.6.6 |
| `prettier` | ^3.9.6 | ^3.10.1 |

`@vercel/speed-insights` reste en version figée. Le figeage vient de la commande `pnpm add @vercel/speed-insights@2.0.0` du plan du 1er août, pas d'un choix documenté.

### Écartés volontairement

| Paquet | Installé | Disponible | Pourquoi |
|---|---|---|---|
| `three`, `@types/three` | 0.185.x | 0.187.0 | Majeure 0 : chaque version mineure peut casser l'API. Ils animent les scènes 3D, qu'aucun test automatique ne couvre. Aucun avis de sécurité. À faire dans un lot dédié avec contrôle visuel. |
| `framer-motion` | 12.43.0 | 14.14.0 | Changement de majeure |
| `@portabletext/react` | 7.0.1 | 8.0.1 | Changement de majeure |
| `@splinetool/runtime` | 1.12.98 | 2.0.193 | Changement de majeure |
| `@sanity/sdk` | 2.21.0 | 3.14.0 | Changement de majeure, paquet importé nulle part |
| `eslint` | 9.39.2 | 10.15.0 | Changement de majeure de l'outillage |
| `typescript` | 5.9.3 | 7.0.2 | Changement de majeure de l'outillage |

## Résultats de pnpm audit avant et après

`pnpm audit --prod` retourne le code 1 tant qu'il reste des avis. Ce n'est pas un échec de l'installation ni de la compilation.

| Gravité | Avant (`master`) | Après |
|---|---|---|
| Critique | 0 | 0 |
| Élevée | 9 | 5 |
| Modérée | 12 | 5 |
| Faible | 0 | 0 |
| **Total** | **21** | **10** |

Avis résolus (11) :

- `next` : 1247486 et 1247712 (modérés), corrigés en 16.4.5.
- `undici` 7.29.1 via `sanity` > `@sanity/cli` : 1243113, 1243473, 1243475, 1243478 (élevés), 1243078, 1243081, 1243481, 1243484 (modérés). `sanity` 6.24.0 tire une version corrigée.
- `glob` 13.0.6 via `react-email` : 1244013 (modéré). `react-email` 6.11.16 tire une version corrigée.

Aucun nouvel avis n'est apparu.

## Vulnérabilités résiduelles et leur chaîne

Les 10 avis restants (5 élevés, 5 modérés) sont transitifs. Chaque paquet direct concerné est à sa dernière version, et chaque nœud intermédiaire fige la version vulnérable.

| Chaîne | Paquet vulnérable | Avis | Blocage |
|---|---|---|---|
| `sanity` > `@sanity/cli` > `@vercel/frameworks` | `js-yaml` 3.13.1 | 1112714, 1121859 (modérés), 1123912, 1138114, 1193726 (élevés) | `@sanity/cli` 8.31.0 fige `@vercel/frameworks` 3.29.0. Même la dernière, 3.35.0, fige `js-yaml` 3.13.1 |
| `sanity` > `@sanity/cli` > `@vercel/frameworks` | `smol-toml` 1.5.2 | 1115393, 1241205 (modérés), 1193945 (élevé) | Même chaîne, `@vercel/frameworks` 3.35.0 fige `smol-toml` 1.5.2 |
| `sanity` > `@sanity/cli` > `@oclif/core` | `minimatch` 10.2.6 | 1244623 (modéré) | `@sanity/cli` demande `@oclif/core` ^4.14.0, dont la dernière 4.x demande `minimatch` ^10.2.5. La correction (11.0.1) n'arrive qu'avec `@oclif/core` 5. Le chemin `react-email` > `glob` > `minimatch` est, lui, corrigé |
| `@vercel/blob` > `@vercel/oidc` > `@vercel/cli-config` | `zod` 4.1.11 | 1243066 (élevé) | `@vercel/oidc` 3.8.10, dernière 3.x, fige `@vercel/cli-config` 0.3.1. La 0.4.0, qui demande `zod` ^4.6.6, n'est atteignable que par une publication de `@vercel/oidc` |

Exposition à l'exécution : inchangée depuis le rapport du 2 novembre. Les chaînes `@sanity/cli` sont de l'outillage en ligne de commande, non chargé par le site ni par le Studio. La chaîne `@vercel/blob` est chargée par `/api/upload`, mais `zod` 4.1.11 n'y valide que des fichiers de configuration locaux de la CLI Vercel, jamais des données de visiteur.

## Exceptions documentées

- **Tailwind 4.3.4 et plus exigent le chargement d'ESM par `require()`.** `@tailwindcss/node` 4.3.4 est passé à `magic-string` 1.x, publié uniquement en module ES, alors que son build CommonJS le charge par `require()`. Cela échoue sous Node.js avant 20.19 et entre 22.0 et 22.11. Next.js a figé Tailwind 4.3.3 dans `create-next-app` pour cette raison (vercel/next.js#101061). Le projet n'est pas concerné : son plancher réel est déjà Node 22.20 (rapport du 2 novembre), et le réglage `22.x` de Vercel prend la dernière version de Node 22.
- **Scripts de build ignorés.** pnpm signale toujours que le script de build de `esbuild` 0.28.2 est ignoré. Aucun script n'a été approuvé.

## Vérifications

Exécutées après la dernière modification du lockfile :

- `pnpm typegen` : PASS (schéma extrait, 9 requêtes et 15 types de schéma générés). Les fichiers produits sont ignorés par Git.
- `pnpm verify` : PASS. Lint, `tsc --noEmit`, 12 tests SEO, validation SEO (7/7), 2 tests robots, 1 test Speed Insights, 4 tests de données structurées, 121 tests de sécurité, puis `next build` avec Next.js 16.4.6 (Turbopack) et 22 pages générées. Aucune correction du code applicatif n'a été nécessaire.
- `pnpm install --frozen-lockfile` : PASS. SHA-256 de `pnpm-lock.yaml` : `7c384a86a271a336147bc5a2fcbf14f765c75b5571f82e341e1e81ff856a2d79`.
- `pnpm outdated` : il ne reste que les paquets écartés volontairement (tableau ci-dessus).
- Contrôle manuel du build de production en local (`next start`) : accueil avec la scène Spline, blog et article, galerie avec filtres par catégorie, menu Prestations, formulaire de contact. Aucune erreur dans la console en dehors des scripts Vercel Analytics et Speed Insights, absents hors de Vercel. Le Studio se charge, mais l'origine `localhost:3100` n'étant pas déclarée dans les CORS du projet Sanity, la connexion et l'édition restent à contrôler sur la preview Vercel.

Avertissement de build préexistant, sans lien avec cette mise à jour : Next.js signale l'en-tête `Cache-Control` personnalisé sur `/_next/static/:path*` dans `next.config.ts`.
