import { ContactFormAdminEmail } from '@/components/emails/contact-form-admin-email';
import { ContactFormConfirmationEmail } from '@/components/emails/contact-form-confirmation-email';
import { render } from '@react-email/render';
import { Resend } from 'resend';
import {
    EMAIL_SETTINGS,
    EMAIL_TEMPLATES,
    emailConfig,
    getAdminRecipients,
} from './email-config';
import type { ContactFormData, EmailResponse } from './email-schemas';

// Instance Resend
const resend = new Resend(emailConfig.RESEND_API_KEY);

// Service principal d'envoi d'emails
export class EmailService {
    private static instance: EmailService;

    private constructor() {}

    static getInstance(): EmailService {
        if (!EmailService.instance) {
            EmailService.instance = new EmailService();
        }
        return EmailService.instance;
    }

    /**
     * Envoie les emails suite à une demande de contact
     */
    async sendContactFormEmails(
        formData: ContactFormData
    ): Promise<EmailResponse> {
        try {
            const submittedAt = new Date().toLocaleString('fr-FR', {
                timeZone: 'Europe/Paris',
                dateStyle: 'full',
                timeStyle: 'short',
            });

            const settings = EMAIL_SETTINGS[emailConfig.NODE_ENV];

            // Si on est en dev et qu'on ne doit pas envoyer, on simule
            if (!settings.shouldActuallySend) {
                if (settings.logEmails) {
                    console.log('📧 [DEV MODE] Email qui aurait été envoyé:');
                    console.log('From:', emailConfig.EMAIL_FROM);
                    console.log('To Admin:', emailConfig.EMAIL_TO);
                    console.log('To Client:', formData.email);
                    console.log('Form Data:', formData);
                }

                return {
                    success: true,
                    message: 'Emails simulés avec succès (mode développement)',
                    emailId: 'dev-' + Date.now(),
                };
            }

            // Détermination des adresses email (test ou production)
            const adminEmails = settings.useTestEmails
                ? [settings.testEmailTo]
                : getAdminRecipients();
            const clientEmail = settings.useTestEmails
                ? settings.testEmailTo
                : formData.email;

            // Log en développement
            if (settings.logEmails) {
                console.log('📧 [RESEND MODE] Envoi des emails via Resend:');
                console.log('From:', emailConfig.EMAIL_FROM);
                console.log('To Admin(s):', adminEmails);
                console.log('To Client:', clientEmail);
                console.log('Form Data:', formData);
                if (settings.useTestEmails) {
                    console.log(
                        '⚠️  Mode test activé - emails envoyés vers delivered@resend.dev'
                    );
                }
            }

            // Rendu des templates (render peut être asynchrone dans certaines versions)
            const adminEmailHtml = await render(
                ContactFormAdminEmail({
                    formData,
                    submittedAt,
                    baseUrl: emailConfig.NEXT_PUBLIC_APP_URL,
                })
            );

            const confirmationEmailHtml = await render(
                ContactFormConfirmationEmail({
                    formData,
                    submittedAt,
                    baseUrl: emailConfig.NEXT_PUBLIC_APP_URL,
                })
            );

            // Envoi de l'email à l'admin (ou aux admins)
            const adminEmailResult = await this.sendEmail({
                from: emailConfig.EMAIL_FROM,
                to: adminEmails,
                subject: EMAIL_TEMPLATES.CONTACT_FORM.adminSubject,
                html: adminEmailHtml,
                replyTo: formData.email,
            });

            // Envoi de l'email de confirmation au client
            const confirmationEmailResult = await this.sendEmail({
                from: emailConfig.EMAIL_FROM,
                to: [clientEmail],
                subject: EMAIL_TEMPLATES.CONTACT_FORM.confirmationSubject,
                html: confirmationEmailHtml,
            });

            // Vérification des résultats
            if (adminEmailResult.error || confirmationEmailResult.error) {
                throw new Error(
                    `Erreur lors de l'envoi: ${
                        adminEmailResult.error?.message ||
                        confirmationEmailResult.error?.message
                    }`
                );
            }

            return {
                success: true,
                message: 'Emails envoyés avec succès',
                emailId: adminEmailResult.data?.id || '',
            };
        } catch (error) {
            console.error("Erreur lors de l'envoi des emails:", error);

            return {
                success: false,
                message:
                    error instanceof Error
                        ? error.message
                        : "Erreur inconnue lors de l'envoi",
            };
        }
    }

    /**
     * Méthode privée pour l'envoi d'un email via Resend
     */
    private async sendEmail(params: {
        from: string;
        to: string[];
        subject: string;
        html: string;
        replyTo?: string;
    }) {
        try {
            const result = await resend.emails.send({
                from: params.from,
                to: params.to,
                subject: params.subject,
                html: params.html,
                replyTo: params.replyTo,
            });

            return result;
        } catch (error) {
            console.error('Erreur Resend:', error);
            throw error;
        }
    }
}

// Export de l'instance singleton
export const emailService = EmailService.getInstance();

// Export des types pour faciliter l'utilisation
export type { ContactFormData, EmailResponse } from './email-schemas';
