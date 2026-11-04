# Sécurité du site Hexoprint

Ce document décrit les protections en place sur le formulaire de devis (`/api/contact`) et sur le dépôt de fichiers (`/api/upload`). Il permet de les comprendre, de les vérifier et de les recréer si elles sont perdues ou modifiées. La conception complète se trouve dans `docs/superpowers/specs/2026-11-02-securite-formulaire-dependances-design.md`.

## Pourquoi

Les 26 octobre et 2 novembre 2026, deux demandes frauduleuses sont arrivées par le formulaire de devis. Le message était rédigé proprement et contenait un lien vers une page de phishing. Les protections ci-dessous répondent à trois besoins : limiter le volume de requêtes, écarter les robots et signaler les messages suspects au gérant.

## 1. Limite de débit (pare-feu Vercel)

Le pare-feu Vercel du projet `yann-pro/hexoprint` compte les requêtes `POST` vers deux routes, par adresse IP. La fenêtre est fixe et dure 600 secondes (10 minutes). Au-delà de la limite, Vercel répond `429 Too Many Requests`.

Les règles ont été publiées le 2 novembre 2026. Elles vivent dans le tableau de bord Vercel, pas dans le code : un `git push` ne les crée ni ne les modifie.

| Nom | Condition | Fenêtre | Limite | Clé | Action |
|---|---|---|---|---|---|
| `rate-limit-contact` | chemin égal à `/api/contact` et méthode `POST` | 600 s | 5 | IP | 429 Too Many Requests |
| `rate-limit-upload` | chemin égal à `/api/upload` et méthode `POST` | 600 s | 10 | IP | 429 Too Many Requests |

### Vérification du 2 novembre 2026

Requêtes vides envoyées en production :

| Route | Requêtes | Réponses |
|---|---|---|
| `/api/contact` | 6 | 400 cinq fois puis 429 |
| `/api/upload` | 11 | 400 dix fois puis 429 |

Le `400` est la réponse de l'application à une requête vide : la requête a donc franchi le pare-feu. Le `429` arrive à la sixième requête sur le formulaire et à la onzième sur l'upload.

### Recréer les règles dans le tableau de bord

1. Ouvrir le projet `yann-pro/hexoprint` sur Vercel, puis l'onglet **Firewall**, **Configure** et **New Rule**.
2. Dans **If**, choisir **Request Path** avec **Equals** et le chemin (`/api/contact` ou `/api/upload`). Ajouter **AND**, puis **Method** avec **Equals** et `POST`.
3. Dans **Then**, choisir **Rate Limit**, **Fixed Window**, **600** secondes et le nombre de requêtes (5 pour le formulaire, 10 pour l'upload). Compter **par IP** et choisir l'action **429**.
4. Cliquer sur **Save Rule**.
5. Cliquer sur **Review Changes**, puis sur **Publish**. Sans publication, la règle reste en brouillon et n'est pas appliquée.

### Recréer en ligne de commande

Prérequis : Vercel CLI installée et projet lié au dépôt (`vercel link`). À lancer dans WSL ou Git Bash.

```bash
vercel firewall rules add "rate-limit-contact" --condition '{"type":"path","op":"eq","value":"/api/contact"}' --condition '{"type":"method","op":"eq","value":"POST"}' --action rate_limit --rate-limit-window 600 --rate-limit-requests 5 --rate-limit-keys ip --yes
vercel firewall rules add "rate-limit-upload" --condition '{"type":"path","op":"eq","value":"/api/upload"}' --condition '{"type":"method","op":"eq","value":"POST"}' --action rate_limit --rate-limit-window 600 --rate-limit-requests 10 --rate-limit-keys ip --yes
vercel firewall publish --yes
```

## 2. BotID (détection des robots)

BotID est le service de détection de robots de Vercel. Le paquet `botid` (version 1.5.12) fonctionne en deux parties : une initialisation dans le navigateur, qui signe les appels vers les routes protégées, et une vérification côté serveur.

Le niveau de détection est `basic`. Il est écrit explicitement dans le client et dans chaque route. Côté serveur, il fixe le verdict et la facturation : un réglage de l'analyse approfondie dans le tableau de bord Vercel ne les modifie pas en silence. Côté client, il ne garantit rien : quand le défi renvoie `d=1` (réglage du tableau de bord), le navigateur peut charger le script d'analyse approfondie quel que soit son propre niveau. Seuls le verdict du serveur et la facturation restent fixés au niveau `basic`.

### Où se trouve la protection

| Fichier | Rôle |
|---|---|
| `src/instrumentation-client.ts` | `initBotId` déclare `POST /api/contact` et `POST /api/upload`, avec `checkLevel: 'basic'`. |
| `next.config.ts` | `withBotId(nextConfig)` ajoute les réécritures qui servent le script de défi BotID. |
| `src/app/api/contact/route.ts` | `checkBotId({ advancedOptions: { checkLevel: 'basic' } })` en première instruction du handler `POST`. |
| `src/app/api/upload/route.ts` | Même appel, en première instruction du handler `POST`. |
| `src/lib/contact-fallback-messages.ts` | Messages de repli affichés au visiteur (`403`, `429`, `413` pour un fichier trop volumineux, requête qui n'aboutit pas), avec l'e-mail et le téléphone lus dans `src/lib/company-info.ts`. |
| `src/lib/fetch-json-with-timeout.mjs` | Délai maximal des requêtes du navigateur et lecture du corps JSON sans erreur technique visible. |

### Comportement

- **Robot détecté** : réponse `403` avec `{ "error": "Accès refusé" }`. Le corps de la requête n'est pas lu, aucun mail n'est envoyé et aucune statistique n'est comptée.
- **Messages de repli** : le formulaire et le dépôt de fichiers montrent au visiteur un message avec l'e-mail et le téléphone publics du site dans trois cas. Un `403` (robot détecté), un `429` (limite de débit, il doit patienter dix minutes) et une requête qui n'aboutit pas (réseau coupé, script BotID bloqué par un bloqueur de publicité, délai dépassé : 20 secondes pour le formulaire, 60 secondes pour le dépôt de fichiers). Une réponse qui n'est pas du JSON n'affiche jamais d'erreur technique.
- **Fichier trop volumineux** : Vercel refuse par un `413` un corps de requête de plus d'environ 4,5 Mo, alors que le formulaire autorise jusqu'à 100 Mo pour un fichier 3D. Le dépôt de fichiers montre alors un message qui invite à coller un lien de partage (WeTransfer, Google Drive, Dropbox…) dans la description du projet, avec l'e-mail et le téléphone du site.
- **BotID indisponible** : la requête est acceptée si BotID ne répond pas, ou s'il répond sans verdict. Cela arrive par exemple si le jeton OIDC du projet est absent (OIDC désigne le jeton d'identité que Vercel fournit au projet pour appeler ses propres services), si l'API Vercel est en panne ou répond par une erreur (jeton refusé, `4xx`, `5xx`), ou si le site est hébergé hors de Vercel. C'est un choix volontaire, pour ne jamais perdre un devis. Le serveur écrit alors `BotID indisponible, requête acceptée` dans les logs, suivi du message de l'erreur ou de `verdict absent` quand l'API a répondu sans verdict. Cette ligne doit être surveillée : tant qu'elle apparaît, les robots ne sont pas filtrés.

Prérequis : déploiement sur Vercel, avec l'option **Secure Backend Access with OIDC Federation** du projet activée (Settings > Security, activée par défaut).

En développement local, BotID considère toujours le visiteur comme humain. Le test d'un robot se fait donc sur une preview ou en production. Les previews sont protégées par Vercel Authentication : un `curl` simple y reçoit un `401` avant même que BotID s'exécute. Sur une preview, utiliser `vercel curl <chemin> --deployment <url-de-la-preview>` (ou un lien de partage). Un `curl` simple ne convient que contre la production.

Un appel direct (`curl`, script) fait aussi écrire à `botid` la ligne `Possible misconfiguration of Vercel BotId`, au niveau `error` sur une preview et `warn` en production. Elle signale seulement que la requête n'a pas passé par le script de défi du navigateur : elle est attendue pour tout appel direct, et ce n'est pas la ligne de panne. Celle à surveiller reste `BotID indisponible, requête acceptée`.

### Vérifier

Après un déploiement en production, lancer dans WSL ou Git Bash :

```bash
for i in 1 2 3 4 5 6; do curl -s -o /dev/null -w '%{http_code}\n' -X POST https://hexoprint.fr/api/contact -H 'content-type: application/json' -d '{}'; done
```

Un appel direct (`curl`, sans navigateur) doit recevoir `403`, car BotID le classe comme robot. Les six appels ci-dessus donnent donc `403` cinq fois, puis `429` à la sixième requête (pare-feu). Aucun mail n'est envoyé.

Attention au quota : ce test consomme les 5 requêtes autorisées par 600 secondes pour l'adresse IP utilisée. Les `403` comptent aussi, le `429` final le prouve. Un test réel depuis le formulaire, depuis la même adresse IP, doit donc attendre 10 minutes après le test `curl`.

Un `400` à la place du `403` ne prouve pas à lui seul une panne. Il signifie que BotID n'a pas bloqué l'appel, et le corps `{}` est alors refusé par la validation du formulaire, sans envoi de mail. Pour trancher, consulter les logs Vercel de la fonction :

- Si la ligne `BotID indisponible, requête acceptée` est présente, BotID n'a pas répondu, ou a répondu sans verdict. Vérifier l'option **Secure Backend Access with OIDC Federation** du projet (Settings > Security).
- Sinon, BotID a classé l'appel comme humain, ce qui est anormal pour un `curl`. Vérifier la configuration BotID.

## 3. Tri des demandes

Chaque demande est triée avant l'envoi par `src/lib/contact-screening.mjs`. Le tri vérifie les liens du message. Un lien vers un hôte absent de la liste blanche de ce fichier rend la demande suspecte (raison `link_not_allowed`). Un lien placé dans le nom, la société ou le téléphone la rend suspecte aussi, même si son hôte est autorisé (raison `link_in_identity_field`). L'hôte de `BLOB_PUBLIC_BASE_URL` est toujours autorisé.

Chaque demande valide produit une ligne de log JSON, au niveau `info` si la demande est propre et `warn` si elle est suspecte. Les réponses `400`, `403` et `429` n'atteignent jamais ce log :

```json
{"event":"contact_screening","verdict":...,"reasons":[...],"linkHosts":[...]}
```

`verdict` vaut `clean` ou `suspect`. `linkHosts` ne contient que les noms d'hôtes saisis par le visiteur, jamais d'URL complète ni d'autre champ. La ligne ne contient aucune donnée personnelle : ni nom, ni adresse, ni téléphone, ni description.

### Message suspect

Un message suspect arrive au gérant avec les différences suivantes :

| Élément | Message suspect |
|---|---|
| Objet | Préfixé par `[À VÉRIFIER] `, soit `[À VÉRIFIER] Nouvelle demande de devis reçue` |
| Contenu | Un bandeau signale le caractère suspect. |
| Liens | Aucun lien cliquable. |
| Réponse | Pas de Reply-To. Pour répondre, copier l'adresse du demandeur. |
| Suite | Aucun mail de confirmation au demandeur, aucun suivi de conversion. |

## 4. Variables d'environnement liées à ces protections

Ces variables doivent exister dans le projet Vercel. Le site a aussi besoin de `RESEND_API_KEY`, `EMAIL_FROM`, `NEXT_PUBLIC_APP_URL` et `BLOB_READ_WRITE_TOKEN`, dont les valeurs ne figurent pas dans ce document.

| Variable | Valeur | Environnements | Rôle |
|---|---|---|---|
| `BLOB_PUBLIC_BASE_URL` | `https://vr7ol2pxx8jv7pat.public.blob.vercel-storage.com` | Production, Preview, Development | URL publique du store Blob `hexoprint-blob` (identifiant `store_VR7Ol2pXx8jv7pat`, en minuscules dans l'URL). |
| `EMAIL_TO` | Adresse de réception du gérant | Production | Obligatoire en Production uniquement. Sans elle, le build de Production échoue. Les previews ne l'utilisent jamais. |
| `EMAIL_TO_ADMIN` | Adresse du développeur | Preview (obligatoire), Production (facultative) | En Preview, seul destinataire des mails admin. En Production, destinataire en plus de `EMAIL_TO`. Sans elle, le build Preview échoue. |

- `BLOB_PUBLIC_BASE_URL` est obligatoire : sans elle, le build échoue. Le serveur n'accepte que les fichiers joints hébergés sur cette origine.
- `BLOB_READ_WRITE_TOKEN` doit pointer vers le même store que `BLOB_PUBLIC_BASE_URL` dans chaque environnement (Production, Preview, Development) : sinon chaque demande avec pièce jointe y reçoit un `400`, parce que le fichier est déposé dans un store dont l'origine n'est pas acceptée.
- Le site distingue son environnement grâce à `VERCEL_ENV` (`production`, `preview` ou `development`). Une preview tourne avec `NODE_ENV=production` mais reste traitée comme une preview. Hors Vercel, `NODE_ENV=production` vaut Production.
- En Preview, les mails admin partent uniquement vers `EMAIL_TO_ADMIN`, même si `EMAIL_TO` est définie dans cet environnement. Le gérant ne reçoit donc jamais les essais faits sur une preview, qui envoient de vrais mails. `EMAIL_TO_ADMIN` doit contenir l'adresse du développeur, jamais celle du gérant.
- Le build échoue si la variable requise par son environnement est absente ou vide : `EMAIL_TO` en Production, `EMAIL_TO_ADMIN` en Preview. Le message d'erreur nomme la variable et l'environnement.
- En Development, aucune des deux n'est obligatoire. Les mails partent vers l'adresse de test Resend `delivered@resend.dev`.

## Que faire si…

| Situation | Action |
|---|---|
| Une vraie demande est marquée `[À VÉRIFIER]` | Elle arrive quand même. Répondre en copiant l'adresse du demandeur, car le message n'a pas de Reply-To. |
| Un vrai client reçoit un `429` | Il voit un message qui lui demande de patienter dix minutes et lui donne l'e-mail et le téléphone du site. La limite se compte par adresse IP, et plusieurs personnes derrière la même connexion partagent le compteur. Attendre 10 minutes (600 s), puis réessayer. |
| La ligne `BotID indisponible, requête acceptée` apparaît dans les logs | BotID ne répond pas (ou répond sans verdict), et les robots passent. Vérifier que l'option **Secure Backend Access with OIDC Federation** est active dans Settings > Security du projet Vercel. |
| Un `curl` renvoie `400`, sans la ligne `BotID indisponible` | BotID a classé l'appel comme humain, alors qu'un `curl` doit être refusé. Vérifier la configuration BotID (niveau `basic`, routes déclarées, paquet `botid`). |
