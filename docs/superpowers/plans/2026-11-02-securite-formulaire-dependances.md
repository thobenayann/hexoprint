# Sécurisation du formulaire et des dépendances : plan d'implémentation

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fermer les failles critiques des dépendances, empêcher le formulaire de devis de relayer du phishing et freiner les envois automatisés, sans perdre aucune vraie demande.

**Architecture:** Toute la logique testable (listes fermées, schéma, tri, désamorçage, contenu texte du mail) vit dans des modules `.mjs` purs sous `src/lib/`, importés par les routes TypeScript comme `upload-limits.mjs` aujourd'hui, et testés par `node --test`. Les gabarits React Email et les routes ne font qu'assembler ces modules. La protection anti-robot (BotID) et la limite de débit (pare-feu Vercel) s'ajoutent devant les routes sans changer leur logique métier.

**Tech Stack:** pnpm 10, Next.js 16 App Router, React 19, Zod 4, React Email 6, Resend 6, Vercel Blob, Vercel BotID, pare-feu Vercel, `node:test`.

**Spec:** `docs/superpowers/specs/2026-11-02-securite-formulaire-dependances-design.md`

## Global Constraints

- Base de travail : `origin/master`. La branche `develop` locale est périmée, ne jamais partir d'elle.
- Une branche et une pull request vers `master` par lot : `security/lot-1-urgent`, `security/lot-2-tri`, `security/lot-3-anti-abus`, `security/lot-4-en-tetes`. Chaque lot part de `origin/master` à jour, après la fusion du lot précédent.
- pnpm uniquement. Pas d'`overrides`, pas de `resolutions`, pas de `pnpm audit --fix --force`.
- Runtime Vercel : Node 22.x. Les tests `node --test` n'importent que des `.mjs`.
- Chaque tâche se termine par `pnpm verify` vert avant son commit.
- Aucune donnée personnelle réelle dans les tests, les logs, les analytics ou les commits.
- Message de succès renvoyé au visiteur, identique pour tout verdict : `Votre demande a été envoyée avec succès. Nous vous répondrons dans les plus brefs délais.`
- Objet du mail admin : `Nouvelle demande de devis reçue`. Préfixe pour un message suspect : `[À VÉRIFIER] ` (avec l'espace final).
- Liste blanche exacte : `hexoprint.fr`, `wetransfer.com`, `we.tl`, `swisstransfer.com`, `transfernow.net`, `fromsmash.com`, `drive.google.com`, `dropbox.com`, `onedrive.live.com`, `1drv.ms`, `icloud.com`, `printables.com`, `thingiverse.com`, `cults3d.com`, `myminifactory.com`, `makerworld.com`, `grabcad.com`, plus l'hôte de `BLOB_PUBLIC_BASE_URL`.
- Valeur de `BLOB_PUBLIC_BASE_URL` en production : `https://vr7ol2pxx8jv7pat.public.blob.vercel-storage.com`.
- Avant tout test d'envoi en preview : vérifier que les variables Preview `EMAIL_TO` et `EMAIL_TO_ADMIN` ne contiennent pas l'adresse du gérant (`hexoprint3d@gmail.com`). Les previews tournent en `NODE_ENV=production` et envoient de vrais mails.

## Review Focus

- Hôtes en majuscules ou en caractères visuellement trompeurs (`HTTPS://WE.TL/...` accepté, `wеtransfer.com` avec un « е » cyrillique refusé). Tests ajoutés en Task 5.
- Liens collés dans de la ponctuation française (`(voir https://we.tl/t-abc).`) : le lien ne doit pas embarquer `).`. Tests en Task 5 et Task 6.
- Astuce d'identifiant dans l'URL (`https://we.tl@partagepro.online/x`) : l'hôte réel est `partagepro.online`. Test en Task 5.
- Description de 5 000 caractères construite pour faire ramer les expressions régulières : le tri doit rester instantané. Test en Task 5.
- Liens enveloppés en Markdown ou en HTML (`[dossier](https://partagepro.online/x)`) : détectés, jamais rendus cliquables. Tests en Task 5 et Task 6.

---

## Préalables (avant la Task 1)

- [ ] **Lot 0, si et seulement si le gérant a saisi un identifiant sur la page de phishing** : appliquer la section « Lot 0 » de la spec (changement de mot de passe, double authentification, régénération de `RESEND_API_KEY`, `BLOB_READ_WRITE_TOKEN`, `SANITY_API_READ_TOKEN`, `SANITY_API_WRITE_TOKEN`, redéploiement, contrôle des règles Gmail). Sinon, passer.
- [ ] **Créer la branche du lot 1**

```bash
git fetch origin
git switch -c security/lot-1-urgent origin/master
pnpm install --frozen-lockfile
```

- [ ] **Committer la spec et ce plan sur la branche** (ils existent en fichiers non suivis dans la copie de travail)

```bash
git add docs/superpowers/specs/2026-11-02-securite-formulaire-dependances-design.md docs/superpowers/plans/2026-11-02-securite-formulaire-dependances.md
git commit -m "docs: spec et plan de sécurisation du formulaire et des dépendances"
```

---

## Lot 1 : correctifs urgents

### Task 1: Mettre à jour les dépendances vulnérables

**Files:**
- Modify: `package.json`, `pnpm-lock.yaml`
- Modify if `pnpm typegen` regenerates them: `src/sanity/types.ts`, `schema.json`
- Create: `docs/audits/2026-11-02-dependances-securite.md`

**Interfaces:**
- Consumes: rien.
- Produces: `zod` ≥ 4.6.6 et `next` ≥ 16.4.1 pour toutes les tâches suivantes.

- [ ] **Step 1: Mesurer l'état de départ**

Run: `pnpm audit --prod`
Expected: 6 critiques, dont 5 sur `next` et 1 sur `dompurify`. Noter les totaux pour le rapport.

- [ ] **Step 2: Confirmer les cibles dans le registre**

Run: `pnpm outdated --format json`
Expected: les paquets de l'étape 3 apparaissent. Si une version stable plus récente existe dans la même majeure, la prendre à la place.

- [ ] **Step 3: Installer la cohorte**

```bash
pnpm up next@16.4.4 eslint-config-next@16.4.4 react@19.3.1 react-dom@19.3.1 @types/react@19.3.0 @types/react-dom@19.3.0 zod@4.6.7 resend@6.37.0 react-email@6.11.6 @vercel/blob@2.8.2 sanity@6.21.0 @sanity/vision@6.21.0 next-sanity@13.4.0 @sanity/codegen@8.3.0
```

Expected: installation sans peer dependency non satisfaite.

- [ ] **Step 4: Régénérer les types Sanity et vérifier**

Run: `pnpm typegen && pnpm verify`
Expected: PASS. Corriger dans le code applicatif toute rupture signalée, sans désactiver de règle.

- [ ] **Step 5: Auditer**

Run: `pnpm audit --prod`
Expected: plus aucun avis sur `next`, `zod` ni `dompurify` critique. Chaque avis critique ou élevé restant est transitif et sans mise à jour directe disponible dans la même majeure.

- [ ] **Step 6: Écrire le rapport** `docs/audits/2026-11-02-dependances-securite.md` avec exactement ces sections, remplies avec les résultats observés (`Aucune` si vide) :

```markdown
# Audit de sécurité des dépendances Hexoprint, 2 novembre 2026

## Versions avant et après
## Résultats de pnpm audit avant et après
## Vulnérabilités résiduelles et leur chaîne
## Exceptions documentées
```

- [ ] **Step 7: Commit**

Ajouter aussi les fichiers modifiés par `pnpm typegen`, s'il y en a (voir `git status`).

```bash
git add package.json pnpm-lock.yaml docs/audits/2026-11-02-dependances-securite.md
git commit -m "chore(security): update vulnerable dependencies"
```

### Task 2: Retirer SVG de l'optimiseur d'images et créer la suite de tests sécurité

**Files:**
- Create: `scripts/security-config.test.mjs`
- Modify: `package.json` (scripts), `next.config.ts:28`

**Interfaces:**
- Produces: script `test:security`, inclus dans `verify`. Chaque tâche suivante y ajoute son fichier de test.

- [ ] **Step 1: Écrire le test**

```js
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const source = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

test('the image optimizer no longer accepts SVG', async () => {
  assert.doesNotMatch(await source('next.config.ts'), /dangerouslyAllowSVG/);
});
```

- [ ] **Step 2: Brancher la suite**

Dans `package.json`, ajouter `"test:security": "node --test scripts/analytics-server-conversions.test.mjs scripts/security-config.test.mjs"` et insérer `pnpm test:security` dans `verify` juste avant `pnpm build`.

- [ ] **Step 3: Vérifier l'échec**

Run: `pnpm test:security`
Expected: FAIL sur `the image optimizer no longer accepts SVG`.

- [ ] **Step 4: Vérifier qu'aucune image Sanity n'est un SVG**

Dans `/studio` (outil Vision) ou via `pnpm exec sanity documents query`, exécuter :
`*[_type == "sanity.imageAsset" && extension == "svg"]{_id, originalFilename}`
Expected: `[]`. Si la liste n'est pas vide, repérer les composants `next/image` qui affichent ces images et leur passer `unoptimized` quand `src` se termine par `.svg`.

- [ ] **Step 5: Retirer `dangerouslyAllowSVG: true`** de `next.config.ts`. Garder `contentSecurityPolicy`.

- [ ] **Step 6: Vérifier**

Run: `pnpm verify`
Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add package.json next.config.ts scripts/security-config.test.mjs
git commit -m "fix(security): stop optimizing SVG images"
```

### Task 3: Confirmation sans contenu saisi

**Files:**
- Create: `src/lib/contact-options.mjs`, `scripts/contact-options.test.mjs`, `scripts/contact-email-templates.test.mjs`
- Modify: `src/components/emails/contact-form-confirmation-email.tsx`, `package.json` (`test:security`)

**Interfaces:**
- Produces, dans `src/lib/contact-options.mjs` :
  - `PROJECT_TYPES`, `BUDGETS`, `DEADLINES` : `ReadonlyArray<{ value: string; label: string }>`
  - `getOptionLabel(options, value: unknown): string | null` (libellé si `value` est une valeur connue, sinon `null`)

- [ ] **Step 1: Écrire les tests**

`scripts/contact-options.test.mjs` :

```js
test('closed lists match the form values', () => {
  assert.deepEqual(PROJECT_TYPES.map((o) => o.value), ['prototypage', 'reparation', 'modelisme', 'decoration', 'piece-technique', 'petite-serie', 'autre']);
  assert.deepEqual(BUDGETS.map((o) => o.value), ['0-50', '50-100', '100-200', '200-500', '500+']);
  assert.deepEqual(DEADLINES.map((o) => o.value), ['urgent', '1-semaine', '2-semaines', '1-mois', 'flexible']);
});

test('labels are returned only for known values', () => {
  assert.equal(getOptionLabel(PROJECT_TYPES, 'reparation'), 'Réparation de pièce');
  assert.equal(getOptionLabel(PROJECT_TYPES, 'https://partagepro.online/x'), null);
  assert.equal(getOptionLabel(BUDGETS, undefined), null);
});
```

`scripts/contact-email-templates.test.mjs` (même helper `source` que la Task 2) :

```js
test('the confirmation email never echoes visitor input', async () => {
  const tpl = await source('src/components/emails/contact-form-confirmation-email.tsx');
  assert.doesNotMatch(tpl, /firstName|lastName|description/);
  assert.match(tpl, /getOptionLabel\(PROJECT_TYPES, /);
  assert.match(tpl, /Bonjour,/);
});
```

- [ ] **Step 2: Ajouter les deux fichiers à `test:security` et vérifier l'échec**

Run: `pnpm test:security`
Expected: FAIL (module `contact-options.mjs` introuvable, gabarit encore personnalisé).

- [ ] **Step 3: Créer `src/lib/contact-options.mjs`.** Libellés des projets : ceux de `getProjectTypeLabel` actuel (`Prototypage rapide`, `Réparation de pièce`, `Modélisme`, `Objet décoratif`, `Pièce technique sur-mesure`, `Petite série`, `Autre projet`). Libellés des budgets et délais : ceux de `getBudgetLabel` et `getDeadlineLabel` dans `contact-form-admin-email.tsx`.

- [ ] **Step 4: Modifier le gabarit de confirmation.** Salutation `Bonjour,`. Supprimer prénom, nom et le bloc description. Afficher la ligne « Type de projet » seulement si `getOptionLabel(PROJECT_TYPES, projectType)` n'est pas `null`. Supprimer la fonction locale `getProjectTypeLabel`. La date et les prochaines étapes restent.

- [ ] **Step 5: Vérifier**

Run: `pnpm verify`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/lib/contact-options.mjs src/components/emails/contact-form-confirmation-email.tsx scripts/contact-options.test.mjs scripts/contact-email-templates.test.mjs package.json
git commit -m "fix(security): stop echoing visitor input in confirmation emails"
```

### Livraison du lot 1

- [ ] Pousser `security/lot-1-urgent`, ouvrir la PR vers `master` : « Lot 1 sécurité : dépendances vulnérables et confirmation neutre ».
- [ ] Sur la preview Vercel : accueil, galerie, blog, `/studio`, et une demande de test (après le contrôle des variables Preview, voir Global Constraints). La confirmation reçue ne contient ni nom ni description.
- [ ] Fusionner, puis vérifier la production : site en ligne, une demande de test bout en bout.

---

## Lot 2 : tri des demandes

Branche : `git fetch origin && git switch -c security/lot-2-tri origin/master`.

### Task 4: Schéma durci, listes fermées partagées

**Files:**
- Create: `src/lib/contact-schema.mjs`, `scripts/contact-schema.test.mjs`
- Modify: `src/lib/email-schemas.ts`, `src/lib/email-config.ts`, `src/types/env.d.ts`, `src/components/sections/ContactForm.tsx`, `src/app/api/contact/route.ts`, `package.json` (`test:security`)

**Interfaces:**
- Consumes: `PROJECT_TYPES`, `BUDGETS`, `DEADLINES` (Task 3).
- Produces, dans `src/lib/contact-schema.mjs` :
  - `CONTACT_LIMITS = { nameMax: 60, companyMax: 120, phoneMax: 30, emailMax: 254, descriptionMin: 4, descriptionMax: 5000, fileNameMax: 255, filesMax: MAX_UPLOAD_FILES }`
  - `ContactFormSchema` : schéma Zod utilisable dans le navigateur (toutes les règles de la spec 2a sauf l'hôte de `files[].url`)
  - `createContactSubmissionSchema(blobPublicBaseUrl: string)` : même schéma, plus `files[].url` qui doit commencer par `${blobPublicBaseUrl}/`
- Produces, dans `src/lib/email-schemas.ts` : réexport des deux schémas, `type ContactFormData = z.output<typeof ContactFormSchema>`, `type ContactFormDraft` (état du formulaire : tous les champs texte en `string`, `type` en union, `files` en tableau de fichiers).
- Produces, dans `email-config.ts` : `emailConfig.BLOB_PUBLIC_BASE_URL: string` (URL obligatoire, valeur de test `https://test.public.blob.vercel-storage.com`).

- [ ] **Step 1: Écrire les tests** dans `scripts/contact-schema.test.mjs`, avec une fixture `draft()` valide (particulier, `phone: ''`, `company: ''`, `budget: ''`, `deadline: ''`, `projectType: 'modelisme'`, un fichier `{ name: 'figurine.stl', size: 1000, type: 'model/stl', url: 'https://store.public.blob.vercel-storage.com/figurine.stl' }`).

```js
test('empty optional fields are accepted and dropped', () => {
  const r = ContactFormSchema.safeParse(draft());
  assert.ok(r.success);
  assert.equal(r.data.phone, undefined);
  assert.equal(r.data.budget, undefined);
});

test('limits and closed lists are enforced', () => {
  for (const patch of [
    { firstName: 'a'.repeat(61) }, { company: 'a'.repeat(121) }, { phone: 'abc' }, { phone: '1'.repeat(31) },
    { description: 'a'.repeat(5001) }, { projectType: 'https://x.online/a' }, { budget: 'x' }, { deadline: 'x' },
    { files: Array.from({ length: 6 }, () => draft().files[0]) },
    { files: [{ ...draft().files[0], name: 'a/b.stl' }] }, { files: [{ ...draft().files[0], name: 'a\\b.stl' }] },
    { type: 'professionnel', company: '' },
  ]) assert.equal(ContactFormSchema.safeParse({ ...draft(), ...patch }).success, false, JSON.stringify(patch));
});

test('server schema only accepts files from the project Blob store', () => {
  const schema = createContactSubmissionSchema('https://store.public.blob.vercel-storage.com');
  const withUrl = (url) => ({ ...draft(), files: [{ ...draft().files[0], url }] });
  assert.ok(schema.safeParse(draft()).success);
  assert.equal(schema.safeParse(withUrl('https://evil.example/a.stl')).success, false);
  assert.equal(schema.safeParse(withUrl('https://store.public.blob.vercel-storage.com.evil.online/a.stl')).success, false);
});
```

- [ ] **Step 2: Ajouter le fichier à `test:security` et vérifier l'échec**

Run: `pnpm test:security`
Expected: FAIL (module introuvable).

- [ ] **Step 3: Implémenter `src/lib/contact-schema.mjs`.** Construire un objet Zod commun sans raffinement, puis appliquer la même règle « entreprise obligatoire pour un professionnel » (message existant) sur le schéma client et sur le schéma serveur. Ne pas appeler `.extend()` sur un schéma déjà raffiné. Téléphone : `/^[0-9+().\s-]*$/`. Les champs optionnels acceptent `''` et le transforment en `undefined`. Messages d'erreur en français, sur le modèle des messages existants.

- [ ] **Step 4: Brancher le reste**
  - `email-schemas.ts` réexporte depuis `./contact-schema.mjs` et déclare `ContactFormData` et `ContactFormDraft`.
  - `ContactForm.tsx` : `useState<ContactFormDraft>`, options des trois listes générées depuis `PROJECT_TYPES`, `BUDGETS`, `DEADLINES` (les options vides existantes restent en tête).
  - `route.ts` : valider avec un schéma créé une fois au niveau du module par `createContactSubmissionSchema(emailConfig.BLOB_PUBLIC_BASE_URL)`.
  - `email-config.ts` et `env.d.ts` : nouvelle variable `BLOB_PUBLIC_BASE_URL`.

- [ ] **Step 5: Déclarer la variable** dans Vercel (Production, Preview, Development) avec la valeur des Global Constraints, et dans le `.env.local` de développement.

- [ ] **Step 6: Vérifier**

Run: `pnpm verify`
Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add src/lib/contact-schema.mjs src/lib/email-schemas.ts src/lib/email-config.ts src/types/env.d.ts src/components/sections/ContactForm.tsx src/app/api/contact/route.ts scripts/contact-schema.test.mjs package.json
git commit -m "feat(security): harden contact form schema"
```

### Task 5: Module de tri

**Files:**
- Create: `src/lib/contact-screening.mjs`, `scripts/contact-screening.test.mjs`
- Modify: `package.json` (`test:security`)

**Interfaces:**
- Produces, dans `src/lib/contact-screening.mjs` :
  - `ALLOWED_LINK_HOSTS: readonly string[]` (liste des Global Constraints, sans l'hôte Blob)
  - `findLinks(text: string): Array<{ start: number; end: number; raw: string; href: string; host: string }>` : liens au sens de la spec 2b (schéma `http(s)://`, préfixe `www.`, domaine nu suivi de `/`). `host` en minuscules et en punycode.
  - `isAllowedHost(host: string, extraAllowedHosts?: string[]): boolean` : égalité ou suffixe `.<domaine>`.
  - `screenContactSubmission(data, options?: { extraAllowedHosts?: string[] }): { verdict: 'clean' | 'suspect'; reasons: Array<'link_not_allowed' | 'link_in_identity_field'>; linkHosts: string[] }`. `data` contient `firstName`, `lastName`, `company?`, `phone?`, `description`, `files: Array<{ name: string }>`. `reasons` sans doublon, dans l'ordre `link_not_allowed` puis `link_in_identity_field`. `linkHosts` sans doublon et trié.
  - `toScreeningLog(result): { event: 'contact_screening'; verdict; reasons; linkHosts }`
  - un `@typedef ScreeningResult` JSDoc pour le type de retour de `screenContactSubmission`, importable côté TypeScript par `import type { ScreeningResult } from '@/lib/contact-screening.mjs'`

- [ ] **Step 1: Écrire les tests** (les cas de la spec, section 5, plus la Review Focus)

```js
const CAMPAIGN = "Une pièce de remplacement imprimée en 3D évite d'attendre un fournisseur d'origine. Quel devis et quel délai pour un prototype en impression 3D, livré en France ? Projet exposé ici : ";
const base = { firstName: 'Camille', lastName: 'Martin', company: undefined, phone: '0600000000', files: [] };
const screen = (patch, opts) => screenContactSubmission({ ...base, description: 'Bonjour', ...patch }, opts);

test('the campaign messages are suspect', () => {
  assert.deepEqual(screen({ description: CAMPAIGN + 'https://partagepro.online/fr/b2b/hexoprint' }),
    { verdict: 'suspect', reasons: ['link_not_allowed'], linkHosts: ['partagepro.online'] });
  assert.equal(screen({ description: CAMPAIGN + 'sharez.online/fr/b2b/hexoprint' }).verdict, 'suspect');
});

test('legitimate requests stay clean', () => {
  for (const description of [
    "Je voudrais faire imprimer une figurine de jeu de rôle de quelques cm, avec une base de 2.5 cm et des ailes détaillées.",
    'Bonjour, je souhaiterais faire imprimer ce support moteur, le fichier STL est joint.',
    "Mon fils cherche un stage d'observation en février, il s'intéresse à la 3D. Merci de votre retour.",
    'je vous envoie le plan.zip et le support.stl',
    'il me faut une pièce.de rechange',
    'écrivez-moi à jean@exemple.fr',
    'mon modèle : https://we.tl/t-abc123',
    'voir https://www.printables.com/model/123',
  ]) assert.equal(screen({ description }).verdict, 'clean', description);
});

test('lookalike, identity-field and file-name links are suspect', () => {
  assert.equal(screen({ description: 'https://wetransfer.com.evil.online/x' }).verdict, 'suspect');
  assert.deepEqual(screen({ firstName: 'https://we.tl/x' }).reasons, ['link_in_identity_field']);
  assert.equal(screen({ files: [{ name: 'www.exemple.online' }] }).verdict, 'suspect');
});

test('extra allowed hosts are honoured', () => {
  const r = screen({ description: 'https://store.public.blob.vercel-storage.com/a.stl' }, { extraAllowedHosts: ['store.public.blob.vercel-storage.com'] });
  assert.equal(r.verdict, 'clean');
});

test('review focus: case, homoglyph, userinfo, punctuation, markdown', () => {
  assert.equal(screen({ description: 'HTTPS://WE.TL/t-abc' }).verdict, 'clean');
  assert.equal(screen({ description: 'https://wеtransfer.com/x' }).verdict, 'suspect');
  assert.deepEqual(screen({ description: 'https://we.tl@partagepro.online/x' }).linkHosts, ['partagepro.online']);
  assert.equal(findLinks('(voir https://we.tl/t-abc).')[0].href, 'https://we.tl/t-abc');
  assert.equal(screen({ description: '[dossier](https://partagepro.online/x)' }).verdict, 'suspect');
});

test('review focus: pathological input stays fast', () => {
  for (const description of ['a.'.repeat(2500), 'www.'.repeat(1250), 'a/'.repeat(2500)]) {
    const t = performance.now();
    screen({ description });
    assert.ok(performance.now() - t < 100, description.slice(0, 8));
  }
});

test('the log line carries no personal data', () => {
  const log = toScreeningLog(screen({ description: CAMPAIGN + 'https://partagepro.online/fr' }));
  assert.deepEqual(Object.keys(log).sort(), ['event', 'linkHosts', 'reasons', 'verdict']);
});
```

- [ ] **Step 2: Ajouter le fichier à `test:security` et vérifier l'échec**

Run: `pnpm test:security`
Expected: FAIL (module introuvable).

- [ ] **Step 3: Implémenter `src/lib/contact-screening.mjs`.** Une seule expression régulière linéaire repère les candidats (pas de quantificateurs imbriqués). Chaque candidat est analysé par `new URL()` (préfixe `https://` ajouté s'il manque), ce qui règle la casse, le punycode et l'astuce `user@hôte`. Retirer de la fin du candidat les caractères `.,;:!?)]}'"`. Un candidat précédé de `@` ou collé à un mot fait partie d'une adresse e-mail et n'est pas un lien. Annoter les exports en JSDoc pour que TypeScript infère les types.

- [ ] **Step 4: Vérifier**

Run: `pnpm verify`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/contact-screening.mjs scripts/contact-screening.test.mjs package.json
git commit -m "feat(security): screen contact submissions for unknown links"
```

### Task 6: Désamorçage et contenu texte du mail admin

**Files:**
- Create: `src/lib/safe-text.mjs`, `src/lib/contact-email-content.mjs`, `scripts/safe-text.test.mjs`, `scripts/contact-email-content.test.mjs`
- Modify: `package.json` (`test:security`)

**Interfaces:**
- Consumes: `findLinks`, `isAllowedHost` (Task 5), `getOptionLabel` et les listes (Task 3).
- Produces, dans `src/lib/safe-text.mjs` :
  - `defang(raw: string): string` : `http` devient `hxxp`, chaque `.` de l'hôte devient `[.]`, le chemin est inchangé.
  - `toSafeSegments(text: string, options: { allowLinks: boolean; extraAllowedHosts?: string[] }): Array<{ kind: 'text'; value: string } | { kind: 'link'; value: string; href: string }>`. Un lien devient un segment `link` seulement si `allowLinks` et hôte autorisé. Tout autre lien, et tout domaine nu non autorisé (`mot.lettres`, hors adresse e-mail), devient du texte désamorcé.
- Produces, dans `src/lib/contact-email-content.mjs` :
  - `ADMIN_SUBJECT = 'Nouvelle demande de devis reçue'`, `SUSPECT_SUBJECT_PREFIX = '[À VÉRIFIER] '`
  - `SUSPECT_BANNER_TITLE = 'Message à vérifier avant toute action'`
  - `SUSPECT_BANNER_BODY = "Ce message a été mis de côté automatiquement. N'ouvrez aucun lien et ne téléchargez aucun fichier tant que vous n'avez pas vérifié l'expéditeur. Pour répondre à un vrai client, copiez son adresse e-mail ci-dessous."`
  - `REASON_LABELS = { link_not_allowed: 'il contient un lien vers un site inconnu', link_in_identity_field: 'un lien figure dans le nom, la société ou le téléphone' }`
  - `buildAdminEnvelope(screening, senderEmail: string): { subject: string; replyTo: string | undefined; sendConfirmation: boolean; trackConversion: boolean }`
  - `buildAdminEmailText({ formData, screening, submittedAt, extraAllowedHosts }): string` : mêmes rubriques que le mail HTML. Bandeau et motifs en tête si suspect. Textes passés par `toSafeSegments` avec `allowLinks: verdict === 'clean'`. URL de fichier en clair si `clean`, désamorcée si `suspect`.

- [ ] **Step 1: Écrire les tests**

`scripts/safe-text.test.mjs` :

```js
test('defang neutralises scheme and host dots only', () => {
  assert.equal(defang('https://partagepro.online/fr/b2b/hexoprint'), 'hxxps://partagepro[.]online/fr/b2b/hexoprint');
  assert.equal(defang('sharez.online/fr/x'), 'sharez[.]online/fr/x');
});

test('allowed links stay clickable only when links are allowed', () => {
  assert.deepEqual(toSafeSegments('voir https://we.tl/t-abc', { allowLinks: true }),
    [{ kind: 'text', value: 'voir ' }, { kind: 'link', value: 'https://we.tl/t-abc', href: 'https://we.tl/t-abc' }]);
  const off = toSafeSegments('voir https://we.tl/t-abc', { allowLinks: false });
  assert.ok(off.every((s) => s.kind === 'text'));
  assert.match(off.map((s) => s.value).join(''), /hxxps:\/\/we\[\.\]tl\/t-abc/);
});

test('unknown links, bare domains and markdown links are never clickable', () => {
  const join = (t) => toSafeSegments(t, { allowLinks: true });
  assert.ok(join('https://partagepro.online/x').every((s) => s.kind === 'text'));
  assert.equal(join('truc.online').map((s) => s.value).join(''), 'truc[.]online');
  assert.ok(join('[dossier](https://partagepro.online/x)').every((s) => s.kind === 'text'));
  assert.equal(join('(voir https://we.tl/t-abc).').find((s) => s.kind === 'link').href, 'https://we.tl/t-abc');
  assert.equal(join('écrivez à jean@exemple.fr').map((s) => s.value).join(''), 'écrivez à jean@exemple.fr');
});
```

`scripts/contact-email-content.test.mjs` (fixture `formData` inventée, un fichier sur `https://store.public.blob.vercel-storage.com/a.stl`, `extraAllowedHosts: ['store.public.blob.vercel-storage.com']`) :

```js
test('envelope follows the verdict', () => {
  assert.deepEqual(buildAdminEnvelope({ verdict: 'clean', reasons: [], linkHosts: [] }, 'a@b.fr'),
    { subject: 'Nouvelle demande de devis reçue', replyTo: 'a@b.fr', sendConfirmation: true, trackConversion: true });
  assert.deepEqual(buildAdminEnvelope({ verdict: 'suspect', reasons: ['link_not_allowed'], linkHosts: ['partagepro.online'] }, 'a@b.fr'),
    { subject: '[À VÉRIFIER] Nouvelle demande de devis reçue', replyTo: undefined, sendConfirmation: false, trackConversion: false });
});

test('suspect text contains no live URL at all', () => {
  const text = buildAdminEmailText({ formData: { ...formData, description: 'dossier : https://partagepro.online/fr' }, screening: SUSPECT, submittedAt: 'lundi', extraAllowedHosts });
  assert.doesNotMatch(text, /https?:\/\//);
  assert.match(text, /hxxps:\/\/partagepro\[\.\]online\/fr/);
  assert.match(text, /Message à vérifier avant toute action/);
  assert.match(text, /il contient un lien vers un site inconnu/);
  assert.ok(text.includes(formData.email));
});

test('clean text keeps allowed links and file URLs', () => {
  const text = buildAdminEmailText({ formData: { ...formData, description: 'voir https://we.tl/t-abc et partagepro.online' }, screening: CLEAN, submittedAt: 'lundi', extraAllowedHosts });
  assert.ok(text.includes('https://we.tl/t-abc'));
  assert.ok(text.includes('https://store.public.blob.vercel-storage.com/a.stl'));
  assert.ok(text.includes('partagepro[.]online'));
  assert.doesNotMatch(text, /Message à vérifier/);
});
```

- [ ] **Step 2: Ajouter les deux fichiers à `test:security` et vérifier l'échec**

Run: `pnpm test:security`
Expected: FAIL (modules introuvables).

- [ ] **Step 3: Implémenter les deux modules** selon les signatures ci-dessus.

- [ ] **Step 4: Vérifier**

Run: `pnpm verify`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/safe-text.mjs src/lib/contact-email-content.mjs scripts/safe-text.test.mjs scripts/contact-email-content.test.mjs package.json
git commit -m "feat(security): defang links in admin email content"
```

### Task 7: Gabarit admin et service d'envoi selon le verdict

**Files:**
- Modify: `src/components/emails/contact-form-admin-email.tsx`, `src/lib/email-service.ts`, `src/lib/email-config.ts` (retirer `EMAIL_TEMPLATES.CONTACT_FORM.adminSubject`, remplacé par `ADMIN_SUBJECT`), `scripts/contact-email-templates.test.mjs`

**Interfaces:**
- Consumes: Tasks 3, 5 et 6.
- Produces:
  - `ContactFormAdminEmail({ formData, submittedAt, screening, extraAllowedHosts })`
  - `emailService.sendContactFormEmails(formData: ContactFormData, screening: ScreeningResult, options: { extraAllowedHosts: string[] }): Promise<EmailResponse>`

- [ ] **Step 1: Étendre `scripts/contact-email-templates.test.mjs`**

```js
test('the admin template renders from safe segments and the verdict', async () => {
  const tpl = await source('src/components/emails/contact-form-admin-email.tsx');
  assert.match(tpl, /const isClean = screening\.verdict === 'clean';/);
  assert.match(tpl, /toSafeSegments\(/);
  assert.match(tpl, /SUSPECT_BANNER_TITLE/);
  assert.match(tpl, /\{isClean && file\.url && \(/);
  assert.doesNotMatch(tpl, /function get(ProjectType|Budget|Deadline)Label/);
});

test('the email service applies the envelope', async () => {
  const svc = await source('src/lib/email-service.ts');
  assert.match(svc, /buildAdminEnvelope\(screening, formData\.email\)/);
  assert.match(svc, /replyTo: envelope\.replyTo/);
  assert.match(svc, /text: buildAdminEmailText\(/);
  assert.match(svc, /if \(envelope\.sendConfirmation\)/);
});
```

- [ ] **Step 2: Vérifier l'échec**

Run: `pnpm test:security`
Expected: FAIL sur les deux nouveaux tests.

- [ ] **Step 3: Modifier le gabarit admin.** Bandeau rouge en tête quand `!isClean` (titre, corps et motifs via `REASON_LABELS`). Prénom, nom, société, téléphone, nom de fichier et description rendus par segments (`allowLinks: isClean`). Adresse e-mail affichée en texte. Bouton « Télécharger le fichier » seulement si `isClean && file.url`, sinon nom du fichier et `defang(file.url)` en texte. Libellés via `getOptionLabel`. `Preview` reprend l'objet de l'enveloppe.

- [ ] **Step 4: Modifier le service.** Calculer l'enveloppe, envoyer le mail admin avec `subject`, `replyTo` et `text`. Envoyer la confirmation seulement si `envelope.sendConfirmation`. `clientEmailId` reste vide sinon.

- [ ] **Step 5: Vérifier**

Run: `pnpm verify`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/components/emails/contact-form-admin-email.tsx src/lib/email-service.ts src/lib/email-config.ts scripts/contact-email-templates.test.mjs
git commit -m "feat(security): flag suspect requests in the admin email"
```

### Task 8: Route contact, traces et logs de production

**Files:**
- Create: `scripts/contact-route.test.mjs`
- Modify: `src/app/api/contact/route.ts`, `next.config.ts`, `scripts/security-config.test.mjs`, `package.json` (`test:security`)

**Interfaces:**
- Consumes: `createContactSubmissionSchema` (Task 4), `screenContactSubmission` et `toScreeningLog` (Task 5), `sendContactFormEmails` (Task 7).

- [ ] **Step 1: Écrire les tests**

`scripts/contact-route.test.mjs` :

```js
test('the route screens, logs without personal data and answers uniformly', async () => {
  const route = await source('src/app/api/contact/route.ts');
  assert.match(route, /screenContactSubmission\(formData, \{ extraAllowedHosts \}\)/);
  assert.match(route, /JSON\.stringify\(toScreeningLog\(screening\)\)/);
  assert.match(route, /console\.warn/);
  assert.match(route, /console\.info/);
  assert.doesNotMatch(route, /adminEmailId|clientEmailId/);
  assert.match(route, /if \(screening\.verdict === 'clean'\) \{\s*try \{\s*await trackServerEvent\('contact_form_submitted'/);
  assert.match(route, /'Votre demande a été envoyée avec succès\. Nous vous répondrons dans les plus brefs délais\.'/);
});
```

Dans `scripts/security-config.test.mjs` :

```js
test('production keeps error, warn and info logs', async () => {
  assert.match(await source('next.config.ts'),
    /removeConsole:\s*process\.env\.NODE_ENV === 'production'\s*\?\s*\{\s*exclude: \['error', 'warn', 'info'\]\s*\}\s*:\s*false/);
});
```

- [ ] **Step 2: Ajouter `contact-route.test.mjs` à `test:security` et vérifier l'échec**

Run: `pnpm test:security`
Expected: FAIL sur les deux nouveaux tests. `analytics-server-conversions.test.mjs` doit rester vert pendant toute la tâche.

- [ ] **Step 3: Modifier la route.** `extraAllowedHosts` = `[new URL(emailConfig.BLOB_PUBLIC_BASE_URL).host]`, calculé au niveau du module. Après validation : tri, une ligne de log (`console.warn` si suspect, `console.info` sinon), envoi, conversion analytics seulement pour `clean`, réponse 200 `{ success: true, message }`. Garder la variable `emailResult`, le bloc `if (!emailResult.success)` et le `try/catch` autour de `trackServerEvent` tels quels : `analytics-server-conversions.test.mjs` en dépend.

- [ ] **Step 4: Modifier `next.config.ts`** : `removeConsole: process.env.NODE_ENV === 'production' ? { exclude: ['error', 'warn', 'info'] } : false`.

- [ ] **Step 5: Vérifier**

Run: `pnpm verify`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/app/api/contact/route.ts next.config.ts scripts/contact-route.test.mjs scripts/security-config.test.mjs package.json
git commit -m "feat(security): route contact requests through screening"
```

### Livraison du lot 2

- [ ] Vérifier que `BLOB_PUBLIC_BASE_URL` existe dans les trois environnements Vercel, et contrôler les variables Preview d'envoi (Global Constraints).
- [ ] Pousser `security/lot-2-tri`, ouvrir la PR : « Lot 2 sécurité : tri des demandes et mail admin désamorcé ».
- [ ] Sur la preview, envoyer trois demandes et contrôler les critères de la spec (section 5, « Routes et mails ») :
  - sans lien : mail normal avec `Reply-To`, confirmation neutre reçue
  - avec `https://we.tl/t-test` : lien cliquable, confirmation reçue
  - avec `https://partagepro.online/fr/test` : objet préfixé, bandeau, aucun lien cliquable ni en HTML ni en texte, pas de `Reply-To`, pas de confirmation, même message de succès à l'écran
- [ ] Dans les logs Vercel de la preview, une ligne `contact_screening` par demande, sans nom, adresse, téléphone ni description.
- [ ] Fusionner, puis refaire le cas « sans lien » en production.

---

## Lot 3 : anti-abus

Branche : `git fetch origin && git switch -c security/lot-3-anti-abus origin/master`.

### Task 9: Vercel BotID sur les routes publiques

**Files:**
- Create: `src/instrumentation-client.ts`, `scripts/bot-protection.test.mjs`
- Modify: `package.json` (dépendance `botid`, `test:security`), `next.config.ts`, `src/app/api/contact/route.ts`, `src/app/api/upload/route.ts`

**Interfaces:**
- Consumes: rien des lots précédents, en dehors des routes existantes.

- [ ] **Step 1: Écrire le test**

```js
test('both public routes are protected before any work', async () => {
  const client = await source('src/instrumentation-client.ts');
  assert.match(client, /path: '\/api\/contact',\s*method: 'POST'/);
  assert.match(client, /path: '\/api\/upload',\s*method: 'POST'/);
  assert.match(await source('next.config.ts'), /withBotId\(nextConfig\)/);
  for (const [file, firstWork] of [['src/app/api/contact/route.ts', 'request.json()'], ['src/app/api/upload/route.ts', 'request.formData()']]) {
    const route = await source(file);
    const check = route.indexOf('await checkBotId()');
    assert.ok(check >= 0 && check < route.indexOf(firstWork), file);
    assert.match(route, /status: 403/);
  }
});
```

- [ ] **Step 2: Ajouter le fichier à `test:security` et vérifier l'échec**

Run: `pnpm test:security`
Expected: FAIL.

- [ ] **Step 3: Installer et câbler BotID**

Run: `pnpm add botid`
Puis, en suivant la documentation du paquet installé : `initBotId` dans `src/instrumentation-client.ts` avec les deux routes, `withBotId(nextConfig)` dans `next.config.ts`, `checkBotId()` en première instruction des deux handlers. Si `isBot` : `NextResponse.json({ error: 'Accès refusé' }, { status: 403 })`, sans mail, sans écriture Blob, sans analytics. Mode Basic, pas d'option `deepAnalysis`.

- [ ] **Step 4: Vérifier**

Run: `pnpm verify`
Expected: PASS, y compris `analytics-server-conversions.test.mjs`.

- [ ] **Step 5: Commit**

```bash
git add package.json pnpm-lock.yaml next.config.ts src/instrumentation-client.ts src/app/api/contact/route.ts src/app/api/upload/route.ts scripts/bot-protection.test.mjs
git commit -m "feat(security): protect public API routes with BotID"
```

### Task 10: Limite de débit dans le pare-feu Vercel

**Files:**
- Create: `docs/securite.md`

- [ ] **Step 1: Créer les deux règles** dans le pare-feu du projet `yann-pro/hexoprint` (tableau de bord Vercel, Firewall, règle personnalisée, ou API du pare-feu) :

| Nom | Condition | Fenêtre | Limite | Clé | Action |
|---|---|---|---|---|---|
| `rate-limit-contact` | chemin égal à `/api/contact` et méthode `POST` | 600 s | 5 | IP | refus 429 |
| `rate-limit-upload` | chemin égal à `/api/upload` et méthode `POST` | 600 s | 10 | IP | refus 429 |

Si la limite de débit n'est pas disponible sur l'offre de l'équipe, s'arrêter et le signaler au lieu d'implémenter une alternative dans le code.

- [ ] **Step 2: Documenter** dans `docs/securite.md` : les deux règles (tableau ci-dessus), la protection BotID et ses deux routes, la procédure de recréation des règles, et la variable `BLOB_PUBLIC_BASE_URL`.

- [ ] **Step 3: Commit**

```bash
git add docs/securite.md
git commit -m "docs(security): document firewall and bot protection"
```

### Livraison du lot 3

- [ ] Pousser `security/lot-3-anti-abus`, ouvrir la PR : « Lot 3 sécurité : BotID et limite de débit ».
- [ ] Sur la preview, une demande depuis le formulaire passe normalement, un dépôt de fichier aussi.
- [ ] Fusionner. En production, depuis un terminal (WSL ou Git Bash) :

```bash
for i in 1 2 3 4 5 6; do curl -s -o /dev/null -w '%{http_code}\n' -X POST https://hexoprint.fr/api/contact -H 'content-type: application/json' -d '{}'; done
```

Expected: `403` cinq fois (BotID), puis `429` (pare-feu). Aucun mail n'est envoyé.
- [ ] Une vraie demande depuis le formulaire en production passe toujours.

---

## Lot 4 : en-têtes et nettoyage

Branche : `git fetch origin && git switch -c security/lot-4-en-tetes origin/master`.

### Task 11: En-têtes de sécurité et configuration Next

**Files:**
- Modify: `next.config.ts`, `scripts/security-config.test.mjs`

- [ ] **Step 1: Écrire le test**

```js
test('security headers apply to every route and Server Actions config is gone', async () => {
  const cfg = await source('next.config.ts');
  for (const [key, value] of [
    ['X-Frame-Options', 'SAMEORIGIN'],
    ['Referrer-Policy', 'strict-origin-when-cross-origin'],
    ['Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=()'],
    ['Strict-Transport-Security', 'max-age=63072000; includeSubDomains'],
    ['X-Content-Type-Options', 'nosniff'],
  ]) assert.match(cfg, new RegExp(`key: '${key}',\\s*value: '${value.replace(/[()]/g, '\\$&')}'`), key);
  assert.doesNotMatch(cfg, /serverActions/);
  assert.doesNotMatch(cfg, /preload/);
});
```

- [ ] **Step 2: Vérifier l'échec**

Run: `pnpm test:security`
Expected: FAIL.

- [ ] **Step 3: Modifier `next.config.ts`.** Ajouter les en-têtes au bloc existant `source: '/(.*)'`. Le bloc `/studio/:path*` reste tel quel (ses valeurs sont identiques, rien ne se contredit). Supprimer `experimental.serverActions`.

- [ ] **Step 4: Vérifier**

Run: `pnpm verify`
Expected: PASS.

- [ ] **Step 5: Contrôler le jeton navigateur Sanity.** Dans les variables Vercel du projet, chercher `NEXT_PUBLIC_SANITY_BROWSER_TOKEN`. S'il existe : le supprimer et révoquer le jeton dans sanity.io/manage. Le retirer aussi du `.env.example` local (fichier ignoré par git).

- [ ] **Step 6: Commit**

```bash
git add next.config.ts scripts/security-config.test.mjs
git commit -m "feat(security): add baseline security headers"
```

### Livraison du lot 4

- [ ] Pousser `security/lot-4-en-tetes`, ouvrir la PR : « Lot 4 sécurité : en-têtes ».
- [ ] Sur la preview : accueil, galerie, blog et `/studio` (connexion et édition d'un document) fonctionnent.
- [ ] Fusionner, puis en production :

```bash
curl -sI https://hexoprint.fr | grep -iE 'x-frame-options|referrer-policy|permissions-policy|strict-transport-security|x-content-type-options'
```

Expected: les cinq en-têtes avec les valeurs du test.
- [ ] Remettre `develop` au niveau de `master` (avance rapide), pour que la copie de travail locale ne soit plus périmée.
