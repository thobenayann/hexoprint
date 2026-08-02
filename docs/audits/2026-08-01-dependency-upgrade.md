# Audit des dépendances Hexoprint — 1er août 2026

## Versions directes finales

Le manifeste et le lockfile ont été vérifiés avec Node.js `22.14.0` et pnpm `10.33.0`.

```text
@portabletext/react 7.0.1        @radix-ui/react-accordion 1.2.20
@radix-ui/react-avatar 1.2.6     @radix-ui/react-hover-card 1.1.23
@radix-ui/react-navigation-menu 1.2.22
@radix-ui/react-popover 1.1.23   @radix-ui/react-slot 1.3.3
@radix-ui/react-tabs 1.1.21      @radix-ui/react-tooltip 1.2.16
@react-three/drei 10.7.7         @react-three/fiber 9.7.0
@sanity/image-url 2.1.1          @sanity/sdk 2.18.0
@sanity/vision 6.8.0             @splinetool/react-spline 4.1.0
@splinetool/runtime 1.12.98      @tanstack/react-query 5.101.4
@tanstack/react-query-devtools 5.101.4
@types/three 0.185.3             @vercel/analytics 2.0.1
@vercel/blob 2.6.1               @vercel/speed-insights 2.0.0
class-variance-authority 0.7.1   clsx 2.1.1
framer-motion 12.43.0            lucide-react 1.28.0
next 16.2.12                     next-sanity 13.2.3
next-themes 0.4.6                nuqs 2.9.4
react 19.2.8                     react-dom 19.2.8
react-email 6.9.1                resend 6.18.1
sanity 6.8.0                     styled-components 6.4.4
tailwind-merge 3.6.0             three 0.185.1
zod 4.4.3

@sanity/codegen 8.0.0            @tailwindcss/postcss 4.3.3
@types/node 26.1.2               @types/react 19.2.18
@types/react-dom 19.2.4          eslint 9.39.2
eslint-config-next 16.2.12       prettier 3.9.6
tailwindcss 4.3.3                tw-animate-css 1.4.0
typescript 5.9.3
```

## Paquets supprimés ou remplacés

- `@react-email/components` et la dépendance directe `@react-email/render` ont été remplacées par `react-email` 6.9.1. Le sous-paquet de rendu reste une dépendance transitive de cette distribution.
- La dépendance directe `@eslint/eslintrc` a été retirée ; elle peut rester transitive d’ESLint 9.

## Résultats des commandes de vérification

- `pnpm outdated --format json` : deux écarts, consignés dans les exceptions ci-dessous ; aucun paquet de production n’est signalé.
- `pnpm install --frozen-lockfile` : PASS. Le SHA-256 de `pnpm-lock.yaml` est resté `4517B7BD32F08E9349E790E0B9995ED118B598D242885CBB5DD8BEDE88C1CB17`.
- `pnpm verify` : PASS : lint, `tsc --noEmit`, validation SEO et build Next.js 16.2.12 passent. Le build signale seulement le choix de la racine Turbopack dû aux deux lockfiles (dépôt et worktree) et des en-têtes Cache-Control personnalisés.
- `pnpm audit --prod` : 20 avis (13 élevés, 7 modérés), détaillés ci-dessous. La commande retourne le code 1 pour ces avis ; ce n’est pas un échec de compilation ni de l’installation gelée.

## Vulnérabilités résiduelles

Les 20 avis sont transitifs. `pnpm outdated` ne signale aucune mise à jour de dépendance directe de production qui les résoudrait.

- Via `next` : `postcss` (avis 1117015, 1124252, 1124288) et `sharp` (1124066).
- Via `sanity > @sanity/cli` : `js-yaml` (1112714, 1121859, 1123912), `smol-toml` (1115393), `picomatch` (1115549, 1115552), `uuid` (1119441) et `adm-zip` (1123686).
- Via `react-email` : `socket.io-parser` (1115154), `engine.io` (1123943), `ws` (1119108, 1123259) et `fast-uri` (1117870, 1117884, 1124064, 1130178).

Les corrections publiées concernent ces nœuds transitifs ; aucune résolution forcée, `override` ou mise à jour directe non compatible n’a été appliquée. Réévaluer ces trois chaînes lors d’une prochaine publication compatible de Next, Sanity ou React Email.

## Exceptions documentées

- **ESLint — exception de compatibilité de l’outillage.** Le registre propose 10.8.0 ; le manifeste conserve 9.39.2. `eslint-plugin-react` 7.37.5 ne déclare une compatibilité que jusqu’à ESLint 9 et échoue avec ESLint 10 (`contextOrFilename.getFilename is not a function`). La chaîne lint vérifiée passe avec ESLint 9.39.2.
- **TypeScript — exception de compatibilité de l’outillage.** Le registre propose 7.0.2 ; le manifeste conserve 5.9.3. `typescript-eslint` et `@typescript-eslint/parser` 8.65.0 déclarent `typescript >=4.8.4 <6.1.0` et arrêtent l’exécution avec TypeScript 7. Le contrôle de types et le build vérifiés passent avec TypeScript 5.9.3.
