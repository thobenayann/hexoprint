# Audit Vercel Analytics Hexoprint — 3 août 2026

## Périmètre et référence

- Équipe : `yann-pro`
- Projet : `hexoprint`
- Domaine canonique : https://www.hexoprint.fr

L’interface Vercel Analytics affichait, sur 180 jours, environ 496 pages vues et 331 visiteurs uniques : accueil 348 vues, Google 88 vues attribuées et ChatGPT 4 vues attribuées. Ces valeurs UI arrondies restent la référence de départ.

La CLI retourne `481` pour `vercel.analytics_pageview.count` sur la fenêtre exacte `2026-02-04 14:32 UTC` → `2026-08-03 14:32 UTC`. Cette valeur ne remplace pas la référence UI : fenêtre et source de restitution différentes, et aucun décompte des visiteurs uniques. Aucun événement personnalisé ni série Speed Insights n’était disponible avant l’instrumentation.

## Instrumentation ajoutée

Le code définit un contrat fermé, sans donnée personnelle, pour `quote_cta_clicked`, `contact_link_clicked`, `contact_form_submitted` et `quote_file_upload_succeeded`. Il n’envoie ni nom, e-mail, téléphone, message libre, nom de fichier, URL Blob ni identifiant d’e-mail. Leur présence dans le code ne prouve pas encore leur réception par Vercel.

## Preview vérifiée

La branche `codex/hexoprint-seo-deps-analytics` a créé la Preview `dpl_8KouthqQc8s4JWJ8AiQoipSPbqdk`, `Ready`, cible `Preview`, créée le `2026-08-03 16:26` (Europe/Paris) : https://hexoprint-c5r8x4p5b-yann-pro.vercel.app. Son alias est https://hexoprint-git-codex-hexoprint-seo-deps-analytics-yann-pro.vercel.app.

Après `vercel link` authentifié, `vercel curl` a confirmé HTTP 200 pour `/robots.txt`, `/sitemap.xml`, `/llms.txt`, `/prestations` et `/contact`. La Preview est protégée de l’indexation par `X-Robots-Tag: noindex` et `robots.txt` contient `User-Agent: *` puis `Disallow: /`.

Sur `/prestations`, l’inventaire réseau navigateur a observé :

- Analytics : `/0d3a3ce314aae831/script.js`, `data-sdkn="@vercel/analytics/next"`, `data-sdkv="2.0.1"`, endpoints `event`, `session`, `view` et une requête `/0d3a3ce314aae831/view`.
- Speed Insights : `/eed7881f45bf61ee/script.js`, `data-sdkn="@vercel/speed-insights/next"`, `data-sdkv="2.0.0"`, endpoint `/eed7881f45bf61ee/vitals`, route `/prestations`.
- Aucun avertissement ni erreur dans les logs filtrés Analytics et Speed Insights.

Une requête `/vitals` n’a pas été observée. La métrique `vercel.speed_insights.lcp_ms` sur 7 jours retourne `No data` : ces éléments ne démontrent pas une collecte Speed Insights active.

## Production vérifiée

Le HEAD `7833d93` a été poussé atomiquement vers la branche de travail et `master`. Le push direct vers `master` a contourné la règle de pull request avec l’autorisation explicite de l’utilisateur.

Vercel a produit `dpl_FrDLsdXj9T36dH6mCLwHKkjiCDde`, cible `production`, état `Ready`, créé le `2026-08-03 18:18:10` (Europe/Paris) : https://hexoprint-oo2zqwsg5-yann-pro.vercel.app. Ses alias sont https://hexoprint-yann-pro.vercel.app et https://hexoprint-git-master-yann-pro.vercel.app.

Le domaine https://www.hexoprint.fr répond HTTP 200 pour `/`, `/robots.txt`, `/sitemap.xml`, `/llms.txt` et `/contact`. Aucun en-tête `X-Robots-Tag: noindex` n’est présent en production. La validation porte sur la disponibilité et l’indexabilité, pas sur la réception d’événements de conversion ni sur des données Speed Insights.

`vercel logs --level error --since 15m` a répondu `No logs found` : aucun log serveur d’erreur n’a été observé dans cette fenêtre ; cela ne garantit pas l’absence absolue d’erreur.

Les événements de conversion n’ont pas été déclenchés : une soumission pourrait utiliser des variables sensibles et envoyer des e-mails réels. Ils doivent être validés avec un environnement de test explicitement conçu pour cela.

## Finding technique distinct

La console globale de `/prestations` sur la Preview rapportait des erreurs `THREE.WebGPURenderer` / `WebGPU GPUValidationError` (« depth-stencil attachment size mismatch »). Elles sont indépendantes des SDK Vercel, dont les logs filtrés étaient sans erreur, et doivent être traitées séparément.

## Limites et suite

Speed Insights n’est pas déclaré actif sur la seule base de l’intégration cliente ; aucune donnée LCP n’est disponible. Le fichier `.env.local` a été restauré à l’identique sans exposition de valeur. Après activation explicite de Speed Insights et volume suffisant, comparer des fenêtres homogènes et tester les quatre événements avec des données non sensibles.
