# Audit SEO et découvrabilité IA — 3 août 2026

## Synthèse

La build de production Next.js 16.2.12 a passé lint, typecheck, validations SEO, tests robots, données structurées et les 12 tests `seo:test`. Le crawl local de production a validé les 11 pages du sitemap, dont trois articles publiés.

La branche `codex/hexoprint-seo-deps-analytics` a créé une Preview Git le `2026-08-03 16:26` (Europe/Paris), sans déploiement ni promotion de production :

- Déploiement : `dpl_8KouthqQc8s4JWJ8AiQoipSPbqdk` — `Ready`, cible `Preview`
- URL : https://hexoprint-c5r8x4p5b-yann-pro.vercel.app
- Alias : https://hexoprint-git-codex-hexoprint-seo-deps-analytics-yann-pro.vercel.app

## Routes, sitemap et robots

Avec `vercel curl` après lien authentifié au projet, `/robots.txt`, `/sitemap.xml`, `/llms.txt`, `/prestations` et `/contact` répondent HTTP 200 sur la Preview.

La Preview est volontairement non indexable : `X-Robots-Tag: noindex` et `robots.txt` contient exactement `User-Agent: *` puis `Disallow: /`. Cette protection d’environnement de test ne décrit pas le comportement attendu en production.

Le sitemap porte 11 URL canoniques `https://www.hexoprint.fr`, dont trois articles publiés. `/prestations` et `/contact` portent les titres et canoniques attendus.

## Données structurées et agents IA

Les quatre tests de données structurées passent. Le crawler isole la balise ouvrante réelle de chaque script JSON-LD pour ne pas confondre les données React Server Components avec du JSON-LD.

`llms.txt` répond HTTP 200 et fournit six liens principaux avec les informations officielles du site. Il complète les mécanismes d’indexation habituels, sans garantir exploration ni citation par un agent IA.

## Preuves navigateur d’instrumentation

Sur `/prestations` dans la Preview, Vercel Analytics charge `/0d3a3ce314aae831/script.js` (`data-sdkn="@vercel/analytics/next"`, `data-sdkv="2.0.1"`). Les endpoints `event`, `session` et `view` sont présents et une requête `/0d3a3ce314aae831/view` est observée.

Speed Insights charge `/eed7881f45bf61ee/script.js` (`data-sdkn="@vercel/speed-insights/next"`, `data-sdkv="2.0.0"`, endpoint `/eed7881f45bf61ee/vitals`, route `/prestations`). Les logs filtrés des deux SDK ne signalent aucun avertissement ni erreur. Aucune requête `/vitals` n’a été observée et la métrique LCP sur 7 jours retourne `No data` : ce contrôle ne démontre donc pas une collecte Speed Insights active.

## Finding technique séparé

La console globale de la Preview contient des erreurs sans lien avec les SDK Vercel : `THREE.WebGPURenderer` / `WebGPU GPUValidationError`, avec « depth-stencil attachment size mismatch ». Elles doivent être investiguées séparément et ne sont pas masquées par la vérification Analytics.

## Résultats locaux et limites

| Contrôle | Résultat |
| --- | --- |
| `pnpm seo:test` | 12/12 réussis |
| `pnpm verify` hors build réseau | lint, typecheck et validations SEO réussis |
| `pnpm build` | réussi |
| `pnpm seo:crawl` | réussi : 11 pages |

L’indexation réelle reste à contrôler après un déploiement Production explicitement autorisé avec les outils des moteurs. Aucune activation de Speed Insights, aucun déploiement Production et aucune promotion de Preview n’ont été effectués.
