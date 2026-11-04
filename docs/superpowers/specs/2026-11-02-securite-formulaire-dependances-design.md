# Sécurisation du site Hexoprint : formulaire de devis et dépendances

- **Date** : 2 novembre 2026
- **Statut** : proposition, à valider avant tout code
- **Base de travail** : branche `master` (commit `015d25f`, en production depuis le 3 août 2026)
- **Projet Vercel** : `yann-pro/hexoprint` (offre Pro, Node 22.x)

> La branche locale `develop` a 65 commits de retard sur `master` et aucun commit propre.
> Tout ce document décrit l'état de `master`. Le travail doit partir de `master` (ou d'un
> `develop` remis à niveau en avance rapide).

## 1. Pourquoi

### 1.1 Une campagne de phishing passe par le formulaire de devis

Deux demandes frauduleuses sont arrivées par `/api/contact`, à une semaine d'écart. Le
gérant a cliqué sur le lien de la seconde.

| | 26 octobre 2026 | 2 novembre 2026 |
|---|---|---|
| Lien | `sharez[.]online/fr/b2b/hexoprint` | `partagepro[.]online/fr/b2b/hexoprint` |
| Domaine du lien | créé le 23 octobre (LWS) | créé le 2 novembre à 01h35 (LWS), 7 h avant l'envoi |
| Adresse saisie | `@northmail[.]web[.]id` | `@prodmail[.]online` (domaine inexistant) |
| Téléphone | se termine par `82 67 32` | se termine par `82 67 32` |
| Texte | identique au mot près | identique au mot près |

La même campagne vise d'autres sites de la région avec le même schéma de lien
(signalement public : `GDGToulouse/Site-Devfest-Toulouse-2026#767`). Le message est
rédigé proprement, à la main ou par un outil qui remplit le formulaire comme un humain.
Un anti-robot seul ne l'arrêtera pas.

Sur les deux derniers mois, le formulaire a reçu 5 demandes. Les 3 vraies demandes ne
contiennent aucun lien. L'une d'elles signale un fichier STL « trop gros » pour le
formulaire : un vrai client peut donc un jour coller un lien WeTransfer ou équivalent.

### 1.2 La production tourne sur des dépendances vulnérables

Audit `pnpm audit --prod` du lockfile de `master` au 2 novembre 2026 : 6 critiques,
64 élevées, 57 modérées, 15 faibles.

| Paquet | Version en prod | Problème principal | Corrigé à partir de |
|---|---|---|---|
| `next` | 16.2.12 | 5 exécutions de code à distance (optimisation d'images AVIF et SVG, `use cache`, `next/og`, hébergement Windows), SSRF sur l'optimisation d'images, déni de service | 16.4.1 (16.3.8 pour une partie) |
| `zod` | 4.4.3 | épuisement mémoire sur collections volumineuses, utilisé par `/api/contact` | 4.6.6 |
| `dompurify` (via `sanity` 6.8.0, Studio) | transitive | contournement de nettoyage HTML (critique) | 3.4.17 |
| Divers transitifs (`undici`, `fast-uri`, `adm-zip`, `js-yaml`, `ws`, `engine.io`…) | via `sanity`, `react-email`, `next` | DoS, traversée de chemin, injection | selon paquet |

Exposition réelle de Next.js : `use cache`, `next/og` et les Server Actions ne sont pas
utilisés, et Vercel n'héberge pas sous Windows. En revanche `next.config.ts` active les
formats `avif` et `dangerouslyAllowSVG: true`, qui correspondent aux deux failles critiques
de l'optimisation d'images. La mise à jour est urgente quelle que soit l'exposition exacte.

Le plan de modernisation du 1er août a été exécuté sur `master` (Next 16.2.12, Zod 4,
React Email 6, Resend 6). Il n'est donc pas à refaire, seulement à prolonger.

## 2. Objectifs

| # | Objectif |
|---|---|
| O1 | Plus aucun lien inconnu cliquable dans le mail que reçoit le gérant |
| O2 | Le site ne peut plus servir à envoyer un contenu choisi par un tiers vers une adresse choisie par un tiers |
| O3 | Aucune vraie demande perdue : un message suspect est marqué, jamais supprimé |
| O4 | Plus aucune faille critique ou élevée corrigeable par une mise à jour directe disponible |
| O5 | Freiner les envois automatisés en masse sur `/api/contact` et `/api/upload` |
| O6 | Pouvoir enquêter la prochaine fois : une trace serveur de chaque tri, sans donnée personnelle |

### Non-objectifs

- Base de données ou écran d'administration de quarantaine. Le mail marqué fait office de quarantaine.
- Envoi direct de gros fichiers du navigateur vers le stockage (limite de 4,5 Mo des fonctions Vercel). Sujet séparé.
- Montées de version majeures sans enjeu de sécurité : `framer-motion` 14, `@portabletext/react` 8, `@splinetool/runtime` 2, ESLint 10, TypeScript 7.
- Politique CSP stricte. Le Studio Sanity, Spline et Vercel Analytics demandent un réglage dédié.
- Signalements aux registrars et aux autorités.

### Anti-objectifs (ce qui serait un échec même si tout « marche »)

- Un vrai client dont la demande n'arrive pas, ou arrive sans que le gérant puisse lui répondre.
- Un captcha visible qui fait abandonner le formulaire.
- Envoyer les données des clients à un service tiers de détection (Akismet, etc.).
- Indiquer à l'expéditeur que son message a été filtré.

## 3. Constat détaillé sur `master`

| # | Faille | Où |
|---|---|---|
| F1 | Dépendances vulnérables (section 1.2) | `package.json`, `pnpm-lock.yaml` |
| F2 | La confirmation recopie la description, le prénom et le nom saisis, et l'envoie à l'adresse saisie. Un tiers peut faire envoyer son lien piégé à n'importe qui depuis `contact@hexoprint.fr` | `src/components/emails/contact-form-confirmation-email.tsx` |
| F3 | Le mail admin affiche un bouton « Télécharger le fichier » dont l'URL vient du corps de la requête (`files[].url`), sans contrôle d'hôte | `contact-form-admin-email.tsx`, `EmailFileSchema` |
| F4 | Aucun tri des liens. Tous les messages partent avec un `Reply-To` vers l'adresse saisie | `email-service.ts` |
| F5 | Champs sans longueur maximale. `projectType`, `budget` et `deadline` acceptent n'importe quelle chaîne, et la valeur brute est réaffichée quand elle est inconnue. `files` n'a pas de maximum côté contact | `src/lib/email-schemas.ts` |
| F6 | Ni anti-robot ni limite de débit sur `/api/contact` et `/api/upload`. N'importe qui peut déposer 5 fichiers (`.zip`, `.rar`, `.7z`, `.docx`…) en accès public sur le Blob du projet | routes API |
| F7 | `compiler.removeConsole` supprime **tous** les `console.*` en production, y compris les erreurs. Aucune trace serveur exploitable aujourd'hui | `next.config.ts` |
| F8 | Pas d'en-têtes de sécurité sur les pages publiques (cadrage, référent, permissions). `dangerouslyAllowSVG: true` actif. `serverActions.bodySizeLimit` configuré alors qu'aucune Server Action n'existe | `next.config.ts` |

## 4. Conception

Quatre lots, livrés et déployés dans cet ordre, précédés d'un lot 0 conditionnel. Chaque
lot est autonome et passe `pnpm verify` puis `pnpm audit --prod` avant fusion.

### Lot 0 : secrets, seulement si des identifiants ont été saisis (avant tout le reste)

Si le gérant a saisi un identifiant ou un mot de passe sur la page de phishing :

1. Changer ce mot de passe depuis un autre appareil, activer la double authentification,
   fermer toutes les sessions ouvertes du compte.
2. Si ce compte donne accès à la boîte qui reçoit les demandes, à Vercel, à Resend ou à
   Sanity : régénérer `RESEND_API_KEY`, `BLOB_READ_WRITE_TOKEN`, `SANITY_API_READ_TOKEN` et
   `SANITY_API_WRITE_TOKEN`, les remplacer dans les variables Vercel, puis redéployer.
3. Vérifier dans Gmail qu'aucune règle de transfert ou de filtre n'a été ajoutée.

S'il a seulement ouvert la page, ce lot est sans objet.

### Lot 1 : correctifs urgents (le jour même)

**1a. Mises à jour de sécurité.** Versions les plus récentes publiées au 2 novembre 2026.
Refaire `pnpm outdated` au moment de l'exécution et prendre la dernière version stable
de la même majeure.

| Paquet | De | Vers |
|---|---|---|
| `next`, `eslint-config-next` | 16.2.12 | 16.4.4 |
| `react`, `react-dom` | 19.2.8 | 19.3.1 |
| `@types/react`, `@types/react-dom` | 19.2.x | 19.3.0 |
| `zod` | 4.4.3 | 4.6.7 |
| `resend` | 6.18.1 | 6.37.0 |
| `react-email` | 6.9.1 | 6.11.6 |
| `@vercel/blob` | 2.6.1 | 2.8.2 |
| `sanity`, `@sanity/vision` | 6.8.0 | 6.21.0 |
| `next-sanity` | 13.2.3 | 13.4.0 |
| `@sanity/codegen` | 8.0.0 | 8.3.0 |

Règles reprises du plan d'août : pnpm uniquement, pas d'`overrides` ni de `resolutions`,
pas de `pnpm audit --fix --force`. Les avis transitifs restants sont consignés dans un
nouveau rapport `docs/audits/2026-11-02-dependances-securite.md`, sur le modèle de
`docs/audits/2026-08-01-dependency-upgrade.md`.

**1b. Retirer `dangerouslyAllowSVG`.** Avant de le retirer, vérifier qu'aucune image
Sanity affichée par `next/image` n'est un SVG. S'il y en a, les afficher avec
`unoptimized` plutôt que de garder l'option globale.

**1c. Confirmation sans contenu saisi.** Le mail de confirmation ne contient plus que du
texte fixe : « Bonjour, », la date de réception, les prochaines étapes, et le libellé du
type de projet uniquement si la valeur reçue fait partie des 7 types connus (sinon la
ligne disparaît, au lieu de réafficher la valeur brute). Plus de prénom, de nom ni de
description. Ce correctif seul supprime F2.

### Lot 2 : tri des demandes et durcissement du schéma

**2a. Schéma de contact durci** (`src/lib/email-schemas.ts`)

| Champ | Règle |
|---|---|
| `firstName`, `lastName` | 2 à 60 caractères |
| `company` | 120 caractères max |
| `phone` | 30 caractères max, chiffres, espaces et `+ ( ) . -` uniquement |
| `email` | format e-mail, 254 caractères max |
| `projectType` | liste fermée : `prototypage`, `reparation`, `modelisme`, `decoration`, `piece-technique`, `petite-serie`, `autre` |
| `budget` | liste fermée : `0-50`, `50-100`, `100-200`, `200-500`, `500+`, ou absent |
| `deadline` | liste fermée : `urgent`, `1-semaine`, `2-semaines`, `1-mois`, `flexible`, ou absent |
| `description` | 4 à 5 000 caractères |
| `files` | 5 éléments max (réutiliser `MAX_UPLOAD_FILES` de `src/lib/upload-limits.mjs`) |
| `files[].url` | doit commencer par l'URL publique du store Blob du projet, lue dans une nouvelle variable d'environnement serveur `BLOB_PUBLIC_BASE_URL` |
| `files[].name` | 255 caractères max, sans `/` ni `\` (un vrai navigateur n'en produit jamais) |

Le schéma est découpé en deux :
- un schéma partagé, utilisable dans le navigateur, qui porte toutes les règles
  ci-dessus sauf le contrôle de `files[].url`. Il accepte la chaîne vide `''` envoyée
  par le formulaire pour `phone`, `company`, `budget` et `deadline`, et la traite comme
  une valeur absente
- une extension serveur, utilisée uniquement par `/api/contact`, qui ajoute le contrôle
  de `files[].url` avec `BLOB_PUBLIC_BASE_URL`

Les mêmes listes fermées alimentent le formulaire côté client, pour éviter qu'elles
divergent. Une requête qui viole le schéma reçoit la réponse 400 générique actuelle.

**2b. Module de tri** : `src/lib/contact-screening.mjs`, fonction pure testable seule.
Le format `.mjs` suit la convention de `upload-limits.mjs`, testable par `node --test`
sans compilation.

Entrée : les données validées du formulaire. Sortie :

```ts
type ScreeningResult = {
  verdict: 'clean' | 'suspect';
  reasons: Array<'link_not_allowed' | 'link_in_identity_field'>;
  linkHosts: string[]; // hôtes trouvés, sans chemin
};
```

Règles :

1. **Détection des liens** dans `description`, `firstName`, `lastName`, `company`,
   `phone` et `files[].name`. Compte comme lien :
   - une URL avec `http://` ou `https://`
   - une adresse commençant par `www.`
   - un domaine nu immédiatement suivi d'un chemin (`partagepro.online/fr/...`)

   Un domaine nu sans chemin ne compte pas pour le verdict, car le français courant et
   les noms de fichiers en produisent beaucoup (`plan.zip`, `pièce.de`, `support.stl`,
   `.zip`, `.de` et `.je` étant de vrais suffixes de domaine). Il est seulement désamorcé
   à l'affichage (2c). Une adresse e-mail (`nom@domaine.fr`) n'est pas un lien. Un nombre
   décimal (`2.5 cm`) n'est pas un lien.
2. **Liste blanche** d'hôtes, comparés par égalité exacte ou par suffixe `.<domaine>`
   après analyse avec `new URL()` :
   - le site : `hexoprint.fr`, l'hôte de `BLOB_PUBLIC_BASE_URL`
   - partage de fichiers : `wetransfer.com`, `we.tl`, `swisstransfer.com`, `transfernow.net`, `fromsmash.com`, `drive.google.com`, `dropbox.com`, `onedrive.live.com`, `1drv.ms`, `icloud.com`
   - modèles 3D : `printables.com`, `thingiverse.com`, `cults3d.com`, `myminifactory.com`, `makerworld.com`, `grabcad.com`
3. **Verdict `suspect`** si au moins une des conditions est vraie :
   - un lien hors liste blanche, dans n'importe quel champ (`link_not_allowed`)
   - un lien quelconque, même en liste blanche, dans `firstName`, `lastName`, `company` ou `phone` (`link_in_identity_field`)

La règle reste volontairement simple. Aucune vraie demande observée ne contient de lien,
donc « tout lien inconnu est suspect » produit très peu de faux positifs, et un faux
positif n'a pas de conséquence grave (voir 2c).

**2c. Effets du verdict**

| | `clean` | `suspect` |
|---|---|---|
| Mail admin : objet | `Nouvelle demande de devis reçue` | `[À VÉRIFIER] Nouvelle demande de devis reçue` |
| Mail admin : contenu | comme aujourd'hui | bandeau rouge en tête qui explique en clair pourquoi le message est marqué et rappelle de ne pas ouvrir les liens |
| Liens en liste blanche (texte et champs d'identité) | cliquables | désamorcés, non cliquables |
| Liens hors liste blanche | (aucun, par définition) | désamorcés, non cliquables : `hxxps://partagepro[.]online/fr/b2b/hexoprint` |
| Domaines nus sans chemin non autorisés (`truc.online`) | désamorcés (`truc[.]online`) pour empêcher la mise en lien automatique de Gmail | désamorcés |
| Fichiers joints (Blob du projet) | bouton « Télécharger le fichier » | nom du fichier et URL affichée en texte désamorcé, sans bouton |
| Adresse de l'expéditeur | affichée | affichée en texte, pour que le gérant puisse la copier et répondre à un vrai client classé suspect par erreur |
| `Reply-To` vers l'adresse saisie | oui | non |
| Confirmation envoyée à l'adresse saisie | oui (texte fixe, lot 1c) | non |
| Conversion analytics `contact_form_submitted` | enregistrée | non enregistrée (contrat analytics inchangé) |
| Réponse HTTP au visiteur | 200, message de succès | identique, au caractère près |
| Trace serveur | une ligne | une ligne |

Le désamorçage s'applique aussi à la version texte du mail. Le service d'envoi passe
explicitement une version `text`, générée à partir du même rendu, au lieu de laisser
Resend la déduire du HTML.

La réponse 200 ne renvoie plus `adminEmailId` ni `clientEmailId`, qui n'existent pas pour
un message suspect et trahiraient le tri. Elle ne contient plus que `success` et le
message affiché au visiteur.

La trace serveur est une ligne JSON par demande :
`{ "event": "contact_screening", "verdict", "reasons", "linkHosts" }`. Elle ne contient ni
nom, ni adresse, ni téléphone, ni description.

**2d. Logs de production.** Remplacer `removeConsole: true` en production par
`removeConsole: { exclude: ['error', 'warn', 'info'] }`. La trace de tri est écrite avec
`console.info` pour un message `clean` et `console.warn` pour un message `suspect`. Les
erreurs d'envoi restent en `console.error`. Le volume est négligeable (quelques demandes
par mois).

### Lot 3 : anti-abus sur les routes publiques

**3a. Vercel BotID**, mode Basic (inclus dans toutes les offres), sur `POST /api/contact`
et `POST /api/upload`.
- Côté client : `initBotId` avec ces deux routes, dans `src/instrumentation-client.ts`.
- Côté serveur : `checkBotId()` en première instruction de chaque route. Si `isBot`,
  réponse 403 générique, sans envoi de mail ni écriture Blob.
- BotID est invisible pour l'utilisateur. Il bloque les appels directs (curl, scripts)
  et oblige l'attaquant à passer par un vrai navigateur.

**3b. Limite de débit** par adresse IP, configurée dans le pare-feu Vercel du projet
(règle personnalisée, action « rate limit », réponse 429) :
- `POST /api/contact` : 5 requêtes par 10 minutes
- `POST /api/upload` : 10 requêtes par 10 minutes

La règle se configure dans le tableau de bord, pas dans le code. Elle est décrite dans
`docs/securite.md` pour pouvoir être recréée. Le projet n'a aujourd'hui aucune règle de
pare-feu personnalisée.

### Lot 4 : en-têtes et configuration Next

Dans `next.config.ts`, pour toutes les routes sauf `/studio/:path*` (qui garde ses en-têtes) :

| En-tête | Valeur |
|---|---|
| `X-Frame-Options` | `SAMEORIGIN` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=(), payment=()` |
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains` (sans `preload`) |
| `X-Content-Type-Options` | `nosniff` (déjà présent) |

Retirer `experimental.serverActions.bodySizeLimit`, inutile sans Server Action.

`NEXT_PUBLIC_SANITY_BROWSER_TOKEN` n'est utilisé nulle part dans le code. Vérifier dans
les variables Vercel du projet qu'il n'y est pas défini. S'il l'est, le supprimer et
révoquer le jeton côté Sanity. Le retirer aussi du `.env.example` local (ce fichier est
ignoré par git, ce retrait n'apparaîtra dans aucune pull request).

## 5. Critères d'acceptation

### Tri (tests `node --test` dans `scripts/contact-screening.test.mjs`, ajoutés à `verify`)

Les jeux de test ne contiennent aucune donnée personnelle réelle. Le texte de la campagne
peut être repris tel quel (il ne contient que la description et le lien de l'attaquant,
sans son identité). Les demandes légitimes sont des textes inventés, inspirés des trois
vraies demandes : figurine avec base de 2.5 cm, support moteur avec fichier STL joint,
demande de stage.

| Cas | Attendu |
|---|---|
| Texte de la campagne avec `https://partagepro.online/fr/b2b/hexoprint` | `suspect`, `link_not_allowed`, hôte `partagepro.online` |
| Même texte avec `sharez.online/fr/b2b/hexoprint`, sans `https://` | `suspect` |
| Les 3 demandes légitimes inventées (sans lien) | `clean` |
| Description « je vous envoie le plan.zip et le support.stl » | `clean` |
| Description « il me faut une pièce.de rechange » (faute de frappe) | `clean` |
| Fichier joint nommé `www.exemple.online` | `suspect` |
| Description avec un lien `https://we.tl/t-abc123` | `clean`, lien conservé cliquable |
| Description avec un lien `https://www.printables.com/model/123` | `clean` |
| Lien `wetransfer.com.evil.online` | `suspect` |
| Lien `https://we.tl/...` dans le prénom | `suspect`, `link_in_identity_field` |
| Description « écrivez-moi à jean@exemple.fr » | `clean` (pas un lien) |
| Description « base de 2.5 cm » | `clean` |

### Routes et mails (vérification manuelle en preview, puis en production)

- Un message suspect : le mail admin a l'objet préfixé et le bandeau. Il n'a aucun lien cliquable dans le HTML ni dans la version texte, y compris les liens en liste blanche et les fichiers joints. L'adresse de l'expéditeur reste lisible. Pas de `Reply-To`. Aucune confirmation n'est envoyée. Aucune conversion analytics n'est enregistrée.
- Un message propre : mail admin comme avant, avec `Reply-To`. Seuls les liens en liste blanche et les fichiers du Blob du projet sont cliquables. La confirmation ne contient ni nom, ni prénom, ni description.
- Une requête dont un nom de fichier contient `/` ou `\` reçoit 400.
- Les réponses HTTP d'un message suspect et d'un message propre sont identiques.
- Une requête dont `files[].url` pointe hors du store Blob du projet reçoit 400.
- Un appel `curl` direct à `/api/contact` ou `/api/upload` en production reçoit 403 (BotID).
- La 6e soumission en 10 minutes depuis la même IP reçoit 429.
- Les traces de tri apparaissent dans les logs Vercel du projet, sans donnée personnelle.

### Dépendances

- `pnpm audit --prod` : aucune faille critique ou élevée corrigeable par une mise à jour directe disponible dans la même majeure. Les avis restants sont transitifs et consignés dans le rapport d'audit.
- `pnpm verify` passe.
- Le site, la galerie, le blog et `/studio` s'affichent en preview comme avant.

## 6. Laissé au constructeur

- Le découpage interne du module de tri et l'expression exacte de détection des liens, tant que les cas du tableau passent.
- La forme visuelle du bandeau du mail admin.
- Le câblage exact de BotID selon la version installée (`botid` et sa documentation).
- La façon de partager les listes fermées entre le formulaire client et le schéma serveur.
- Le découpage en commits et en pull requests, un lot au minimum par pull request.

## 7. Choix faits par l'auteur, à vérifier à la relecture

- Marquer plutôt que supprimer les messages suspects, et ne pas leur envoyer de confirmation.
- Une seule règle de tri : tout lien hors liste blanche. Pas de liste d'adresses jetables ni d'extensions à risque, qui demanderaient de la maintenance sans changer le verdict.
- Le contenu de la liste blanche (section 2b), dont l'exclusion volontaire de `docs.google.com`, `sites.google.com` et `sharepoint.com`, très utilisés par le phishing.
- BotID en mode Basic plutôt qu'un captcha (Cloudflare Turnstile) : invisible, natif sur Vercel, aucune donnée envoyée à un tiers hors de l'hébergeur.
- Limite de débit dans le pare-feu Vercel plutôt que dans le code : rien à maintenir, pas de stockage à ajouter.
- Rejet en 400 des URL de fichiers hors du store Blob, plutôt qu'un simple marquage : un vrai navigateur ne produit jamais ce cas.
- `Strict-Transport-Security` sans `preload`, pour ne pas engager le domaine de façon quasi irréversible.
- Les majors sans enjeu de sécurité restent hors de cette spec.
- Un domaine nu sans chemin ne rend pas un message suspect. Il est seulement désamorcé à l'affichage, pour éviter les faux positifs sur `plan.zip` ou `pièce.de`.
- Dans un message suspect, tout est désamorcé, y compris les liens en liste blanche et les fichiers joints. Le gérant garde l'adresse de l'expéditeur pour répondre à la main.
- Un message suspect ne compte pas comme conversion, sans modifier le contrat analytics.
- Le lot 0 (secrets) est conditionnel. Il dépend de ce que le gérant a fait sur la page de phishing.

## 8. Suivis hors de cette spec

- Envoi direct des gros fichiers du navigateur vers Vercel Blob, pour lever la limite de 4,5 Mo qui fait échouer les STL volumineux.
- Nettoyage périodique des fichiers Blob orphelins (déposés sans demande envoyée).
- Montées de version majeures sans enjeu de sécurité (section 2, non-objectifs).
- Politique CSP, d'abord en mode `Report-Only`.
