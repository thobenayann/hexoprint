import { ContactFormSchema } from '@/lib/email-schemas';
import { emailService } from '@/lib/email-service';
import { NextRequest, NextResponse } from 'next/server';

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
        const validationResult = ContactFormSchema.safeParse(body);

        if (!validationResult.success) {
            const errors = validationResult.error.errors.map(
                (err) => `${err.path.join('.')}: ${err.message}`
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

        // Envoi des emails
        const emailResult = await emailService.sendContactFormEmails(formData);

        if (!emailResult.success) {
            return NextResponse.json<ApiError>(
                {
                    error: "Erreur lors de l'envoi des emails",
                    details: [emailResult.message],
                },
                { status: 500 }
            );
        }

        // Réponse de succès
        return NextResponse.json(
            {
                success: true,
                message:
                    'Votre demande a été envoyée avec succès. Nous vous répondrons dans les plus brefs délais.',
                emailId: emailResult.emailId,
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
