/**
 * Contenu du mail d'administration d'une demande de devis : sujet, destinataire
 * de la réponse, version texte et décisions qui suivent le tri (envoyer ou non
 * la confirmation au visiteur, compter ou non la conversion). Module pur
 * (aucune entrée-sortie), importé par le gabarit du mail et le service d'envoi,
 * et testé seul par `node --test`.
 *
 * Tout texte saisi par le visiteur passe par `toSafeSegments` : un lien inconnu
 * ou un domaine nu y devient du texte désamorcé, jamais un lien cliquable.
 *
 * @typedef {import('./contact-screening.mjs').ScreeningResult} ScreeningResult
 *
 * @typedef {object} AdminEmailFile
 * @property {string} name
 * @property {number} size En octets.
 * @property {string} [type]
 * @property {string} [url]
 *
 * @typedef {object} AdminEmailFormData
 * @property {'particulier' | 'professionnel'} type
 * @property {string} firstName
 * @property {string} lastName
 * @property {string} email
 * @property {string} [phone]
 * @property {string} [company]
 * @property {string} projectType
 * @property {string} description
 * @property {string} [budget]
 * @property {string} [deadline]
 * @property {ReadonlyArray<AdminEmailFile>} [files]
 *
 * @typedef {object} AdminEnvelope
 * @property {string} subject
 * @property {string | undefined} replyTo Absent si la demande est suspecte :
 *   répondre au mail écrirait à l'expéditeur du message piégé.
 * @property {boolean} sendConfirmation
 * @property {boolean} trackConversion
 */

import { BUDGETS, DEADLINES, PROJECT_TYPES, getOptionLabel } from './contact-options.mjs';
import { toSafeFileNameSegments, toSafeSegments } from './safe-text.mjs';

export const ADMIN_SUBJECT = 'Nouvelle demande de devis reçue';
export const SUSPECT_SUBJECT_PREFIX = '[À VÉRIFIER] ';
export const SUSPECT_BANNER_TITLE = 'Message à vérifier avant toute action';
export const SUSPECT_BANNER_BODY =
  "Ce message a été mis de côté automatiquement. N'ouvrez aucun lien et ne téléchargez aucun fichier tant que vous n'avez pas vérifié l'expéditeur. Pour répondre à un vrai client, copiez son adresse e-mail ci-dessous.";

/**
 * Motifs du tri, formulés pour suivre « Signalé car : ».
 *
 * @type {Readonly<Record<string, string>>}
 */
export const REASON_LABELS = Object.freeze({
  link_not_allowed: 'il contient un lien vers un site inconnu',
  link_in_identity_field: 'un lien figure dans le nom, la société ou le téléphone',
});

const UNKNOWN_OPTION_LABEL = 'Valeur non reconnue';
const BYTES_PER_MEGABYTE = 1024 * 1024;

/**
 * Seule une demande `clean` suit le parcours normal. Tout le reste, y compris
 * un verdict absent ou inattendu, est traité comme suspect : en cas de doute, on
 * n'envoie rien au visiteur et on ne compte rien.
 *
 * @param {Pick<ScreeningResult, 'verdict'>} screening
 */
function isClean(screening) {
  return screening?.verdict === 'clean';
}

/**
 * Sujet, destinataire de la réponse et suites d'une demande, selon le tri.
 *
 * @param {Pick<ScreeningResult, 'verdict'>} screening
 * @param {string} senderEmail Adresse saisie par le visiteur.
 * @returns {AdminEnvelope}
 */
export function buildAdminEnvelope(screening, senderEmail) {
  const clean = isClean(screening);
  return {
    subject: clean ? ADMIN_SUBJECT : `${SUSPECT_SUBJECT_PREFIX}${ADMIN_SUBJECT}`,
    replyTo: clean ? senderEmail : undefined,
    sendConfirmation: clean,
    trackConversion: clean,
  };
}

/**
 * Un texte du visiteur, prêt à figurer dans le mail texte : les liens autorisés
 * restent tels qu'écrits (le client de messagerie les rendra cliquables), tout
 * le reste est désamorcé.
 *
 * @param {string} value
 * @param {boolean} allowLinks
 * @param {readonly string[]} extraAllowedHosts
 */
function safe(value, allowLinks, extraAllowedHosts) {
  return toSafeSegments(value, { allowLinks, extraAllowedHosts })
    .map((segment) => segment.value)
    .join('');
}

/**
 * Une valeur d'une seule ligne : les retours à la ligne et autres caractères de
 * contrôle deviennent des espaces, pour qu'un nom ne puisse pas fabriquer de
 * fausses lignes (`Email : …`) dans le mail.
 *
 * @param {string | undefined} value
 */
function oneLine(value) {
  return String(value ?? '')
    .replace(/[\s\p{Cc}]+/gu, ' ')
    .trim();
}

/**
 * Un texte sur plusieurs lignes, décalé de deux espaces : il reste visuellement
 * dans son bloc et ne peut pas se faire passer pour une rubrique du mail.
 *
 * @param {string} value
 */
function indentBlock(value) {
  return value
    .replace(/\r\n?|\p{Zl}|\p{Zp}/gu, '\n')
    .split('\n')
    .map((line) => (line === '' ? line : `  ${line}`))
    .join('\n');
}

/**
 * Version texte du mail d'administration : mêmes rubriques que le mail HTML. Si
 * la demande est suspecte, le bandeau et les motifs viennent en tête, aucun
 * lien n'est cliquable et l'URL de chaque fichier est désamorcée. Si elle est
 * `clean`, les liens autorisés et l'URL des fichiers restent en clair.
 *
 * L'adresse e-mail du visiteur est écrite telle quelle, pour pouvoir la copier :
 * le schéma la valide, et elle ne peut contenir ni `/` ni `:`.
 *
 * @param {object} params
 * @param {AdminEmailFormData} params.formData
 * @param {Pick<ScreeningResult, 'verdict' | 'reasons'>} params.screening
 * @param {string} params.submittedAt Date déjà mise en forme.
 * @param {readonly string[]} [params.extraAllowedHosts] Hôtes ajoutés par la
 *   configuration, par exemple celui du store Blob du projet.
 * @returns {string}
 */
export function buildAdminEmailText({ formData, screening, submittedAt, extraAllowedHosts = [] }) {
  const allowLinks = isClean(screening);
  /** @param {string | undefined} value */
  const line = (value) => safe(oneLine(value), allowLinks, extraAllowedHosts);
  // Un nom de fichier n'est jamais un lien, et garde le point de son extension
  // si c'est un format accepté (`piece.stl`), dans les deux modes
  /** @param {string | undefined} value */
  const fileName = (value) =>
    toSafeFileNameSegments(oneLine(value))
      .map((segment) => segment.value)
      .join('');
  /** @param {ReadonlyArray<{ value: string; label: string }>} options @param {string} value */
  const label = (options, value) => getOptionLabel(options, value) ?? UNKNOWN_OPTION_LABEL;

  /** @type {string[]} */
  const lines = [];

  if (!allowLinks) {
    lines.push(SUSPECT_BANNER_TITLE, '', SUSPECT_BANNER_BODY);
    const reasons = (Array.isArray(screening?.reasons) ? screening.reasons : []).filter((reason) =>
      Object.hasOwn(REASON_LABELS, reason)
    );
    if (reasons.length > 0) {
      lines.push('', 'Signalé car :', ...reasons.map((reason) => `- ${REASON_LABELS[reason]}`));
    }
    lines.push('');
  }

  lines.push(
    'Nouvelle demande de devis',
    '',
    "Une nouvelle demande de devis a été reçue sur le site Hexo'print.",
    '',
    'Informations du contact',
    `Type : ${formData.type === 'particulier' ? 'Particulier' : 'Professionnel'}`,
    `Nom : ${line(formData.firstName)} ${line(formData.lastName)}`,
    `Email : ${oneLine(formData.email)}`
  );
  if (formData.phone) lines.push(`Téléphone : ${line(formData.phone)}`);
  if (formData.company) lines.push(`Entreprise : ${line(formData.company)}`);

  lines.push(
    '',
    'Détails du projet',
    `Type de projet : ${label(PROJECT_TYPES, formData.projectType)}`,
    'Description :',
    indentBlock(safe(formData.description, allowLinks, extraAllowedHosts))
  );
  if (formData.budget) lines.push(`Budget approximatif : ${label(BUDGETS, formData.budget)}`);
  if (formData.deadline) lines.push(`Délai souhaité : ${label(DEADLINES, formData.deadline)}`);

  const files = formData.files ?? [];
  if (files.length > 0) {
    lines.push('', `Fichiers joints (${files.length})`);
    for (const file of files) {
      const megabytes = Number.isFinite(file.size) ? (file.size / BYTES_PER_MEGABYTE).toFixed(2) : '?';
      lines.push(`- ${fileName(file.name)} (${megabytes} MB)`);
      if (file.url) lines.push(`  ${line(file.url)}`);
    }
  }

  lines.push('', `Demande reçue le ${oneLine(submittedAt)}`);
  return `${lines.join('\n')}\n`;
}
