import { z } from 'zod';
import { resolveAdminRecipients } from './email-recipients.mjs';

// Schéma de validation STRICT pour développement ET production
// EMAIL_TO et EMAIL_TO_ADMIN dépendent de l'environnement de déploiement :
// leur présence est vérifiée par resolveAdminRecipients (voir email-recipients.mjs)
const EmailConfigSchema = z.object({
    RESEND_API_KEY: z.string().min(1, 'RESEND_API_KEY est requis. Créez une clé sur https://resend.com'),
    EMAIL_FROM: z.string().email('EMAIL_FROM doit être un email valide (ex: contact@hexoprint.fr)'),
    EMAIL_TO: z.string().optional(), // Obligatoire en production seulement
    EMAIL_TO_ADMIN: z.string().optional(), // Obligatoire en preview, facultatif en production
    NODE_ENV: z
        .enum(['development', 'production', 'test'])
        .default('development'),
    NEXT_PUBLIC_APP_URL: z
        .string()
        .url('NEXT_PUBLIC_APP_URL doit être une URL valide'),
    // URL publique du store Vercel Blob : seuls les fichiers qui en viennent sont acceptés par /api/contact
    BLOB_PUBLIC_BASE_URL: z
        .string()
        .url(
            'BLOB_PUBLIC_BASE_URL doit être une URL valide (ex: https://xxxx.public.blob.vercel-storage.com)'
        ),
});

// Validation et export de la configuration
function getEmailConfig() {
    const config = {
        RESEND_API_KEY: process.env.RESEND_API_KEY,
        EMAIL_FROM: process.env.EMAIL_FROM,
        EMAIL_TO: process.env.EMAIL_TO,
        EMAIL_TO_ADMIN: process.env.EMAIL_TO_ADMIN, // Deuxième destinataire optionnel
        NODE_ENV: process.env.NODE_ENV as 'development' | 'production' | 'test',
        NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
        BLOB_PUBLIC_BASE_URL: process.env.BLOB_PUBLIC_BASE_URL,
    };

    // Mode test uniquement : on peut simuler sans vraies valeurs
    if (config.NODE_ENV === 'test') {
        return {
            RESEND_API_KEY: config.RESEND_API_KEY || 'test-simulation-key',
            EMAIL_FROM: config.EMAIL_FROM || 'test@hexoprint.fr',
            EMAIL_TO: config.EMAIL_TO || 'test@hexoprint.fr',
            EMAIL_TO_ADMIN: config.EMAIL_TO_ADMIN,
            NODE_ENV: config.NODE_ENV,
            NEXT_PUBLIC_APP_URL: config.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
            BLOB_PUBLIC_BASE_URL:
                config.BLOB_PUBLIC_BASE_URL ||
                'https://test.public.blob.vercel-storage.com',
            isDevMode: true,
        };
    }

    // Développement ET production : VALIDATION STRICTE
    // Les variables communes doivent être définies. Les destinataires sont
    // vérifiés ensuite, selon l'environnement de déploiement.
    const validatedConfig = EmailConfigSchema.parse(config);
    return {
        ...validatedConfig,
        isDevMode: config.NODE_ENV === 'development',
    };
}

export const emailConfig = getEmailConfig();

// Destinataires admin, résolus à l'import : une variable obligatoire absente
// (EMAIL_TO en production, EMAIL_TO_ADMIN en preview) fait échouer le build.
const adminRecipients = resolveAdminRecipients({
    NODE_ENV: emailConfig.NODE_ENV,
    VERCEL_ENV: process.env.VERCEL_ENV,
    EMAIL_TO: emailConfig.EMAIL_TO,
    EMAIL_TO_ADMIN: emailConfig.EMAIL_TO_ADMIN,
});

// Fonction utilitaire pour obtenir la liste des destinataires admin
export function getAdminRecipients(): string[] {
    return [...adminRecipients];
}

// Configuration des templates d'emails
export const EMAIL_TEMPLATES = {
    CONTACT_FORM: {
        subject: "Nouvelle demande de devis - Hexo'print",
        confirmationSubject: "Confirmation de votre demande - Hexo'print",
    },
} as const;

// Configuration pour les différents environnements
export const EMAIL_SETTINGS = {
    development: {
        // En dev, on utilise les adresses de test Resend
        shouldActuallySend: true,
        logEmails: true,
        useTestEmails: true,
        testEmailTo: 'delivered@resend.dev', // Email de test Resend qui simule une livraison réussie
    },
    production: {
        shouldActuallySend: true,
        logEmails: false,
        useTestEmails: false,
    },
    test: {
        shouldActuallySend: false,
        logEmails: false,
        useTestEmails: false,
    },
} as const;
