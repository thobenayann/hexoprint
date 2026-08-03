# Audit Vercel Analytics Hexoprint — 3 août 2026

## Périmètre Vercel

- Équipe : `yann-pro`
- Projet : `hexoprint`
- Domaine canonique : https://www.hexoprint.fr

## Référence initiale dans Vercel Analytics

La référence affichée dans l’interface Vercel Analytics sur 180 jours était d’environ 496 pages vues et 331 visiteurs uniques. L’accueil comptait 348 vues, Google 88 vues attribuées et ChatGPT 4 vues attribuées. Ces chiffres restent la référence UI, avec des valeurs arrondies.

La CLI a ensuite retourné `481` pour `vercel.analytics_pageview.count` sur la fenêtre exacte du `2026-02-04 14:32 UTC` au `2026-08-03 14:32 UTC`. Cette valeur ne remplace pas silencieusement la référence UI : elle provient d’une fenêtre et d’une source de restitution différentes, et ne fournit pas le nombre de visiteurs uniques.

Avant cette instrumentation, aucun événement personnalisé n’était visible et aucune série Speed Insights n’était disponible.

## Instrumentation ajoutée

Le code définit un contrat fermé, sans donnée personnelle, pour :

- `quote_cta_clicked` ;
- `contact_link_clicked` ;
- `contact_form_submitted` ;
- `quote_file_upload_succeeded`.

Les événements n’envoient ni nom, adresse e-mail, téléphone, message libre, nom de fichier, URL Blob ni identifiant d’e-mail. Leur présence dans le code ne prouve pas encore leur réception dans Vercel.

Le composant Speed Insights est monté dans l’application. La métrique `vercel.speed_insights.lcp_ms` sur les 7 derniers jours retourne `No data` : le service n’est donc pas déclaré actif et aucune conclusion Web Vitals ne peut être tirée.

## Vérification Preview du 3 août

La branche `codex/hexoprint-seo-deps-analytics` a été poussée. Son intégration Git a déclenché la Preview suivante, sans promotion ni déploiement de production :

- Déploiement : `dpl_8KouthqQc8s4JWJ8AiQoipSPbqdk`
- Cible : `Preview`
- État : `Ready`
- Créée : `2026-08-03 16:26` (Europe/Paris)
- URL de déploiement : https://hexoprint-c5r8x4p5b-yann-pro.vercel.app
- Alias de branche : https://hexoprint-git-codex-hexoprint-seo-deps-analytics-yann-pro.vercel.app

Après `vercel link` authentifié, `vercel curl` a confirmé des réponses HTTP 200 pour `/robots.txt`, `/sitemap.xml`, `/llms.txt`, `/prestations` et `/contact`.

- La Preview est correctement protégée de l’indexation avec `X-Robots-Tag: noindex` et un corps `robots.txt` correspondant à `User-Agent: *` puis `Disallow: /`.
- Le sitemap contient 11 URL canoniques `https://www.hexoprint.fr`, dont trois articles publiés.
- `llms.txt` présente six liens principaux et les informations officielles du site.
- `/prestations` et `/contact` ont les titres et canoniques attendus.
- Le HTML RSC contient les composants Analytics et Speed Insights.

Les événements de conversion n’ont pas été exercés dans cette Preview : l’environnement peut utiliser des variables sensibles et une soumission risquerait d’envoyer des e-mails réels. Cette validation reste à faire avec un environnement de test explicitement prévu à cet effet.

## Limites et suites

Cette Preview ne modifie ni la production ni l’état du service Speed Insights. Aucune activation, promotion ou conclusion sur les Core Web Vitals n’a été effectuée. Le fichier `.env.local` a été restauré à l’identique de l’original, sans exposer ses valeurs.

Après activation explicite de Speed Insights et un volume suffisant, comparer des fenêtres homogènes dans Vercel Analytics et vérifier la réception des quatre événements avec des interactions de test non sensibles.
