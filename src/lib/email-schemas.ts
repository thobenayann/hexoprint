import { z } from 'zod';
import { ContactFormSchema, EmailFileSchema } from './contact-schema.mjs';

// Les schémas du formulaire de devis vivent dans un module .mjs, pour être
// testables par node --test sans compilation et partagés avec le navigateur.
export {
    CONTACT_LIMITS,
    ContactFormSchema,
    EmailFileSchema,
    createContactSubmissionSchema,
} from './contact-schema.mjs';

// Type TypeScript dérivé du schéma : ce que le serveur reçoit une fois validé
export type ContactFormData = z.output<typeof ContactFormSchema>;

// État du formulaire dans le navigateur, avant validation : les champs texte
// sont toujours des chaînes (vides tant que le visiteur n'a rien saisi)
export type ContactFormDraft = {
    type: ContactFormData['type'];
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    company: string;
    projectType: string;
    description: string;
    budget: string;
    deadline: string;
    files: Array<z.input<typeof EmailFileSchema>>;
};

// Schéma pour les métadonnées d'email
export const EmailMetadataSchema = z.object({
    to: z.string().email(),
    from: z.string().email(),
    subject: z.string().min(1),
    replyTo: z.string().email().optional(),
});

export type EmailMetadata = z.infer<typeof EmailMetadataSchema>;

// Schéma pour la réponse de l'API
export const EmailResponseSchema = z.object({
    success: z.boolean(),
    message: z.string(),
    adminEmailId: z.string().optional(),
    clientEmailId: z.string().optional(),
    errors: z.array(z.string()).optional(),
});

export type EmailResponse = z.infer<typeof EmailResponseSchema>;

// Schéma pour la validation des fichiers uploadés (côté client)
export const ClientFileSchema = z.object({
    name: z.string(),
    size: z.number(),
    type: z.string(),
    lastModified: z.number().optional(),
});

export type ClientFileData = z.infer<typeof ClientFileSchema>;
