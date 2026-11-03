import { trackServerEvent } from '@/lib/analytics-server';
import {
    screenContactSubmission,
    toScreeningLog,
} from '@/lib/contact-screening.mjs';
import { emailConfig } from '@/lib/email-config';
import { createContactSubmissionSchema } from '@/lib/email-schemas';
import { emailService } from '@/lib/email-service';
import { checkBotId } from 'botid/server';
import { NextRequest, NextResponse } from 'next/server';

// Schéma serveur, créé une fois au chargement du module : il n'accepte que les
// fichiers hébergés sur le store Vercel Blob du projet
const ContactSubmissionSchema = createContactSubmissionSchema(
    emailConfig.BLOB_PUBLIC_BASE_URL
);

// Hôte du store Blob du projet : un lien vers lui reste autorisé dans le tri
// et dans le mail admin. On passe le nom d'hôte (`hostname`, sans port), car la
// liste blanche compare des noms d'hôte
const extraAllowedHosts = [
    new URL(emailConfig.BLOB_PUBLIC_BASE_URL).hostname,
];

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
        // Contrôle anti-robot avant tout travail : on ne lit pas le corps de la
        // requête, on n'envoie aucun email et on ne compte aucune statistique
        const verification = await checkBotId();
        if (verification.isBot) {
            return NextResponse.json<ApiError>(
                { error: 'Accès refusé' },
                { status: 403 }
            );
        }

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
        const screening = screenContactSubmission(formData, { extraAllowedHosts });

        // Une ligne de trace par demande, sans donnée personnelle : sans elle,
        // le tri serait invisible dans les logs de production
        const screeningLog = JSON.stringify(toScreeningLog(screening));
        if (screening.verdict === 'suspect') {
            console.warn(screeningLog);
        } else {
            console.info(screeningLog);
        }

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

        // Une demande suspecte n'est pas une conversion : seules les demandes
        // saines sont comptées dans les statistiques
        if (screening.verdict === 'clean') {
            try {
                await trackServerEvent('contact_form_submitted', {
                    customerType: formData.type,
                    hasFiles: formData.files.length > 0,
                });
            } catch {
                console.error('Analytics tracking failed');
            }
        }

        // Réponse identique quel que soit le verdict : l'expéditeur ne doit pas
        // pouvoir deviner que sa demande a été filtrée, et les identifiants
        // d'email (absents pour une demande suspecte) ne sont plus renvoyés
        return NextResponse.json(
            {
                success: true,
                message:
                    'Votre demande a été envoyée avec succès. Nous vous répondrons dans les plus brefs délais.',
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
