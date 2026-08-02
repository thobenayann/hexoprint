# Task 5 — Migration React Email, Resend et Zod

## Statut

`DONE_WITH_CONCERNS`

## Fix round 1 — contrat exact des erreurs enum Zod 3

- Le callback Zod 4 distingue maintenant explicitement les deux branches du
  contrat historique : une entrée absente conserve
  `Le type de client est requis`, tandis qu'une valeur présente invalide
  reproduit `Invalid enum value. Expected 'particulier' | 'professionnel', received '<valeur>'`.
- Le tuple `CLIENT_TYPES` est la source typée commune du schéma et de la liste
  attendue. La valeur reçue est convertie avec `String` sous `try/catch`, ce qui
  conserve l'interpolation Zod 3 pour les valeurs usuelles sans laisser une
  conversion hostile interrompre la validation.
- Le RED ciblé a reproduit le nouveau défaut Zod 4 pour `association` :
  `Invalid option: expected one of "particulier"|"professionnel"`.
- Le GREEN ciblé vérifie littéralement les deux messages, la contrainte
  entreprise, `EmailResponseSchema`, la validation d'un fichier STL et le
  contenu des deux rendus e-mail. Résultat : e-mail administrateur de 5 471
  caractères, confirmation de 8 138 caractères, quatre contrôles de schéma et
  catégorie upload `3d`.
- `pnpm typecheck` et `pnpm verify` passent sous Node.js 22.14.0 / pnpm 10.33.0.
  Le build contient toujours `/api/contact` et `/api/upload`.
- `pnpm audit --prod` reste volontairement visible en échec avec les mêmes 21
  avis transitifs (13 high, 8 moderate). Aucun override, resolution, force ou
  masquage n'a été ajouté.

La pile e-mail et validation est migrée vers les dernières versions stables
demandées. Les imports React Email sont unifiés, les contrats métier et les
messages de validation sont conservés, les deux routes API compilent et les
vérifications applicatives passent. L'audit production reste non nul à cause
de vulnérabilités transitives ; elles sont documentées sans contournement.

## Versions installées

- `react-email@6.9.1`
- `resend@6.18.1`
- `zod@4.4.3`

`pnpm view <package> version` retourne exactement ces trois versions au
2 août 2026. Les dépendances directes redondantes
`@react-email/components@1.0.4` et `@react-email/render@2.0.2` ont été
supprimées de `package.json`. `pnpm list ... --depth 0` ne liste plus que les
trois dépendances ci-dessus pour cette cohorte.

## Migration réalisée

- Les deux templates importent leurs composants depuis `react-email` et ne
  conservent que les symboles utilisés.
- Le service e-mail importe `render` depuis `react-email`; le client Resend et
  le comportement d'envoi restent inchangés.
- La route contact utilise `validationResult.error.issues` et produit toujours
  des détails sous la forme `chemin: message`.
- Le formulaire client, autre consommateur trouvé par la recherche globale,
  utilise également `issues` tout en conservant les mêmes messages affichés.
- Le `required_error` de Zod 3 est remplacé par le paramètre Zod 4 `error`. Le
  callback traite séparément l'entrée absente et la valeur présente invalide
  afin de préserver textuellement leurs deux messages historiques.
- `ContactFormSchema`, `ContactFormData`, `EmailResponseSchema`,
  `EmailResponse` et `UploadResult` conservent leurs formes métier.
- `src/lib/file-upload.ts` et `src/app/api/upload/route.ts` n'ont nécessité
  aucune adaptation ; leur comportement est couvert par le typecheck, le build
  et la vérification ciblée de fichier.
- Aucun override, resolution, `patchedDependencies`, force ou déploiement n'a
  été utilisé. `.env.local` n'a été ni lu, ni modifié, ni exposé.

## Cycle RED / GREEN

1. Baseline sous Node.js 22.14.0 et pnpm 10.33.0 : `pnpm typecheck` et
   `pnpm build` passent avant migration. Le build contient `/api/contact` et
   `/api/upload`.
2. Après installation, avant adaptation du code, `pnpm typecheck` échoue avec
   le RED attendu :
   - `ZodError.errors` absent dans `src/app/api/contact/route.ts` ;
   - même rupture dans `src/components/sections/ContactForm.tsx` ;
   - `required_error` refusé par `z.enum` dans `src/lib/email-schemas.ts` ;
   - les callbacks issus de `.errors` deviennent implicitement `any`.
3. Après la migration minimale, `pnpm typecheck` passe.
4. La recherche
   `rg -n "\.errors\b|\.format\(|\.flatten\(|z\.record\([^,]+\)|errorMap|required_error" src`
   ne trouve plus d'API Zod supprimée. Les seules correspondances restantes
   sont `validation.errors`, champ métier du validateur sitemap, et
   `Intl.DateTimeFormat.format(date)`.

## Vérifications sous Node.js 22.14.0 / pnpm 10.33.0

- Rendu et validations ciblés : PASS.
  - e-mail administrateur rendu : 5 471 caractères ;
  - e-mail de confirmation rendu : 8 138 caractères ;
  - contenu métier vérifié dans les deux rendus ;
  - message exact `Le type de client est requis` vérifié ;
  - contrainte entreprise, `EmailResponseSchema` et fichier STL catégorie `3d`
    vérifiés.
- `pnpm typecheck && pnpm build` : PASS ; `/api/contact` et `/api/upload` sont
  présentes dans la sortie.
- `pnpm verify` : PASS.
  - ESLint : PASS ;
  - TypeScript : PASS ;
  - validation SEO : 6/6 ;
  - build Next.js : PASS, 19 pages générées.
- `pnpm install --frozen-lockfile` : PASS, lockfile à jour.
- `pnpm outdated` : exit 1 uniquement pour quatre dépendances hors cohorte
  (`@types/node`, `eslint`, `typescript`, `lucide-react`). Aucun ancien paquet
  React Email ni aucune des trois dépendances migrées n'y figure.
- `git diff --check` : PASS.

## Audit production et avertissements

- `pnpm audit --prod` : **FAIL (exit 1)**.
- Résultat : 21 vulnérabilités transitives, dont 13 high et 8 moderate,
  aucune critical signalée.
- Des chemins passent par `react-email@6.9.1`, notamment
  `socket.io-parser`, `ws`, `fast-uri` et `ajv`.
- D'autres chemins passent par la pile Sanity (`picomatch`, `adm-zip`,
  `js-yaml`, `smol-toml`, `uuid`) ou Next.js (`postcss`).
- La cohorte demandée étant déjà à sa dernière version stable, aucun upgrade
  direct prévu par cette tâche ne supprime ces avis. Aucun override,
  resolution, force ou masquage de l'audit n'a été ajouté ; la résolution
  dépend de publications amont.
- pnpm signale encore `uuid@10.0.0` comme sous-dépendance dépréciée et respecte
  la politique existante de scripts natifs ignorés (`esbuild`, `sharp`,
  `unrs-resolver`).
- Next.js conserve les avertissements de baseline sur la racine Turbopack
  inférée depuis plusieurs lockfiles et sur les en-têtes Cache-Control
  personnalisés. Ils sont hors périmètre de cette migration.

## Fichiers modifiés

- `package.json`
- `pnpm-lock.yaml`
- `src/app/api/contact/route.ts`
- `src/components/emails/contact-form-admin-email.tsx`
- `src/components/emails/contact-form-confirmation-email.tsx`
- `src/components/sections/ContactForm.tsx`
- `src/lib/email-schemas.ts`
- `src/lib/email-service.ts`
- `scripts/task-5-fix-round-1-check.ts`
- `.superpowers/sdd/2026-08-01-dependencies-modernization/task-5-report.md`
