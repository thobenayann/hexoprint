# Audit SEO et découvrabilité IA — 3 août 2026

## Synthèse

La build de production Next.js 16.2.12 a passé lint, typecheck, validations SEO, tests robots, données structurées et les 12 tests `seo:test`. Le crawl local de production a validé les 11 pages du sitemap, dont trois articles publiés.

La Preview Git `dpl_8KouthqQc8s4JWJ8AiQoipSPbqdk` a été vérifiée `Ready` le `2026-08-03 16:26` (Europe/Paris) : https://hexoprint-c5r8x4p5b-yann-pro.vercel.app. La Preview est volontairement non indexable (`X-Robots-Tag: noindex`, `User-Agent: *` puis `Disallow: /`).

## Mise en production

Le HEAD `7833d93` a été poussé atomiquement vers la branche de travail et `master`. Le push direct de `master` a contourné la règle de pull request avec l’autorisation explicite de l’utilisateur.

Le déploiement Vercel `dpl_FrDLsdXj9T36dH6mCLwHKkjiCDde` est `Ready`, cible `production`, créé le `2026-08-03 18:18:10` (Europe/Paris) : https://hexoprint-oo2zqwsg5-yann-pro.vercel.app. Les alias sont https://hexoprint-yann-pro.vercel.app et https://hexoprint-git-master-yann-pro.vercel.app.

## Validation de production

Le domaine https://www.hexoprint.fr répond HTTP 200 pour `/`, `/robots.txt`, `/sitemap.xml`, `/llms.txt` et `/contact`. Aucun `X-Robots-Tag: noindex` n’est présent en production.

`robots.txt` autorise `/` tout en protégeant `api`, `studio`, `_vercel` et `admin` pour `*`, `Googlebot`, `Bingbot`, `OAI-SearchBot`, `ChatGPT-User` et `PerplexityBot`.

Le sitemap contient 11 URL, toutes canoniques sous `https://www.hexoprint.fr`. `llms.txt` contient huit URL officielles uniques : les six liens principaux ainsi que les informations officielles associées. `/contact` porte la canonique correcte.

`vercel logs --level error --since 15m` a répondu `No logs found`. Cela établit qu’aucun log serveur d’erreur n’a été observé sur cette fenêtre, sans garantir l’absence absolue d’erreur.

## Données structurées et agents IA

Les quatre tests de données structurées passent. Le crawler isole la balise ouvrante réelle de chaque script JSON-LD pour ne pas confondre les données React Server Components avec du JSON-LD.

`llms.txt` complète sitemap et métadonnées pour les agents IA ; il ne garantit ni exploration ni citation. La vérification Analytics/Speed Insights de la Preview a confirmé le chargement des SDK, mais aucune donnée Speed Insights ni conversion n’est affirmée ici.

## Finding technique séparé

La console globale de la Preview a rapporté des erreurs indépendantes des SDK Vercel : `THREE.WebGPURenderer` / `WebGPU GPUValidationError` (« depth-stencil attachment size mismatch »). Elles doivent être investiguées séparément.

## Résultats locaux et limites

| Contrôle | Résultat |
| --- | --- |
| `pnpm seo:test` | 12/12 réussis |
| `pnpm verify` hors build réseau | lint, typecheck et validations SEO réussis |
| `pnpm build` | réussi |
| `pnpm seo:crawl` | réussi : 11 pages |

La production est désormais vérifiée pour l’accessibilité et les signaux SEO techniques. L’indexation effective reste à suivre dans les outils des moteurs de recherche. Aucune conclusion sur les événements de conversion ou les Web Vitals n’est tirée.
