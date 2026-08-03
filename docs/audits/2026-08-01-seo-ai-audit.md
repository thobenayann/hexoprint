# Audit SEO et découvrabilité IA — 1er août 2026

## Synthèse exécutive

Audit exécuté localement le 3 août 2026 sur la build de production Next.js 16.2.12, avec pnpm 10.33.0. Les contrôles statiques sont concluants : lint, typecheck, validation SEO, tests robots et données structurées, ainsi que les 11 tests `seo:test`, passent. La build de production aboutit également.

Le crawl du rendu de production local passe pour les 11 pages du sitemap, y compris les trois articles publiés.

## Routes et indexabilité

La build génère 19 routes, dont les huit pages statiques publiques, `robots.txt` et `sitemap.xml`. Le serveur `pnpm start` a répondu 200 sur `http://localhost:3000/` et a été arrêté proprement après l’audit.

Le crawl a contrôlé les huit routes statiques, puis les trois routes d’article trouvées dans le sitemap, toutes en HTTP 200 :

- `/blog/quand-l-impression-3d-sublime-votre-decoration-interieure`
- `/blog/reparer-au-lieu-de-jeter-l-impression-3d-au-service-des-bricoleurs-et-des-pros`
- `/blog/le-prototypage-rapide-en-impression-3d-un-atout-pour-vos-projets-industriels`

## Métadonnées et structure sémantique

Le HTML rendu contient une balise `title`, une meta description, une canonique, et exactement un H1 par route statique. Le crawler décode les entités HTML, normalise la canonique d’accueil et compare le titre éditorial sans confondre le suffixe de marque généré.

## Sitemap et robots

Le contrôle du sitemap généré donne une occurrence de `/blog`, une occurrence de `/galerie` et une occurrence de `/contact`. Il ne contient aucune date du jour inventée (`2026-08-03`) pour les pages statiques. `robots.txt` répond 200 et les tests dédiés valident ses groupes de robots et ses chemins protégés.

## Données structurées

Les quatre tests dédiés aux données structurées passent. Le crawler isole la balise ouvrante réelle de chaque script JSON-LD, ce qui évite de confondre les données React Server Components avec du JSON-LD.

## Découvrabilité par les agents IA

`llms.txt` répond 200 et ses liens canoniques sont validés par les tests. Ce fichier est complémentaire des mécanismes habituels d’indexation ; les règles explicites n’impliquent aucune garantie de citation par un agent IA.

## Résultats du crawl local

| Contrôle | Résultat |
| --- | --- |
| `pnpm seo:test` | 11/11 réussis |
| `pnpm verify` hors build réseau | lint, typecheck et validations SEO réussis |
| `pnpm build` | réussi |
| Readiness `pnpm start` | HTTP 200 |
| `robots.txt` / `llms.txt` | HTTP 200 / HTTP 200 |
| Sitemap : blog, galerie, contact | 1, 1, 1 occurrence |
| Sitemap : dates statiques du 3 août | 0 |
| `pnpm seo:crawl` | réussi : 11 pages |

## Limites et actions après déploiement

Avant tout déploiement, relancer ce crawl contre l’artefact de Preview afin de vérifier l’environnement réellement exposé.

Après déploiement, la validation de l’indexation réelle devra être refaite : inspection des réponses publiques, contrôle du sitemap et de `robots.txt`, puis suivi dans les outils des moteurs de recherche. L’existence de règles explicites pour les agents IA ne garantit ni leur exploration, ni leur citation.
