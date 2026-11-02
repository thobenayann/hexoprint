import { z } from 'zod';
import { BUDGETS, DEADLINES, PROJECT_TYPES } from './contact-options.mjs';
import { MAX_UPLOAD_FILES } from './upload-limits.mjs';

/**
 * Limites du formulaire de devis. Elles servent aussi bien au navigateur
 * qu'au serveur : le serveur ne fait jamais confiance au navigateur, mais les
 * deux doivent appliquer exactement les mêmes règles.
 */
export const CONTACT_LIMITS = {
  nameMax: 60,
  companyMax: 120,
  phoneMax: 30,
  emailMax: 254,
  descriptionMin: 4,
  descriptionMax: 5000,
  fileNameMax: 255,
  filesMax: MAX_UPLOAD_FILES,
};

const CLIENT_TYPES = /** @type {const} */ (['particulier', 'professionnel']);
const LEGACY_CLIENT_TYPES = CLIENT_TYPES.map((type) => `'${type}'`).join(' | ');

const NAME_MIN = 2;
const FILE_URL_MAX = 2048;
const FILE_TYPE_MAX = 255;
const PHONE_PATTERN = /^[0-9+().\s-]*$/;

const PROJECT_TYPE_VALUES = PROJECT_TYPES.map((option) => option.value);
const BUDGET_VALUES = BUDGETS.map((option) => option.value);
const DEADLINE_VALUES = DEADLINES.map((option) => option.value);

/** @param {unknown} value */
function formatLegacyEnumValue(value) {
  try {
    return String(value);
  } catch {
    return 'unknown';
  }
}

/**
 * Un champ optionnel : absent ou chaîne vide (ce que envoie le formulaire pour
 * un champ laissé vide) donne `undefined`, toute autre valeur doit respecter
 * le schéma.
 *
 * @template {z.ZodType} T
 * @param {T} schema
 */
function optionalField(schema) {
  return z.preprocess((value) => (value === '' ? undefined : value), schema.optional());
}

/**
 * Métadonnées d'un fichier déjà envoyé sur Vercel Blob. Le contrôle de l'hôte
 * de `url` n'est pas ici : il dépend de la configuration serveur.
 *
 * @param {z.ZodString} urlSchema
 */
function buildFileSchema(urlSchema) {
  return z.object({
    name: z
      .string()
      .min(1, 'Le nom du fichier est requis')
      .max(CONTACT_LIMITS.fileNameMax, `Le nom du fichier ne doit pas dépasser ${CONTACT_LIMITS.fileNameMax} caractères`)
      .refine((name) => !name.includes('/') && !name.includes('\\'), 'Le nom du fichier est invalide'),
    size: z.number().int().nonnegative(),
    type: z.string().max(FILE_TYPE_MAX, 'Le type du fichier est trop long'),
    url: urlSchema,
  });
}

// Schéma des métadonnées de fichier utilisable dans le navigateur.
export const EmailFileSchema = buildFileSchema(
  z.string().min(1, "L'URL du fichier est requise").max(FILE_URL_MAX, "L'URL du fichier est trop longue")
);

/**
 * Objet de champs commun, sans raffinement : Zod 4 interdit `.extend()` sur un
 * schéma raffiné, donc la règle croisée est appliquée après coup par
 * `withCompanyRule`, sur le schéma client comme sur le schéma serveur.
 *
 * @param {ReturnType<typeof buildFileSchema>} fileSchema
 */
function buildContactFields(fileSchema) {
  return {
    type: z.enum(CLIENT_TYPES, {
      error: (issue) => {
        if (issue.input === undefined) {
          return 'Le type de client est requis';
        }

        return `Invalid enum value. Expected ${LEGACY_CLIENT_TYPES}, received '${formatLegacyEnumValue(issue.input)}'`;
      },
    }),
    firstName: z
      .string()
      .min(NAME_MIN, `Le prénom doit contenir au moins ${NAME_MIN} caractères`)
      .max(CONTACT_LIMITS.nameMax, `Le prénom ne doit pas dépasser ${CONTACT_LIMITS.nameMax} caractères`),
    lastName: z
      .string()
      .min(NAME_MIN, `Le nom doit contenir au moins ${NAME_MIN} caractères`)
      .max(CONTACT_LIMITS.nameMax, `Le nom ne doit pas dépasser ${CONTACT_LIMITS.nameMax} caractères`),
    email: z
      .string()
      .email('Adresse email invalide')
      .max(CONTACT_LIMITS.emailMax, `L'adresse email ne doit pas dépasser ${CONTACT_LIMITS.emailMax} caractères`),
    phone: optionalField(
      z
        .string()
        .max(CONTACT_LIMITS.phoneMax, `Le téléphone ne doit pas dépasser ${CONTACT_LIMITS.phoneMax} caractères`)
        .regex(PHONE_PATTERN, 'Le téléphone ne doit contenir que des chiffres, des espaces et + ( ) . -')
    ),
    company: optionalField(
      z.string().max(CONTACT_LIMITS.companyMax, `Le nom de l'entreprise ne doit pas dépasser ${CONTACT_LIMITS.companyMax} caractères`)
    ),
    projectType: z.enum(PROJECT_TYPE_VALUES, {
      error: (issue) =>
        issue.input === undefined || issue.input === ''
          ? 'Le type de projet est requis'
          : 'Le type de projet est invalide',
    }),
    description: z
      .string()
      .min(CONTACT_LIMITS.descriptionMin, `La description doit contenir au moins ${CONTACT_LIMITS.descriptionMin} caractères`)
      .max(CONTACT_LIMITS.descriptionMax, `La description ne doit pas dépasser ${CONTACT_LIMITS.descriptionMax} caractères`),
    budget: optionalField(z.enum(BUDGET_VALUES, { error: 'Le budget est invalide' })),
    deadline: optionalField(z.enum(DEADLINE_VALUES, { error: 'Le délai est invalide' })),
    files: z
      .array(fileSchema)
      .max(CONTACT_LIMITS.filesMax, `Vous pouvez joindre ${CONTACT_LIMITS.filesMax} fichiers au maximum`)
      .default([]),
  };
}

/**
 * Si c'est un professionnel, l'entreprise est obligatoire.
 *
 * @template {z.ZodObject<any>} T
 * @param {T} schema
 */
function withCompanyRule(schema) {
  return schema.refine((data) => !(data.type === 'professionnel' && !data.company), {
    message: "Le nom de l'entreprise est requis pour les professionnels",
    path: ['company'],
  });
}

/**
 * Schéma partagé, utilisable dans le navigateur : toutes les règles du
 * formulaire sauf l'hôte des fichiers, qui dépend de la configuration serveur.
 */
export const ContactFormSchema = withCompanyRule(z.object(buildContactFields(EmailFileSchema)));

/**
 * Schéma serveur : le même, plus le contrôle que chaque fichier vient bien du
 * store Vercel Blob du projet. Le préfixe se termine par `/` pour qu'un hôte
 * qui commence pareil (`store.public.blob.vercel-storage.com.evil.online`) soit
 * refusé.
 *
 * @param {string} blobPublicBaseUrl URL publique du store Blob, avec ou sans `/` final
 */
export function createContactSubmissionSchema(blobPublicBaseUrl) {
  const prefix = `${blobPublicBaseUrl.replace(/\/+$/, '')}/`;

  const fileUrl = z
    .string()
    .min(1, "L'URL du fichier est requise")
    .max(FILE_URL_MAX, "L'URL du fichier est trop longue")
    .refine((url) => url.startsWith(prefix), "L'URL du fichier n'est pas autorisée");

  return withCompanyRule(z.object(buildContactFields(buildFileSchema(fileUrl))));
}
