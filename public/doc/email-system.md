# Système de gestion des emails - Hexoprint.fr

## Vue d'ensemble

Ce système permet de gérer l'envoi d'emails pour le site Hexoprint.fr en utilisant :

-   **Resend** pour l'envoi d'emails
-   **Zod** pour la validation des données
-   **React Email** pour les templates HTML
-   Gestion séparée développement/production

## Architecture

```
src/
├── lib/
│   ├── email-schemas.ts     # Validation Zod et types
│   ├── email-config.ts      # Configuration centralisée
│   └── email-service.ts     # Service principal d'envoi
├── components/emails/
│   ├── contact-form-admin-email.tsx         # Template admin
│   └── contact-form-confirmation-email.tsx  # Template client
├── app/api/contact/
│   └── route.ts            # API route pour les contacts
└── components/sections/
    └── ContactForm.tsx     # Formulaire mis à jour
```

## Configuration

### 1. Variables d'environnement

Créer un fichier `.env.local` :

```env
# Configuration Resend
RESEND_API_KEY=your_resend_api_key_here

# Configuration des emails
EMAIL_FROM=contact@hexoprint.fr
EMAIL_TO=yann@hexoprint.fr

# Configuration générale
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 2. Obtenir une clé API Resend

1. Aller sur [resend.com](https://resend.com)
2. Créer un compte
3. Générer une clé API
4. Ajouter la clé dans `.env.local`

## Fonctionnalités

### Mode développement

-   Les emails ne sont **pas envoyés** réellement
-   Logs dans la console pour debug
-   Route de test disponible : `/api/contact` (GET)

### Mode production

-   Envoi réel des emails via Resend
-   Validation stricte des variables d'environnement
-   Gestion complète des erreurs

## Utilisation

### 1. Installation des dépendances

```bash
pnpm add resend react-email zod @react-email/components @react-email/render
```

### 2. Test en développement

1. Démarrer le serveur : `pnpm dev`
2. Tester la configuration : `curl http://localhost:3000/api/contact`
3. Utiliser le formulaire de contact sur le site

### 3. Envoi d'un email de contact

Le formulaire envoie une requête POST vers `/api/contact` avec :

```typescript
{
  type: 'particulier' | 'professionnel',
  firstName: string,
  lastName: string,
  email: string,
  phone?: string,
  company?: string,
  projectType: string,
  description: string,
  files: Array<{name: string, size: number, type: string}>,
  budget?: string,
  deadline?: string
}
```

### 4. Emails envoyés

1. **Email admin** : Notification de nouvelle demande
2. **Email client** : Confirmation de réception

## Personnalisation

### Modifier les templates d'emails

Les templates sont dans `src/components/emails/` :

-   Utiliser les composants React Email
-   Respecter la charte graphique Hexoprint
-   Styles inline pour compatibilité email

### Ajouter de nouveaux types d'emails

1. Créer le template React Email
2. Ajouter le schéma Zod dans `email-schemas.ts`
3. Étendre le service dans `email-service.ts`
4. Créer l'API route correspondante

## Monitoring et debug

### Logs en développement

Les emails sont loggés dans la console :

```
📧 [DEV MODE] Email qui aurait été envoyé:
From: contact@hexoprint.fr
To Admin: yann@hexoprint.fr
To Client: client@example.com
Form Data: {...}
```

### Test de configuration

```bash
curl http://localhost:3000/api/contact
```

Retourne :

```json
{
    "environment": "development",
    "configTest": {
        "success": true,
        "message": "Configuration email valide"
    },
    "timestamp": "2024-01-01T10:00:00.000Z"
}
```

## Déploiement en production

### 1. Variables d'environnement Vercel

Dans le dashboard Vercel, ajouter :

-   `RESEND_API_KEY`
-   `EMAIL_FROM`
-   `EMAIL_TO`
-   `NODE_ENV=production`
-   `NEXT_PUBLIC_APP_URL=https://hexoprint.fr`

### 2. Vérification

1. Le site doit avoir un domaine vérifié dans Resend
2. L'adresse `EMAIL_FROM` doit utiliser ce domaine
3. Tester avec une vraie demande de contact

## Sécurité

-   Validation stricte avec Zod côté client et serveur
-   Protection contre les injections
-   Rate limiting recommandé (à implémenter si nécessaire)
-   Variables d'environnement sécurisées

## Troubleshooting

### Emails non reçus

1. Vérifier les variables d'environnement
2. Vérifier le domaine dans Resend
3. Consulter les logs Vercel/Resend

### Erreurs de validation

1. Vérifier la structure des données envoyées
2. Consulter les erreurs Zod dans la console
3. Vérifier que tous les champs requis sont renseignés

### Performance

-   Les templates sont rendus à la volée
-   Considérer la mise en cache pour un volume élevé
-   Monitoring des temps de réponse API

## Extension future

-   Système de templates dynamiques via Sanity
-   Notifications par webhook
-   Dashboard de suivi des demandes
-   Intégration CRM
-   A/B testing des templates
