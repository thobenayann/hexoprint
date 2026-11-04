# Audit de sécurité des dépendances Hexoprint, 2 novembre 2026

Mise à jour ciblée du lot 1 (correctifs urgents). Le manifeste et le lockfile ont été vérifiés avec pnpm `10.33.0` et Node.js `24.11.0` en local. Aucun `override`, aucun `resolutions` et aucun `pnpm audit --fix --force` n'ont été utilisés.

## Versions avant et après

Toutes les cibles de la cohorte étaient déjà la dernière version stable de leur majeure dans le registre (`pnpm outdated --format json`). Aucune version plus récente n'a donc remplacé une cible.

| Paquet | Avant | Après | Remarque |
|---|---|---|---|
| `next` | 16.2.12 | 16.4.4 | Version figée, comme avant |
| `eslint-config-next` | 16.2.12 | 16.4.4 | Version figée, alignée sur `next` |
| `react` | ^19.2.8 | ^19.3.1 | |
| `react-dom` | ^19.2.8 | ^19.3.1 | |
| `@types/react` | ^19.2.18 | ^19.3.0 | |
| `@types/react-dom` | ^19.2.4 | ^19.3.0 | |
| `zod` | ^4.4.3 | ^4.6.7 | Avis élevé corrigé dans la copie directe |
| `resend` | ^6.18.1 | ^6.37.0 | |
| `react-email` | ^6.9.1 | ^6.11.6 | |
| `@vercel/blob` | ^2.6.1 | ^2.8.2 | |
| `sanity` | ^6.8.0 | ^6.21.0 | |
| `@sanity/vision` | ^6.8.0 | ^6.21.0 | |
| `next-sanity` | ^13.2.3 | ^13.4.0 | |
| `@sanity/codegen` | ^8.0.0 | ^8.3.0 | Dépendance de développement |
| `@react-three/fiber` | ^9.7.0 | ^9.8.2 | Hors cohorte, voir ci-dessous |
| `@sanity/sdk` | 2.18.0 | 2.21.0 | Hors cohorte, voir ci-dessous |

Deux paquets ont été ajoutés à la cohorte, dans la même majeure :

- **`@react-three/fiber`**. La version 9.7.0 déclare `react >=19 <19.3` et `react-dom >=19 <19.3`. Avec React 19.3.1, pnpm signalait deux peer dependencies non satisfaites. La version 9.8.2 déclare `<19.4` et lève l'avertissement. `@react-three/drei` déclare `@react-three/fiber ^9.0.0` et n'a pas changé.
- **`@sanity/sdk`**. La version 2.18.0 tirait `@sanity/client` 7.26.0 et `nanoid` 3.3.16 (avis élevé 1139427, corrigé à partir de 3.3.18). La version 2.21.0 est la dernière de la majeure 2 (la 3.12.0 est une autre majeure) et supprime cet avis. Ce paquet n'est importé nulle part dans le code source, il n'est déclaré que dans `package.json`.

Les fichiers `schema.json` et `sanity.types.ts` produits par `pnpm typegen` sont ignorés par Git. Ils n'entrent donc pas dans le commit.

## Résultats de pnpm audit avant et après

`pnpm audit --prod` retourne le code 1 tant qu'il reste des avis. Ce n'est pas un échec de l'installation ni de la compilation.

Avis uniques par gravité :

| Gravité | Avant | Après la cohorte | Après `@sanity/sdk` 2.21.0 |
|---|---|---|---|
| Critique | 6 | 0 | 0 |
| Élevée | 53 | 10 | 9 |
| Modérée | 43 | 10 | 10 |
| Faible | 12 | 0 | 0 |
| **Total** | **114** | **20** | **19** |

Le récapitulatif de pnpm compte les chemins affectés, un même avis pouvant toucher plusieurs chemins. Avant : 6 critiques, 64 élevés, 57 modérés, 15 faibles (142 chemins). Après : 0 critique, 9 élevés, 10 modérés, 0 faible (19 chemins, soit un par avis).

Les 6 avis critiques de départ sont résolus : cinq sur `next` (1193676, 1193732, 1240609, 1242816, 1242859) et un sur `dompurify` (1242880). Les deux avis élevés sur `next` (1241496, 1242818) sont aussi résolus.

Vérifications exécutées après la dernière modification du lockfile :

- `pnpm typegen` : PASS (schéma extrait, 9 requêtes et 15 types de schéma générés).
- `pnpm verify` : PASS. Lint, `tsc --noEmit`, 12 tests SEO, validation SEO (7/7), 2 tests robots, 1 test Speed Insights, 4 tests de données structurées, puis `next build` avec Next.js 16.4.4 (Turbopack) et 22 pages générées. Aucune correction du code applicatif n'a été nécessaire.
- `pnpm install --frozen-lockfile` : PASS. Le SHA-256 de `pnpm-lock.yaml` est resté `4a5242d1be160c1ec1f88bb605fdecbca693b349fc17858ab8d7907a9944b141`.
- `pnpm outdated --format json` : plus aucun paquet de la cohorte n'apparaît. Les écarts restants concernent des paquets hors périmètre du lot 1, ou une autre majeure (`@sanity/sdk` 3.12.0).

## Vulnérabilités résiduelles et leur chaîne

Aucun avis critique ne subsiste. Les 19 avis restants (9 élevés, 10 modérés) sont tous transitifs, et la dernière version de chaque paquet direct concerné est déjà installée.

| Chaîne | Paquet vulnérable | Avis | Pourquoi pas de correction directe |
|---|---|---|---|
| `sanity` > `@sanity/cli` > `@vercel/frameworks` | `js-yaml` 3.13.1 | 1112714 (modéré), 1121859 (modéré), 1123912 (élevé), 1138114 (élevé), 1193726 (élevé) | `sanity` 6.21.0 est la dernière version publiée |
| `sanity` > `@sanity/cli` > `@vercel/frameworks` | `smol-toml` 1.5.2 | 1115393 (modéré), 1193945 (élevé), 1241205 (modéré) | Même chaîne que `js-yaml` |
| `sanity` > `@sanity/cli` > `@sanity/workbench-cli` > `@module-federation/vite` > `@module-federation/dts-plugin` | `undici` 7.29.1 | 1243078, 1243081, 1243481, 1243484 (modérés), 1243113, 1243473, 1243475, 1243478 (élevés) | Même cause, corrigé à partir de `undici` 7.30.1 |
| `@vercel/blob` > `@vercel/oidc` > `@vercel/cli-config` | `zod` 4.1.11 | 1243066 (élevé) | Voir les exceptions |
| `react-email` > `glob` | `glob` 13.0.6 | 1244013 (modéré) | `react-email` 6.11.6 est la dernière version publiée |
| `react-email` > `glob` > `minimatch` | `minimatch` 10.2.6 | 1244012 (modéré) | Même chaîne que `glob` |

Les corrections existent dans des versions plus récentes de ces nœuds transitifs. Elles ne sont atteignables que par une publication de `sanity`, `react-email` ou `@vercel/blob`. Aucune résolution forcée n'a été appliquée. Ces trois chaînes sont à réévaluer à chaque publication de ces paquets.

Exposition à l'exécution sur le site en production :

- **`sanity` > `@sanity/cli` (`@vercel/frameworks` et `@module-federation/dts-plugin`).** Outillage en ligne de commande, non atteignable quand le site répond aux requêtes. Dans `sanity` 6.21.0, seule l'entrée `sanity/cli` importe `@sanity/cli`, et l'application ne l'utilise que dans `sanity.cli.ts`. Le Studio de la route `/studio` charge `sanity` et `sanity/structure`, pas cette chaîne.
- **`react-email` > `glob` > `minimatch`.** Outillage également. `react-email` est bien importé à l'exécution (`render` dans `src/lib/email-service.ts`), mais `glob` n'est importé que par `dist/cli/index.mjs`, la commande de prévisualisation, et pas par l'entrée de bibliothèque.
- **`@vercel/blob` > `@vercel/oidc` > `@vercel/cli-config` > `zod` 4.1.11.** Seule chaîne chargée par une dépendance d'exécution, puisque `@vercel/blob` sert la route `/api/upload`. Dans `@vercel/cli-config` 0.3.1, `zod` ne valide que des fichiers de configuration locaux de la CLI Vercel, jamais des données de visiteur. L'exposition est donc probablement faible, sans garantie, car l'avis 1243066 n'a pas été étudié en détail.

## Exceptions documentées

- **`zod` transitif 4.1.11 via `@vercel/blob`.** L'attente du plan était « plus aucun avis sur `zod` ». La copie directe est bien en 4.6.7, et c'est elle que le code de l'application importe. Une seconde copie, en 4.1.11, subsiste dans la chaîne `@vercel/blob` > `@vercel/oidc` > `@vercel/cli-config`. `@vercel/blob` 2.8.2 est la dernière version. `@vercel/oidc` 3.8.10 fige `@vercel/cli-config` en 0.3.1, et même la 0.3.5, la plus récente, fige `zod` en 4.1.11. La majeure 4 de `@vercel/oidc` est hors de la plage `^3.6.1` demandée par `@vercel/blob`. Seul un `override` permettrait de corriger, et il est exclu par le plan. À réévaluer à la prochaine publication de `@vercel/blob` ou de `@vercel/oidc`.
- **`typescript` : peer optionnelle non satisfaite.** `@sanity/workflow-blueprint` 0.36.0, apporté par `sanity` 6.21.0 via `@sanity/cli` et `@sanity/workflow-cli`, déclare `typescript ^6.0.3 || ^7.0.0` en peer dependency optionnelle. Le manifeste conserve TypeScript 5.9.3 (exception de compatibilité de l'outillage du rapport du 1er août 2026). pnpm affiche un avertissement, sans effet sur `pnpm typegen`, `pnpm verify` ni le build. Passer à TypeScript 6.0.3 lèverait l'avertissement. C'est un changement de majeure de l'outillage, à décider dans un lot dédié après contrôle de `typescript-eslint`.
- **Moteur Node.js.** Les vérifications ont tourné sous Node.js 24.11.0, et non 22.14.0 comme au rapport précédent. Les plages de moteur des paquets mis à jour sont compatibles avec Node 22 : `sanity`, `@sanity/vision` et `@sanity/codegen` exigent `>=22.12`, comme avant la mise à jour. `next-sanity` accepte `>=20.19 <22 || >=22.12`. `react-email` passe de `>=20.0.0` à `>=20.19.0`. Le plancher réel du lockfile est toutefois plus haut : `skills` 1.7.5, tiré par `@sanity/cli`, exige `>=22.20.0`, et `@inquirer/*`, `jsdom` et `eslint-visitor-keys` exigent `^22.13`. Toute installation sous Node 22 doit donc utiliser la version 22.20.0 ou une version plus récente. Ce plancher existait déjà avant le lot, car `skills` 1.5.21 exigeait déjà `>=22.20.0`. La production n'est pas concernée, car le réglage `22.x` de Vercel prend la dernière version de Node 22.
- **Scripts de build ignorés.** pnpm signale que le script de build de `esbuild` 0.28.2 est ignoré et propose `pnpm approve-builds`. Aucun script n'a été approuvé. La compilation et le build passent sans lui.
