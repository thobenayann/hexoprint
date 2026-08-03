# Audit Vercel Analytics Hexoprint — 1er août 2026

## Périmètre Vercel

- Équipe : `yann-pro`
- Projet : `hexoprint`
- Domaine canonique : https://www.hexoprint.fr

## Référence observée avant cette instrumentation

La référence ci-dessous est issue de Vercel Analytics sur une fenêtre de 180 jours. Les valeurs marquées « environ » sont des valeurs affichées arrondies ; elles ne doivent pas être interprétées comme une mesure exhaustive au visiteur près.

- Pages vues : environ 496
- Visiteurs uniques : environ 331
- Accueil : 348 vues, soit environ 70 % des pages vues
- Google : 88 vues attribuées, soit environ 18 % des pages vues
- ChatGPT : 4 vues attribuées

Avant cette intervention, aucun événement personnalisé n’était visible dans le projet et aucune série Speed Insights n’était disponible.

## Pages et sources principales

L’accueil concentre l’essentiel des consultations. Google est la première source identifiée dans la référence disponible. La part de trafic direct est importante : elle peut recouvrir des accès directs, des favoris, des campagnes non étiquetées ou des référents non transmis ; elle ne doit donc pas être assimilée automatiquement à une source unique. Les 4 vues attribuées à ChatGPT confirment seulement un signal de découverte faible à cette date, pas une tendance établie.

## Répartition géographique et appareils

La répartition observée fait apparaître une part américaine à valider. Avec ce volume et sans analyse par période suffisamment stable, elle peut provenir de visiteurs réels, de robots, de VPN ou d’infrastructures intermédiaires. Le volume récent étant faible, aucune conclusion opérationnelle fiable ne doit être tirée de la géographie ou des appareils sans nouvelle observation.

## Événements de conversion ajoutés localement

Le code local ajoute un contrat fermé, sans données personnelles, pour les événements suivants :

- `quote_cta_clicked` : source parmi navigation bureau, navigation mobile ou CTA de page ;
- `contact_link_clicked` : canal téléphone ou e-mail et source parmi pied de page ou page contact ;
- `contact_form_submitted` : type de client et présence ou non de fichiers, uniquement après succès de l’envoi d’e-mail ;
- `quote_file_upload_succeeded` : nombre de fichiers, uniquement après succès de l’upload.

Les événements n’envoient ni nom, adresse e-mail, téléphone, message libre, nom de fichier, URL de Blob ni identifiant d’e-mail. Leur présence dans le code ne constitue pas une preuve qu’ils sont déjà reçus ou visibles dans Vercel : cette vérification reste à faire après déploiement autorisé.

## État de Speed Insights

Le composant Speed Insights est monté localement afin que la collecte puisse fonctionner une fois le service activé dans le projet. Speed Insights n’est pas déclaré actif côté Vercel dans cet audit. L’absence de série Web Vitals avant l’intervention ne permet aucune conclusion sur les Core Web Vitals.

## Limites d’interprétation

La requête de métrique HTTP consultée pendant l’audit n’a retourné aucune série. Ce résultat ne permet pas d’affirmer qu’il n’existe aucune erreur, ni qu’aucune donnée technique n’existe ailleurs dans Vercel. Les métriques agrégées et la faible volumétrie imposent de comparer des fenêtres homogènes avant d’évaluer une évolution SEO ou de conversion.

## Vérifications après déploiement autorisé

Avant toute mutation externe, le propriétaire doit confirmer le coût éventuel de Speed Insights pour l’équipe et autoriser un déploiement Preview. Dans cette Preview uniquement, il restera à :

1. vérifier les routes publiques et les scripts Web Analytics/Speed Insights ;
2. confirmer l’état effectivement activé de Speed Insights dans le projet ;
3. générer des interactions de test sans données personnelles et contrôler que les quatre événements respectent le contrat ;
4. conserver l’URL, la date et les résultats dans ce rapport.

Aucun déploiement Preview ou Production, aucune activation de Speed Insights et aucune conclusion sur les Web Vitals ne sont inclus dans l’état présent.
