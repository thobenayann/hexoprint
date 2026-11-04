import { COMPANY_INFO } from '@/lib/company-info';

// Messages de repli affichés par le formulaire de devis et par le dépôt de
// fichiers quand un envoi n'aboutit pas. Chacun redirige un vrai client vers
// les coordonnées publiques, lues dans company-info pour rester à jour en un
// seul endroit.

// 403 : BotID a pris la demande pour un robot.
export const BOT_REFUSED_MESSAGE = `Votre envoi n'a pas pu être vérifié automatiquement. Écrivez-nous directement à ${COMPANY_INFO.contact.email} ou appelez le ${COMPANY_INFO.contact.phone}.`;

// 429 : la limite du pare-feu est atteinte (fenêtre fixe de 600 secondes).
export const RATE_LIMITED_MESSAGE = `Vous avez envoyé plusieurs demandes en peu de temps. Merci de patienter dix minutes avant de réessayer, ou écrivez-nous directement à ${COMPANY_INFO.contact.email} ou appelez le ${COMPANY_INFO.contact.phone}.`;

// 413 : le fichier dépasse ce que la plateforme accepte dans une requête
// (environ 4,5 Mo sur Vercel), alors que le formulaire autorise jusqu'à 100 Mo
// pour un fichier 3D. Le visiteur est orienté vers un lien de partage.
export const FILE_TOO_LARGE_MESSAGE = `Ce fichier est trop volumineux pour être envoyé par le formulaire. Collez plutôt un lien de partage (WeTransfer, Google Drive, Dropbox…) dans la description de votre projet, ou écrivez-nous directement à ${COMPANY_INFO.contact.email} ou appelez le ${COMPANY_INFO.contact.phone}.`;

// Requête rejetée avant toute réponse : réseau coupé, script BotID bloqué par
// un bloqueur de publicité ou délai dépassé.
export const SEND_FAILED_MESSAGE = `L'envoi n'a pas pu aboutir. Vérifiez votre connexion, désactivez un éventuel bloqueur de publicité, puis réessayez, ou écrivez-nous directement à ${COMPANY_INFO.contact.email} ou appelez le ${COMPANY_INFO.contact.phone}.`;
