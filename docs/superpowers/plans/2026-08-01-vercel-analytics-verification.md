# Hexoprint Vercel Analytics and Verification Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Mettre à niveau les intégrations Vercel, collecter les Core Web Vitals et mesurer les conversions principales sans envoyer de donnée personnelle.

**Architecture:** Un contrat TypeScript fermé définit les quatre événements autorisés et leurs propriétés à faible cardinalité. Les composants client et les routes serveur utilisent deux adaptateurs séparés, tandis que Speed Insights est monté à la racine mais ne sera activé côté Vercel qu’après confirmation explicite du coût et du déploiement.

**Tech Stack:** `@vercel/analytics` 2.0.1, `@vercel/blob` 2.6.1, `@vercel/speed-insights` 2.0.0, Next.js App Router, TypeScript, Vercel CLI.

## Global Constraints

- Le projet Vercel cible l’équipe `yann-pro`, le projet `hexoprint` et le domaine canonique `https://www.hexoprint.fr`.
- Ne jamais transmettre dans un événement un nom, une adresse e-mail, un téléphone, un message libre, un nom de fichier, une URL de Blob ou un identifiant de courriel.
- Limiter les propriétés aux unions TypeScript et aux booléens ou nombres définis dans le contrat.
- Compter `contact_form_submitted` seulement après succès de l’envoi des e-mails.
- Conserver la référence auditée : environ 496 pages vues et 331 visiteurs sur 180 jours, environ 70 % des vues sur l’accueil, 88 vues attribuées à Google et 4 à ChatGPT.
- L’absence actuelle de données Speed Insights ne permet aucune conclusion sur les Core Web Vitals.
- L’activation Speed Insights côté Vercel peut entraîner un coût sur une équipe Pro ; demander une autorisation explicite avant cette mutation externe.
- Ne réaliser aucun déploiement Preview ou Production sans autorisation explicite.

---

## File Structure

- Modify: `package.json` — versions Vercel et scripts de vérification.
- Modify: `pnpm-lock.yaml` — résolution Vercel reproductible.
- Create: `src/lib/analytics-contract.ts` — noms d’événements et propriétés autorisées.
- Create: `src/lib/analytics-client.ts` — adaptateur client `track`.
- Create: `src/lib/analytics-server.ts` — adaptateur serveur `track`.
- Create: `src/lib/analytics-contract.type-test.ts` — assertions TypeScript anti-PII.
- Modify: `src/app/layout.tsx` — montage de Speed Insights.
- Modify: `src/components/ui/devis-button.tsx` — clic devis depuis la navigation.
- Modify: `src/components/ui/primary-button.tsx` — support du suivi des CTA principaux.
- Modify: `src/components/sections/CallToAction.tsx` — sources de CTA explicites.
- Create: `src/components/analytics/tracked-contact-link.tsx` — suivi téléphone/e-mail.
- Modify: `src/components/layout/Footer.tsx` — liens de contact instrumentés.
- Modify: `src/app/api/contact/route.ts` — événement serveur après succès e-mail.
- Modify: `src/app/api/upload/route.ts` — événement serveur après succès upload.
- Modify: `src/app/(client)/politique-confidentialite/page.tsx` — description exacte des outils activés.
- Create: `docs/audits/2026-08-01-vercel-analytics.md` — référence, instrumentation et limites.

### Task 1: Définir un contrat Analytics fermé

**Files:**

- Create: `src/lib/analytics-contract.ts`
- Create: `src/lib/analytics-client.ts`
- Create: `src/lib/analytics-server.ts`
- Create: `src/lib/analytics-contract.type-test.ts`

**Interfaces:**

- Produces: `AnalyticsEventMap`, `AnalyticsEventName`, `createAnalyticsEvent()`, `trackClientEvent()` et `trackServerEvent()`.
- Consumes: aucune donnée de formulaire brute ; les appelants construisent uniquement les propriétés autorisées.

- [ ] **Step 1: Écrire le test de type avant le contrat**

Créer `src/lib/analytics-contract.type-test.ts` :

```ts
import { createAnalyticsEvent } from './analytics-contract';

createAnalyticsEvent('contact_form_submitted', {
  customerType: 'particulier',
  hasFiles: false,
});

createAnalyticsEvent('contact_form_submitted', {
  customerType: 'professionnel',
  hasFiles: true,
  // @ts-expect-error Une adresse e-mail n’est jamais une propriété Analytics autorisée.
  email: 'personne@example.com',
});
```

- [ ] **Step 2: Vérifier l’échec avant implémentation**

Run: `pnpm typecheck`

Expected: FAIL avec `Cannot find module './analytics-contract'`.

- [ ] **Step 3: Implémenter le contrat pur**

Créer `src/lib/analytics-contract.ts` :

```ts
export type AnalyticsEventMap = {
  quote_cta_clicked: {
    source: 'desktop_navigation' | 'mobile_navigation' | 'page_cta';
  };
  contact_link_clicked: {
    source: 'footer' | 'contact_page';
    channel: 'phone' | 'email';
  };
  contact_form_submitted: {
    customerType: 'particulier' | 'professionnel';
    hasFiles: boolean;
  };
  quote_file_upload_succeeded: {
    fileCount: number;
  };
};

export type AnalyticsEventName = keyof AnalyticsEventMap;

export function createAnalyticsEvent<Name extends AnalyticsEventName>(
  name: Name,
  data: AnalyticsEventMap[Name]
) {
  return { name, data } as const;
}
```

- [ ] **Step 4: Ajouter les adaptateurs client et serveur**

Créer `src/lib/analytics-client.ts` :

```ts
'use client';

import { track } from '@vercel/analytics';
import {
  createAnalyticsEvent,
  type AnalyticsEventMap,
  type AnalyticsEventName,
} from './analytics-contract';

export function trackClientEvent<Name extends AnalyticsEventName>(
  name: Name,
  data: AnalyticsEventMap[Name]
) {
  const event = createAnalyticsEvent(name, data);
  track(event.name, event.data);
}
```

Créer `src/lib/analytics-server.ts` :

```ts
import 'server-only';

import { track } from '@vercel/analytics/server';
import {
  createAnalyticsEvent,
  type AnalyticsEventMap,
  type AnalyticsEventName,
} from './analytics-contract';

export async function trackServerEvent<Name extends AnalyticsEventName>(
  name: Name,
  data: AnalyticsEventMap[Name]
) {
  const event = createAnalyticsEvent(name, data);
  await track(event.name, event.data);
}
```

- [ ] **Step 5: Faire passer le test de type**

Run: `pnpm typecheck`

Expected: PASS, y compris l’assertion `@ts-expect-error` qui interdit `email`.

- [ ] **Step 6: Commit**

```bash
git add src/lib/analytics-contract.ts src/lib/analytics-client.ts src/lib/analytics-server.ts src/lib/analytics-contract.type-test.ts
git commit -m "feat: define privacy-safe analytics contract"
```

### Task 2: Mettre à niveau les paquets Vercel et monter Speed Insights

**Files:**

- Modify: `package.json`
- Modify: `pnpm-lock.yaml`
- Modify: `src/app/layout.tsx`
- Verify: `src/app/api/upload/route.ts`

**Interfaces:**

- Consumes: `<Analytics />` déjà monté dans le layout et API `put()` de Vercel Blob.
- Produces: Analytics v2 avec Resilient Intake, Blob v2 et `<SpeedInsights />` dans le layout.

- [ ] **Step 1: Installer les versions Vercel auditées**

Run:

```bash
pnpm up @vercel/analytics@2.0.1 @vercel/blob@2.6.1
pnpm add @vercel/speed-insights@2.0.0
```

Expected: installation sans peer dependency non satisfaite. Si le plan Dépendances a déjà été exécuté, la commande est sans changement de version.

- [ ] **Step 2: Monter Speed Insights à la racine**

Dans `src/app/layout.tsx`, ajouter :

```ts
import { SpeedInsights } from '@vercel/speed-insights/next';
```

Puis, à côté de `<Analytics />` :

```tsx
<Analytics />
<SpeedInsights />
<SanityLive />
```

- [ ] **Step 3: Vérifier Blob v2 et le layout**

Run: `pnpm typecheck && pnpm build`

Expected: PASS ; `/api/upload` compile avec l’import public de `@vercel/blob` et le layout charge les deux composants Vercel.

- [ ] **Step 4: Vérifier la sécurité et l’application**

Run: `pnpm verify && pnpm audit --prod`

Expected: PASS ; les avis corrigés par Analytics v2 ou Blob v2 ne sont plus présents.

- [ ] **Step 5: Commit**

```bash
git add package.json pnpm-lock.yaml src/app/layout.tsx src/app/api/upload/route.ts
git commit -m "feat: upgrade Vercel analytics and speed insights"
```

### Task 3: Instrumenter les CTA et liens de contact

**Files:**

- Modify: `src/components/ui/devis-button.tsx`
- Modify: `src/components/ui/primary-button.tsx`
- Modify: `src/components/sections/CallToAction.tsx`
- Create: `src/components/analytics/tracked-contact-link.tsx`
- Modify: `src/components/layout/Footer.tsx`

**Interfaces:**

- Consumes: `trackClientEvent()` de la Task 1.
- Produces: clics `quote_cta_clicked` et `contact_link_clicked` avec sources fermées.

- [ ] **Step 1: Instrumenter `DevisButton`**

Ajouter `'use client'` et une source optionnelle :

```tsx
type DevisButtonProps = {
  className?: string;
  source?: 'desktop_navigation' | 'mobile_navigation';
};

export function DevisButton({
  className,
  source = 'desktop_navigation',
}: DevisButtonProps) {
  return (
    <Link
      href="/contact"
      onClick={() => trackClientEvent('quote_cta_clicked', { source })}
    >
      {/* InteractiveHoverButton existant */}
    </Link>
  );
}
```

Importer `trackClientEvent` depuis `@/lib/analytics-client` et conserver le contenu visuel existant.

- [ ] **Step 2: Ajouter le suivi optionnel de `PrimaryButton`**

Marquer `src/components/ui/primary-button.tsx` comme composant client et étendre ses props :

```ts
type PrimaryButtonProps = {
  href: string;
  children: React.ReactNode;
  icon?: LucideIcon;
  className?: string;
  external?: boolean;
  analyticsSource?: 'page_cta';
};
```

Sur le `Link` interne, appeler `trackClientEvent('quote_cta_clicked', { source: analyticsSource })` uniquement si `analyticsSource` est défini.

- [ ] **Step 3: Identifier les CTA de page**

Dans `src/components/sections/CallToAction.tsx`, utiliser :

```tsx
<PrimaryButton href="/contact" icon={Star} analyticsSource="page_cta">
  Demander mon devis gratuit
</PrimaryButton>
```

Sur le lien secondaire « Nous contacter », ajouter :

```tsx
onClick={() => trackClientEvent('quote_cta_clicked', { source: 'page_cta' })}
```

- [ ] **Step 4: Créer le lien téléphone/e-mail suivi**

Créer `src/components/analytics/tracked-contact-link.tsx` :

```tsx
'use client';

import { trackClientEvent } from '@/lib/analytics-client';
import type { ComponentPropsWithoutRef } from 'react';

type TrackedContactLinkProps = ComponentPropsWithoutRef<'a'> & {
  channel: 'phone' | 'email';
  source: 'footer' | 'contact_page';
};

export function TrackedContactLink({
  channel,
  source,
  onClick,
  ...props
}: TrackedContactLinkProps) {
  return (
    <a
      {...props}
      onClick={(event) => {
        trackClientEvent('contact_link_clicked', { channel, source });
        onClick?.(event);
      }}
    />
  );
}
```

- [ ] **Step 5: Utiliser le composant dans le Footer**

Remplacer uniquement les ancres `tel:` et `mailto:` de `src/components/layout/Footer.tsx` par `TrackedContactLink`, avec `source="footer"` et le canal correspondant. Ne pas transmettre le texte, le téléphone ou l’e-mail à `trackClientEvent`.

- [ ] **Step 6: Vérifier la compilation**

Run: `pnpm lint && pnpm typecheck && pnpm build`

Expected: PASS ; aucun handler client n’est passé depuis un Server Component non compatible.

- [ ] **Step 7: Commit**

```bash
git add src/components/ui/devis-button.tsx src/components/ui/primary-button.tsx src/components/sections/CallToAction.tsx src/components/analytics/tracked-contact-link.tsx src/components/layout/Footer.tsx
git commit -m "feat: track quote and contact interactions"
```

### Task 4: Instrumenter les conversions serveur

**Files:**

- Modify: `src/app/api/contact/route.ts`
- Modify: `src/app/api/upload/route.ts`

**Interfaces:**

- Consumes: `trackServerEvent()` et les données déjà validées par Zod.
- Produces: événements après succès, sans propriétés dérivées de champs personnels.

- [ ] **Step 1: Suivre l’envoi réussi du formulaire**

Dans `src/app/api/contact/route.ts`, après `emailResult.success` et avant la réponse 200 :

```ts
await trackServerEvent('contact_form_submitted', {
  customerType: formData.type,
  hasFiles: formData.files.length > 0,
});
```

Importer `trackServerEvent` depuis `@/lib/analytics-server`. Ne pas appeler l’événement dans les branches 400 ou 500.

- [ ] **Step 2: Suivre l’upload réussi**

Dans `src/app/api/upload/route.ts`, une fois tous les résultats réussis et juste avant la réponse 200 :

```ts
await trackServerEvent('quote_file_upload_succeeded', {
  fileCount: files.length,
});
```

Ne jamais envoyer `filename`, `pathname`, `url`, `contentType` ou une taille précise à Analytics.

- [ ] **Step 3: Vérifier statiquement les propriétés interdites**

Run: `rg -n -C 3 "track(Client|Server)Event" src`

Expected: seules les propriétés `source`, `channel`, `customerType`, `hasFiles` et `fileCount` apparaissent dans les appels.

- [ ] **Step 4: Exécuter les contrôles**

Run: `pnpm lint && pnpm typecheck && pnpm build`

Expected: PASS ; les deux routes API compilent.

- [ ] **Step 5: Commit**

```bash
git add src/app/api/contact/route.ts src/app/api/upload/route.ts
git commit -m "feat: track successful quote conversions"
```

### Task 5: Aligner la confidentialité et documenter la référence Vercel

**Files:**

- Modify: `src/app/(client)/politique-confidentialite/page.tsx`
- Create: `docs/audits/2026-08-01-vercel-analytics.md`

**Interfaces:**

- Consumes: instrumentation finale et données Vercel déjà auditées.
- Produces: information publique exacte et rapport de référence reproductible.

- [ ] **Step 1: Mettre à jour la page de confidentialité**

Dans la section Vercel Analytics, préciser en français :

```text
Vercel Web Analytics mesure de façon agrégée les pages consultées et les interactions principales sans cookie publicitaire. Les événements personnalisés ne contiennent ni nom, ni adresse e-mail, ni téléphone, ni message, ni nom de fichier. Vercel Speed Insights collecte des mesures techniques de performance lorsque ce service est activé pour le projet.
```

Ne pas annoncer Speed Insights comme actif tant que l’activation projet n’a pas été confirmée.

- [ ] **Step 2: Revalider le projet Vercel avec la CLI**

Run:

```bash
vercel whoami
vercel project inspect hexoprint --scope yann-pro
```

Expected: compte authentifié, projet `hexoprint`, équipe `yann-pro`, domaine de production `www.hexoprint.fr`. Si la CLI globale n’est pas disponible ou n’est pas à jour, proposer `npm i -g vercel@latest` avant de continuer ; ne jamais passer un token en argument.

- [ ] **Step 3: Rédiger le rapport Analytics**

Créer `docs/audits/2026-08-01-vercel-analytics.md` avec ces sections et données de référence :

```markdown
# Audit Vercel Analytics Hexoprint — 1er août 2026

## Périmètre Vercel
- Équipe : yann-pro
- Projet : hexoprint
- Domaine : https://www.hexoprint.fr

## Référence sur 180 jours
- Pages vues : environ 496
- Visiteurs uniques : environ 331
- Accueil : 348 vues, environ 70 %
- Google : 88 vues attribuées, environ 18 %
- ChatGPT : 4 vues attribuées

## Pages et sources principales
## Répartition géographique et appareils
## Événements de conversion ajoutés
## État de Speed Insights
## Limites d’interprétation
## Vérifications après déploiement
```

Documenter l’importante part directe, la part américaine comme signal à valider, le faible volume récent et l’absence de séries Web Vitals avant cette intervention. Préciser également que la requête de métrique HTTP n’a retourné aucune série et que cela ne permet pas d’affirmer qu’il n’existe aucune erreur.

- [ ] **Step 4: Exécuter la validation locale finale**

Run: `pnpm verify && pnpm seo:test`

Expected: PASS.

- [ ] **Step 5: Arrêt d’autorisation avant mutation Vercel**

Présenter au propriétaire du projet :

1. le coût éventuel de Speed Insights sur l’offre de l’équipe ;
2. la différence entre ajouter le composant local et activer la collecte côté projet ;
3. la proposition de déploiement Preview uniquement.

Expected: ne pas activer Speed Insights et ne pas déployer tant qu’un accord explicite n’a pas été reçu.

- [ ] **Step 6: Commit**

```bash
git add "src/app/(client)/politique-confidentialite/page.tsx" docs/audits/2026-08-01-vercel-analytics.md
git commit -m "docs: record analytics baseline and privacy scope"
```

### Task 6: Vérification Vercel après autorisation

**Files:**

- Modify: `docs/audits/2026-08-01-vercel-analytics.md`
- Modify: `docs/audits/2026-08-01-seo-ai-audit.md`

**Interfaces:**

- Consumes: autorisation explicite, branche vérifiée et plans précédents terminés.
- Produces: preuve Preview ; aucune promotion Production automatique.

- [ ] **Step 1: Activer Speed Insights uniquement après accord**

Dans le tableau de bord Vercel, ouvrir `Yann-PRO → hexoprint → Speed Insights`, vérifier le tarif présenté pour l’équipe puis sélectionner **Enable** uniquement si l’autorisation couvre ce coût.

Expected: Speed Insights est indiqué comme actif pour `hexoprint`. Si le tarif n’est pas accepté, laisser le service désactivé et documenter cette exception ; le reste de la Preview peut être vérifié sans prétendre disposer de Web Vitals.

- [ ] **Step 2: Créer une Preview et conserver son URL dans la même session PowerShell**

Run:

```powershell
$hexoprintPreviewOutput = vercel deploy --scope yann-pro --yes
if ($LASTEXITCODE -ne 0) { throw 'Vercel Preview deployment failed' }
$hexoprintPreviewUrl = [string]($hexoprintPreviewOutput | Select-Object -Last 1)
```

Expected: `$hexoprintPreviewUrl` contient l’URL HTTPS de la Preview rattachée au projet `hexoprint`, sans alias de production.

- [ ] **Step 3: Crawler la Preview protégée via Vercel dans la même session**

Run:

```powershell
vercel curl "$hexoprintPreviewUrl/robots.txt" --scope yann-pro
vercel curl "$hexoprintPreviewUrl/sitemap.xml" --scope yann-pro
vercel curl "$hexoprintPreviewUrl/llms.txt" --scope yann-pro
vercel curl "$hexoprintPreviewUrl/prestations" --scope yann-pro
vercel curl "$hexoprintPreviewUrl/contact" --scope yann-pro
```

Expected: cinq réponses 200 accessibles avec l’authentification Vercel.

- [ ] **Step 4: Vérifier les scripts de collecte**

Inspecter le HTML et le réseau de la Preview.

Expected: scripts Web Analytics v2 et Speed Insights chargés sans erreur ; aucune propriété personnelle dans les requêtes d’événements de test.

- [ ] **Step 5: Tester une conversion sans donnée réelle**

Utiliser uniquement des données de test explicitement reconnaissables dans l’environnement Preview, puis vérifier que les événements `quote_cta_clicked`, `contact_form_submitted` et `quote_file_upload_succeeded` apparaissent côté Vercel sans payload personnel.

Expected: événements agrégés conformes au contrat. Ne pas tester l’envoi e-mail si la Preview utilise les variables de production.

- [ ] **Step 6: Compléter les rapports**

Ajouter l’URL Preview, la date, les routes vérifiées, l’état de Speed Insights et les événements observés. Ne conclure sur les Core Web Vitals qu’après un volume réel suffisant.

- [ ] **Step 7: Commit**

```bash
git add docs/audits/2026-08-01-vercel-analytics.md docs/audits/2026-08-01-seo-ai-audit.md
git commit -m "docs: record Vercel preview verification"
```
