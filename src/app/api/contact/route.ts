import { trackServerEvent } from '@/lib/analytics-server';
import { screenContactSubmission } from '@/lib/contact-screening.mjs';
import { emailConfig } from '@/lib/email-config';
import { createContactSubmissionSchema } from '@/lib/email-schemas';
import { emailService } from '@/lib/email-service';
import { NextRequest, NextResponse } from 'next/server';

// Schéma serveur, créé une fois au chargement du module : il n'accepte que les
// fichiers hébergés sur le store Vercel Blob du projet
const ContactSubmissionSchema = createContactSubmissionSchema(
    emailConfig.BLOB_PUBLIC_BASE_URL
);

// Hôte du store Blob du projet : un lien vers lui reste autorisé dans le tri
// et dans le mail admin
const extraAllowedHosts = [new URL(emailConfig.BLOB_PUBLIC_BASE_URL).host];

// Types pour la gestion des erreurs
type ApiError = {
    error: string;
    details?: string[];
};

/**
 * POST /api/contact
 * Traite les demandes de contact depuis le formulaire
 */
export async function POST(request: NextRequest) {
    try {
        // Parse du body de la requête
        const body = await request.json();

        // Validation des données avec Zod
        const validationResult = ContactSubmissionSchema.safeParse(body);

        if (!validationResult.success) {
            const errors = validationResult.error.issues.map(
                (issue) => `${issue.path.join('.')}: ${issue.message}`
            );

            return NextResponse.json<ApiError>(
                {
                    error: 'Données invalides',
                    details: errors,
                },
                { status: 400 }
            );
        }

        const formData = validationResult.data;

        // Tri de la demande : le verdict décide du contenu des emails
        const screening = screenContactSubmission(formData, {
            extraAllowedHosts,
        });

        // Envoi des emails
        const emailResult = await emailService.sendContactFormEmails(
            formData,
            screening,
            { extraAllowedHosts }
        );

        if (!emailResult.success) {
            return NextResponse.json<ApiError>(
                {
                    error: "Erreur lors de l'envoi des emails",
                    details: [emailResult.message],
                },
                { status: 500 }
            );
        }

        try {
            await trackServerEvent('contact_form_submitted', {
                customerType: formData.type,
                hasFiles: formData.files.length > 0,
            });
        } catch {
            console.error('Analytics tracking failed');
        }

        // Réponse de succès
        return NextResponse.json(
            {
                success: true,
                message:
                    'Votre demande a été envoyée avec succès. Nous vous répondrons dans les plus brefs délais.',
                adminEmailId: emailResult.adminEmailId,
                clientEmailId: emailResult.clientEmailId,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Erreur dans /api/contact:', error);

        return NextResponse.json<ApiError>(
            {
                error: 'Erreur interne du serveur',
                details: [
                    error instanceof Error ? error.message : 'Erreur inconnue',
                ],
            },
            { status: 500 }
        );
    }
}
