# Audit Vercel Analytics Hexoprint — 3 août 2026

## Périmètre et référence

- Équipe : `yann-pro`
- Projet : `hexoprint`
- Domaine canonique : https://www.hexoprint.fr

L’interface Vercel Analytics affichait, sur 180 jours, environ 496 pages vues et 331 visiteurs uniques : accueil 348 vues, Google 88 vues attribuées, ChatGPT 4 vues attribuées. Ces valeurs UI arrondies restent la référence de départ.

La CLI retourne `481` pour `vercel.analytics_pageview.count` sur la fenêtre exacte `2026-02-04 14:32 UTC` → `2026-08-03 14:32 UTC`. Cette valeur ne remplace pas la référence UI : fenêtre et source de restitution différentes, et aucun décompte des visiteurs uniques. Aucun événement personnalisé ni série Speed Insights n’était disponible avant l’instrumentation.

## Instrumentation ajoutée

Le code définit un contrat fermé, sans donnée personnelle, pour `quote_cta_clicked`, `contact_link_clicked`, `contact_form_submitted` et `quote_file_upload_succeeded`. Il n’envoie ni nom, e-mail, téléphone, message libre, nom de fichier, URL Blob ni identifiant d’e-mail. Leur présence dans le code ne prouve pas encore leur réception par Vercel.

## Vérification de la Preview

La branche `codex/hexoprint-seo-deps-analytics` a déclenché une Preview Git, sans promotion ni déploiement Production :

- Déploiement : `dpl_8KouthqQc8s4JWJ8AiQoipSPbqdk`
- Cible / état : `Preview` / `Ready`
- Créée : `2026-08-03 16:26` (Europe/Paris)
- URL : https://hexoprint-c5r8x4p5b-yann-pro.vercel.app
- Alias de branche : https://hexoprint-git-codex-hexoprint-seo-deps-analytics-yann-pro.vercel.app

Après `vercel link` authentifié, `vercel curl` confirme HTTP 200 pour `/robots.txt`, `/sitemap.xml`, `/llms.txt`, `/prestations` et `/contact`. La Preview est protégée de l’indexation par `X-Robots-Tag: noindex` et son `robots.txt` correspond à `User-Agent: *` puis `Disallow: /`. Son sitemap contient 11 URL canoniques `https://www.hexoprint.fr`, dont trois articles publiés ; `llms.txt` comporte six liens principaux et les informations officielles. `/prestations` et `/contact` exposent les titres et canoniques attendus.

Sur `/prestations` dans l’alias de Preview, l’inventaire réseau navigateur apporte les preuves suivantes :

- Analytics charge `/0d3a3ce314aae831/script.js`, avec `data-sdkn="@vercel/analytics/next"` et `data-sdkv="2.0.1"` ; les endpoints `event`, `session` et `view` sont présents, et une requête `/0d3a3ce314aae831/view` a été observée.
- Speed Insights charge `/eed7881f45bf61ee/script.js`, avec `data-sdkn="@vercel/speed-insights/next"`, `data-sdkv="2.0.0"`, `data-endpoint="/eed7881f45bf61ee/vitals"` et `data-route="/prestations"`.
- Les logs filtrés Analytics et Speed Insights ne contiennent aucun avertissement ni erreur.

Une requête `/vitals` n’a pas été observée ; il ne faut donc pas conclure que la collecte Speed Insights est active. La métrique `vercel.speed_insights.lcp_ms` sur 7 jours retourne toujours `No data`.

Les événements de conversion n’ont pas été déclenchés : l’environnement de Preview peut utiliser des variables sensibles et une soumission risquerait d’envoyer des e-mails réels. La validation doit être faite avec un environnement de test explicitement conçu pour cela.

## Finding technique distinct

La console globale de `/prestations` n’est pas propre : elle rapporte des erreurs `THREE.WebGPURenderer` / `WebGPU GPUValidationError` indiquant une incompatibilité de taille de l’attachement depth-stencil (« depth-stencil attachment size mismatch »). Elles sont indépendantes de l’instrumentation Analytics et Speed Insights — dont les logs filtrés sont sans erreur — mais doivent être traitées séparément.

## Limites et suite

Aucune activation de Speed Insights, aucune promotion et aucun déploiement Production n’ont été effectués. Le fichier `.env.local` a été restauré à l’identique, sans exposer de valeur. Après activation explicite de Speed Insights et volume suffisant, comparer des fenêtres homogènes et tester les quatre événements avec des données non sensibles.
