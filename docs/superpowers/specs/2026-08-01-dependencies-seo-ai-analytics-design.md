# Hexoprint — Conception de la mise à niveau technique et de l’optimisation SEO/IA

Date : 1er août 2026  
Statut : conception validée, implémentation non commencée

## 1. Contexte

Hexoprint est un site Next.js App Router déployé sur Vercel sous le projet `hexoprint` de l’équipe `yann-pro`, avec `https://www.hexoprint.fr` comme URL de production.

La mission couvre quatre axes liés :

1. mettre à jour toutes les dépendances directes de façon maîtrisée ;
2. corriger les défauts SEO techniques et éditoriaux détectés ;
3. rendre les contenus plus facilement découvrables et interprétables par les moteurs et agents IA ;
4. utiliser Vercel Analytics pour définir une référence mesurable et améliorer le suivi futur.

Le choix validé est une mise à jour complète et progressive, organisée en lots indépendants. Cette approche limite le rayon d’impact des migrations majeures et permet d’identifier précisément l’origine d’une éventuelle régression.

## 2. Objectifs et critères de succès

Le travail sera considéré comme terminé lorsque :

- toutes les dépendances directes auront été mises à leur dernière version stable compatible, ou qu’une exception aura été explicitement documentée avec sa justification ;
- les vulnérabilités issues des dépendances directes et transitives auront été supprimées autant que le permettent les versions stables disponibles, les éventuels reliquats étant documentés ;
- le lint, le contrôle TypeScript, le build de production et les validations SEO passeront ;
- toutes les pages indexables disposeront d’un titre, d’une description, d’une URL canonique et d’un H1 cohérents ;
- le sitemap sera complet, sans doublons et sans dates artificiellement récentes ;
- les règles d’exploration des moteurs et des agents IA seront explicites et cohérentes avec la politique actuellement permissive du site ;
- les données structurées refléteront uniquement des informations visibles et vérifiables ;
- Vercel Speed Insights et les principaux événements de conversion seront instrumentés sans données personnelles ;
- une validation locale de la version de production confirmera les routes, métadonnées, données structurées et fichiers de découverte.

## 3. Hors périmètre

Cette intervention ne comprend pas :

- une refonte visuelle ou éditoriale complète ;
- l’invention de témoignages, notes, certifications, zones d’intervention ou autres affirmations commerciales ;
- une migration de CMS, d’hébergeur ou d’outil d’analytics ;
- une décision nouvelle sur l’autorisation d’utiliser le contenu pour l’entraînement de modèles IA ;
- un déploiement en production sans autorisation explicite du propriétaire du projet.

## 4. État de référence

### 4.1 Qualité et dépendances

Au moment de l’audit :

- le projet utilise Next.js 16.1.1 et React 19.2.3 ;
- le contrôle TypeScript et le build de production passent ;
- la commande de lint ne fonctionne plus avec Next.js 16, car `next lint` a été retiré ;
- 48 dépendances directes disposent d’une version plus récente, dont 14 migrations majeures ;
- l’audit pnpm remonte des vulnérabilités transitives, notamment dans les chaînes Next.js, Sanity, React Email, Tailwind et Vercel Blob ;
- les migrations les plus sensibles concernent notamment Sanity 6, `next-sanity` 13, Portable Text 7, React Email 6, Resend 6, Zod 4, ESLint 10 et TypeScript 7.

### 4.2 SEO et découvrabilité

Les fondations sont déjà présentes : rendu serveur, robots, sitemap, canoniques, textes alternatifs et données structurées. Les principaux défauts identifiés sont :

- des titres et descriptions trop longs, parfois avec un double branding ;
- l’absence de H1 sur `/prestations` ;
- des doublons dans le sitemap pour `/blog` et `/galerie` ;
- l’absence de `/contact` dans le sitemap ;
- des dates `lastmod` artificiellement rafraîchies à chaque génération ;
- l’absence de fichier `llms.txt` ;
- des règles robots génériques mais sans déclaration explicite des agents de recherche IA ;
- l’absence d’images Open Graph et Twitter dédiées sous forme de fichiers spéciaux Next.js.

### 4.3 Analytics

La référence Vercel Analytics sur les 180 derniers jours au 1er août 2026 est d’environ :

- 496 pages vues et 331 visiteurs uniques ;
- 348 vues sur la page d’accueil, soit environ 70 % du trafic ;
- 88 vues attribuées à Google, soit environ 18 % ;
- 4 vues attribuées à ChatGPT ;
- aucun événement personnalisé de conversion ;
- aucune série Speed Insights disponible.

La part élevée de trafic direct et de trafic provenant des États-Unis sera conservée comme signal à surveiller, sans être interprétée comme une audience commerciale certaine. Les faibles volumes imposent également de traiter les variations à court terme avec prudence.

## 5. Architecture de la mise à jour des dépendances

Les dépendances seront migrées en quatre lots. Chaque lot devra être stable avant le suivant.

### Lot 1 — Socle plateforme, sécurité et correctifs non majeurs

- mettre à jour Next.js, React et React DOM vers leurs dernières versions stables compatibles ;
- appliquer les mises à jour mineures et correctives de l’outillage et des composants ;
- remplacer la commande `next lint` par une invocation ESLint compatible ;
- corriger les incompatibilités immédiates de configuration ou de types.

Ce lot traite en priorité les correctifs de sécurité du framework et restaure un contrôle qualité utilisable.

### Lot 2 — Intégrations Vercel

- migrer `@vercel/analytics` et `@vercel/blob` vers leurs versions stables actuelles ;
- ajouter `@vercel/speed-insights` et son composant d’instrumentation ;
- vérifier que les imports et APIs modifiés conservent le comportement existant.

### Lot 3 — CMS, contenu, formulaires et e-mail

- migrer Sanity, `next-sanity`, Vision, Codegen et Portable Text comme un ensemble cohérent ;
- migrer React Email et Resend ;
- migrer Zod et adapter les schémas ou erreurs de validation si nécessaire ;
- régénérer les types Sanity lorsque la chaîne de génération est stabilisée.

Ces paquets seront traités ensemble uniquement lorsqu’ils partagent des contraintes de version. Les corrections resteront isolées par sous-ensemble autant que possible.

### Lot 4 — UI et outillage restant

- migrer Lucide, ESLint, TypeScript et les autres dépendances majeures restantes ;
- appliquer les dernières mises à jour mineures et correctives devenues disponibles pendant l’intervention ;
- supprimer toute dépendance devenue inutile ou dépréciée lorsque son remplacement est fonctionnellement équivalent.

### Règles communes

Après chaque lot :

1. mettre à jour le manifeste et le lockfile avec pnpm, sans forcer des résolutions globales non justifiées ;
2. exécuter le lint, TypeScript, le validateur SEO, les tests disponibles et le build ;
3. relancer l’audit de vulnérabilités ;
4. corriger les régressions avant de poursuivre ;
5. documenter toute dépendance volontairement conservée à une version antérieure.

## 6. Conception SEO

### 6.1 Métadonnées

La génération des métadonnées sera centralisée autour d’une configuration de marque unique afin d’éviter les suffixes répétés. Les titres viseront généralement 50 à 60 caractères et les descriptions environ 140 à 160 caractères, sans couper une proposition essentielle uniquement pour respecter une limite mécanique.

Chaque page indexable aura :

- un titre distinct et descriptif ;
- une description fidèle au contenu visible ;
- une URL canonique absolue sous `https://www.hexoprint.fr` ;
- des métadonnées Open Graph et Twitter cohérentes ;
- une directive d’indexation explicite lorsque la page ne doit pas être indexée.

Des images sociales dédiées pourront être ajoutées avec les conventions de fichiers de l’App Router, en réutilisant l’identité visuelle existante.

### 6.2 Structure des pages

- ajouter un H1 visible et sémantiquement pertinent à `/prestations` ;
- conserver un seul H1 principal par page ;
- vérifier la hiérarchie H2/H3 ;
- renforcer les liens internes entre accueil, prestations, galerie, articles et contact ;
- privilégier des libellés de liens explicites ;
- garantir que les informations stratégiques restent disponibles dans le HTML rendu côté serveur.

### 6.3 Sitemap et robots

Le sitemap sera construit à partir d’une source unique par route :

- retirer les doublons `/blog` et `/galerie` ;
- ajouter `/contact` ;
- inclure toutes les pages et publications indexables ;
- exclure les espaces administratifs et techniques ;
- utiliser une date réelle de modification pour le contenu dynamique ;
- omettre `lastmod` pour les pages statiques si aucune date fiable n’existe.

Le fichier robots conservera la politique générale `Allow` existante. Les agents de recherche IA utiles seront également déclarés explicitement, notamment OAI-SearchBot, ChatGPT-User et PerplexityBot. Cette clarification ne devra pas élargir implicitement l’autorisation d’entraînement au-delà de la politique déjà en place.

### 6.4 Données structurées

Les schémas JSON-LD existants seront inventoriés et validés. Ils utiliseront des identifiants stables et des relations cohérentes entre l’organisation, le site, les pages, les articles, les services et les fils d’Ariane.

Chaque propriété devra correspondre à une information visible ou vérifiable. Les attributs commerciaux non démontrés seront supprimés ou laissés de côté.

## 7. Découvrabilité par les agents IA

L’optimisation pour les agents IA reposera d’abord sur les mêmes fondamentaux que le référencement classique : accessibilité au crawl, contenu serveur clair, entités explicites, canoniques, liens internes et données structurées exactes.

Un fichier `/llms.txt` concis sera ajouté comme index éditorial complémentaire. Il présentera :

- l’identité et l’activité d’Hexoprint ;
- les principales pages officielles ;
- les prestations et contenus de référence ;
- les coordonnées ou moyens de contact publics ;
- une indication claire que le site officiel reste la source faisant autorité.

Ce fichier ne sera pas traité comme un signal de classement garanti. Il ne remplacera ni le sitemap, ni robots.txt, ni les métadonnées, ni les données structurées.

## 8. Mesure avec Vercel Analytics

### 8.1 Performance réelle

Vercel Speed Insights sera activé afin de collecter LCP, INP, CLS, FCP et TTFB sur le trafic réel. L’absence de données actuelle empêche toute conclusion fiable sur les Core Web Vitals en production.

### 8.2 Événements de conversion

Les événements suivants seront instrumentés lorsque les actions correspondantes existent :

- clic sur une demande de devis ou un CTA de contact ;
- envoi réussi du formulaire de contact ;
- clic sur un numéro de téléphone ;
- clic sur une adresse e-mail ;
- réussite d’un éventuel envoi de fichier utile au devis.

Les événements ne contiendront aucune adresse e-mail, aucun numéro de téléphone, aucun nom, aucun message libre et aucune URL de fichier. Seuls des libellés de contexte à faible cardinalité seront utilisés, par exemple l’emplacement du CTA ou le type d’action.

### 8.3 Rapport de référence

La référence de trafic auditée sera conservée dans le compte-rendu final avec la période, les pages d’entrée principales, les sources et les limites d’interprétation. Les futures comparaisons devront employer des fenêtres équivalentes et éviter de conclure à partir de quelques visites.

## 9. Validation automatisée et manuelle

Le validateur SEO existant sera renforcé pour contrôler au minimum :

- les doublons et routes manquantes du sitemap ;
- la présence des pages publiques attendues ;
- les longueurs indicatives des titres et descriptions ;
- la présence d’un H1 ;
- les canoniques ;
- les directives robots et les agents IA attendus ;
- la présence et la cohérence minimale de `llms.txt` ;
- la validité syntaxique des principaux JSON-LD.

La vérification finale comprendra :

1. installation reproductible depuis le lockfile ;
2. lint ;
3. contrôle TypeScript ;
4. validation SEO ;
5. build de production ;
6. audit de vulnérabilités ;
7. démarrage local du build et crawl des routes publiques ;
8. inspection des réponses robots, sitemap et `llms.txt` ;
9. contrôle des métadonnées et données structurées rendues.

Un déploiement Preview pourra ensuite être proposé pour vérifier l’intégration Vercel et la collecte réelle. La production ne sera pas modifiée sans accord explicite.

## 10. Gestion des erreurs et retour arrière

- chaque lot de dépendances doit rester suffisamment petit pour être diagnostiqué isolément ;
- aucune option de contournement permanente ne sera ajoutée uniquement pour faire passer le build ;
- si une migration majeure est bloquée par une incompatibilité externe, la version stable précédente sera conservée temporairement et l’exception documentée ;
- les corrections SEO ne devront jamais supprimer une page publique ou modifier une affirmation commerciale sans justification ;
- les données Analytics ne seront pas réécrites et aucun paramétrage de production ne sera modifié pendant l’audit local.

## 11. Livrables attendus

- `package.json` et lockfile mis à jour ;
- code compatible avec les nouvelles versions ;
- lint fonctionnel ;
- métadonnées, sitemap, robots, JSON-LD et structure sémantique corrigés ;
- fichier `llms.txt` ;
- instrumentation Analytics et Speed Insights ;
- validateur SEO renforcé ;
- compte-rendu final des versions, vulnérabilités, contrôles SEO et observations Analytics ;
- liste explicite des éventuelles exceptions ou actions nécessitant un déploiement.
