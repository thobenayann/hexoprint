import { COMPANY_INFO } from '@/lib/company-info';

// Message affiché quand /api/contact ou /api/upload répond 403 (BotID a pris
// la demande pour un robot). Il redirige un vrai client vers les coordonnées
// publiques, lues dans company-info pour rester à jour en un seul endroit.
export const BOT_REFUSED_MESSAGE = `Votre envoi n'a pas pu être vérifié automatiquement. Écrivez-nous directement à ${COMPANY_INFO.contact.email} ou appelez le ${COMPANY_INFO.contact.phone}.`;
