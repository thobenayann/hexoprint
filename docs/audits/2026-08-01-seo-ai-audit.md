# Audit SEO et découvrabilité IA — 1er août 2026

## Synthèse exécutive

Audit exécuté localement le 3 août 2026 sur la build de production Next.js 16.2.12, avec pnpm 10.33.0. Les contrôles statiques sont concluants : lint, typecheck, validation SEO, tests robots et données structurées, ainsi que les 10 tests `seo:test`, passent. La build de production aboutit également.

Le crawl du rendu de production local a cependant échoué : le crawler a relevé des divergences entre son analyse HTML et le HTML réellement sérialisé, ainsi que trois articles figurant dans le sitemap mais répondant 404. Cette anomalie doit être corrigée avant toute Preview Vercel.

## Routes et indexabilité

La build génère 19 routes, dont les huit pages statiques publiques, `robots.txt` et `sitemap.xml`. Le serveur `pnpm start` a répondu 200 sur `http://localhost:3000/` et a été arrêté proprement après l’audit.

Le crawl a contrôlé les huit routes statiques, puis les trois routes d’article trouvées dans le sitemap. Les trois URLs suivantes répondent 404 :

- `/blog/quand-l-impression-3d-sublime-votre-decoration-interieure`
- `/blog/reparer-au-lieu-de-jeter-l-impression-3d-au-service-des-bricoleurs-et-des-pros`
- `/blog/le-prototypage-rapide-en-impression-3d-un-atout-pour-vos-projets-industriels`

## Métadonnées et structure sémantique

Le HTML rendu contient une balise `title`, une meta description, une canonique, et exactement un H1 par route statique, conformément aux contrôles statiques. Le crawler échoue néanmoins sur la comparaison stricte : l’apostrophe du titre est encodée en entité HTML (`&#x27;`) et la canonique de l’accueil est rendue sans slash final (`https://www.hexoprint.fr`), tandis que le registre attend la forme avec slash final.

## Sitemap et robots

Le contrôle du sitemap généré donne une occurrence de `/blog`, une occurrence de `/galerie` et une occurrence de `/contact`. Il ne contient aucune date du jour inventée (`2026-08-03`) pour les pages statiques. `robots.txt` répond 200 et les tests dédiés valident ses groupes de robots et ses chemins protégés.

## Données structurées

Les quatre tests dédiés aux données structurées passent. Le crawl HTML signale néanmoins les blocs JSON-LD des routes statiques comme invalides. Le rendu contient bien deux balises `application/ld+json` sur l’accueil ; ce constat indique qu’il faut réconcilier le sérialiseur du rendu Next.js avec le parseur strict de `crawl-seo.js` avant la Preview.

## Découvrabilité par les agents IA

`llms.txt` répond 200 et ses liens canoniques sont validés par les tests. Ce fichier est complémentaire des mécanismes habituels d’indexation ; les règles explicites n’impliquent aucune garantie de citation par un agent IA.

## Résultats du crawl local

| Contrôle | Résultat |
| --- | --- |
| `pnpm seo:test` | 10/10 réussis |
| `pnpm verify` hors build réseau | lint, typecheck et validations SEO réussis |
| `pnpm build` | réussi |
| Readiness `pnpm start` | HTTP 200 |
| `robots.txt` / `llms.txt` | HTTP 200 / HTTP 200 |
| Sitemap : blog, galerie, contact | 1, 1, 1 occurrence |
| Sitemap : dates statiques du 3 août | 0 |
| `pnpm seo:crawl` | échec : comparaison HTML/JSON-LD et 3 articles 404 |

## Limites et actions après déploiement

Avant tout déploiement, corriger les routes d’article publiées dans le sitemap et rendre le crawler cohérent avec les entités HTML, la forme canonique de la racine et les blocs JSON-LD sérialisés. Relancer ensuite `pnpm seo:crawl` contre une build propre jusqu’à succès.

Après déploiement, la validation de l’indexation réelle devra être refaite : inspection des réponses publiques, contrôle du sitemap et de `robots.txt`, puis suivi dans les outils des moteurs de recherche. L’existence de règles explicites pour les agents IA ne garantit ni leur exploration, ni leur citation.
