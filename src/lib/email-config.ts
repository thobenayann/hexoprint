import { z } from 'zod';

// Schéma de validation STRICT pour développement ET production
// Toutes les variables obligatoires doivent être définies
const EmailConfigSchema = z.object({
    RESEND_API_KEY: z.string().min(1, 'RESEND_API_KEY est requis. Créez une clé sur https://resend.com'),
    EMAIL_FROM: z.string().email('EMAIL_FROM doit être un email valide (ex: contact@hexoprint.fr)'),
    EMAIL_TO: z.string().min(1, 'EMAIL_TO est requis (adresse principale de réception)'),
    EMAIL_TO_ADMIN: z.string().optional(), // Deuxième destinataire optionnel en production
    NODE_ENV: z
        .enum(['development', 'production', 'test'])
        .default('development'),
    NEXT_PUBLIC_APP_URL: z
        .string()
        .url('NEXT_PUBLIC_APP_URL doit être une URL valide'),
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
            isDevMode: true,
        };
    }

    // Développement ET production : VALIDATION STRICTE
    // Toutes les variables obligatoires doivent être définies
    const validatedConfig = EmailConfigSchema.parse(config);
    return {
        ...validatedConfig,
        isDevMode: config.NODE_ENV === 'development',
    };
}

export const emailConfig = getEmailConfig();

// Fonction utilitaire pour obtenir la liste des destinataires admin
export function getAdminRecipients(): string[] {
    const recipients = [emailConfig.EMAIL_TO];

    // En production, ajouter le deuxième destinataire si défini
    if (emailConfig.NODE_ENV === 'production' && emailConfig.EMAIL_TO_ADMIN) {
        recipients.push(emailConfig.EMAIL_TO_ADMIN);
    }

    return recipients;
}

// Configuration des templates d'emails
export const EMAIL_TEMPLATES = {
    CONTACT_FORM: {
        subject: "Nouvelle demande de devis - Hexo'print",
        adminSubject: 'Nouvelle demande de devis reçue',
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
