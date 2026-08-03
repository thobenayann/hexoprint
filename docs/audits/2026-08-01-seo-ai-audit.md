# Audit SEO et découvrabilité IA — 3 août 2026

## Synthèse

La build de production Next.js 16.2.12 a passé lint, typecheck, validations SEO, tests robots, données structurées et les 12 tests `seo:test`. Le crawl local de production a validé les 11 pages du sitemap, dont trois articles publiés.

Une Preview Vercel de la branche `codex/hexoprint-seo-deps-analytics` a ensuite été créée le `2026-08-03 16:26` (Europe/Paris), sans déploiement ni promotion de production :

- Déploiement : `dpl_8KouthqQc8s4JWJ8AiQoipSPbqdk` — `Ready`, cible `Preview`
- URL : https://hexoprint-c5r8x4p5b-yann-pro.vercel.app
- Alias de branche : https://hexoprint-git-codex-hexoprint-seo-deps-analytics-yann-pro.vercel.app

## Routes, sitemap et robots

Via `vercel curl` après un lien authentifié au projet, `/robots.txt`, `/sitemap.xml`, `/llms.txt`, `/prestations` et `/contact` répondent tous HTTP 200 sur la Preview.

La Preview est volontairement non indexable : son en-tête est `X-Robots-Tag: noindex` et son `robots.txt` est exactement composé de `User-Agent: *` puis `Disallow: /`. Cette règle protège l’environnement de test ; elle ne décrit pas le comportement attendu du domaine de production.

Le sitemap de la Preview contient 11 URL canoniques `https://www.hexoprint.fr`, dont trois articles publiés. Les pages `/prestations` et `/contact` portent les titres et canoniques attendus.

## Données structurées et agents IA

Les quatre tests de données structurées passent. Le crawler isole la balise ouvrante de chaque script JSON-LD afin d’éviter toute confusion avec les données React Server Components.

`llms.txt` répond HTTP 200 dans la Preview et expose six liens principaux, ainsi que les informations officielles du site. Il complète sitemap et métadonnées, sans garantir l’exploration ni la citation par un agent IA.

Le rendu RSC de la Preview contient aussi les composants Vercel Analytics et Speed Insights. Leur présence ne prouve pas l’activation du service ni la réception de données.

## Résultats locaux

| Contrôle | Résultat |
| --- | --- |
| `pnpm seo:test` | 12/12 réussis |
| `pnpm verify` hors build réseau | lint, typecheck et validations SEO réussis |
| `pnpm build` | réussi |
| `pnpm seo:crawl` | réussi : 11 pages |

## Limites et suite

L’indexation réelle doit être contrôlée après un déploiement de production explicitement autorisé, avec les outils des moteurs de recherche. Aucune activation de Speed Insights, aucun déploiement Production et aucune promotion de cette Preview n’ont été effectués.
