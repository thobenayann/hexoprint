import { z } from 'zod';

// Schéma pour les métadonnées de fichier dans les emails
export const EmailFileSchema = z.object({
    name: z.string(), // Nom original du fichier
    size: z.number(),
    type: z.string(),
    url: z.string().optional(), // URL Vercel Blob pour télécharger le fichier
});

// Schéma de base pour les données de contact
export const ContactFormSchema = z
    .object({
        type: z.enum(['particulier', 'professionnel'], {
            required_error: 'Le type de client est requis',
        }),
        firstName: z
            .string()
            .min(2, 'Le prénom doit contenir au moins 2 caractères'),
        lastName: z
            .string()
            .min(2, 'Le nom doit contenir au moins 2 caractères'),
        email: z.string().email('Adresse email invalide'),
        phone: z.string().optional(),
        company: z.string().optional(),
        projectType: z.string().min(1, 'Le type de projet est requis'),
        description: z
            .string()
            .min(4, 'La description doit contenir au moins 4 caractères'),
        budget: z.string().optional(),
        deadline: z.string().optional(),
        files: z.array(EmailFileSchema).optional().default([]),
    })
    .refine(
        (data) => {
            // Si c'est un professionnel, l'entreprise est obligatoire
            if (data.type === 'professionnel' && !data.company) {
                return false;
            }
            return true;
        },
        {
            message:
                "Le nom de l'entreprise est requis pour les professionnels",
            path: ['company'],
        }
    );

// Type TypeScript dérivé du schéma
export type ContactFormData = z.infer<typeof ContactFormSchema>;

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
