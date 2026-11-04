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

/*
 * Normalisation du texte saisi. L'analyseur d'URL (`new URL`, donc tout
 * navigateur) retire d'un nom d'hôte les caractères de mise en forme
 * invisibles (trait d'union conditionnel U+00AD, espace sans chasse U+200B,
 * U+2060, U+FEFF...) et lit les points idéographique et pleine chasse comme
 * un `.`. Sans normalisation, `partagepro` + U+00AD + `.online/fr` échappe au
 * tri et à l'affichage désamorcé, mais un copier-coller dans un navigateur
 * ouvre `partagepro.online`.
 *
 * Le texte est donc normalisé une seule fois, ici, avant tout contrôle de
 * longueur : le tri, l'affichage et les traces lisent tous le même texte.
 * Les caractères sont retirés ou remplacés, jamais refusés. Un texte collé
 * depuis un traitement de texte contient des traits d'union conditionnels,
 * et un refus apprendrait à l'expéditeur ce que le filtre regarde.
 */
// Caractères de mise en forme (catégorie Unicode Cf) : retirés.
const FORMAT_CHARS = /\p{Cf}/gu;
// Caractères de contrôle (catégorie Cc : C0, DEL, C1 dont NEL U+0085), sauf
// tabulation et retours à la ligne, légitimes dans une description : remplacés
// par une espace.
const CONTROL_CHARS = /(?![\t\n\r])\p{Cc}/gu;
// Point idéographique U+3002, point pleine chasse U+FF0E et point idéographique
// demi-chasse U+FF61 : les seuls caractères que l'analyseur d'URL lit comme `.`.
const DOT_LOOKALIKES = /[\u3002\uFF0E\uFF61]/g;

/**
 * Texte saisi, tel que le tri, l'affichage et les traces doivent le lire.
 *
 * @param {string} value
 * @returns {string}
 */
export function normalizeVisitorText(value) {
  return value.replace(FORMAT_CHARS, '').replace(CONTROL_CHARS, ' ').replace(DOT_LOOKALIKES, '.');
}

// Chaîne normalisée : les contrôles chaînés ensuite (longueur, motif) portent
// sur le texte normalisé, et la sortie du schéma est ce texte.
const visitorText = () => z.string().overwrite(normalizeVisitorText);

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
    name: visitorText()
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
    firstName: visitorText()
      .min(NAME_MIN, `Le prénom doit contenir au moins ${NAME_MIN} caractères`)
      .max(CONTACT_LIMITS.nameMax, `Le prénom ne doit pas dépasser ${CONTACT_LIMITS.nameMax} caractères`),
    lastName: visitorText()
      .min(NAME_MIN, `Le nom doit contenir au moins ${NAME_MIN} caractères`)
      .max(CONTACT_LIMITS.nameMax, `Le nom ne doit pas dépasser ${CONTACT_LIMITS.nameMax} caractères`),
    email: z
      .string()
      .email('Adresse email invalide')
      .max(CONTACT_LIMITS.emailMax, `L'adresse email ne doit pas dépasser ${CONTACT_LIMITS.emailMax} caractères`),
    phone: optionalField(
      visitorText()
        .max(CONTACT_LIMITS.phoneMax, `Le téléphone ne doit pas dépasser ${CONTACT_LIMITS.phoneMax} caractères`)
        .regex(PHONE_PATTERN, 'Le téléphone ne doit contenir que des chiffres, des espaces et + ( ) . -')
    ),
    company: optionalField(
      visitorText().max(CONTACT_LIMITS.companyMax, `Le nom de l'entreprise ne doit pas dépasser ${CONTACT_LIMITS.companyMax} caractères`)
    ),
    projectType: z.enum(PROJECT_TYPE_VALUES, {
      error: (issue) =>
        issue.input === undefined || issue.input === ''
          ? 'Le type de projet est requis'
          : 'Le type de projet est invalide',
    }),
    description: visitorText()
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

// Blancs, caractères de contrôle et de mise en forme : l'analyseur d'URL en
// retire ou en ignore certains, donc le texte contrôlé ne serait plus celui
// que le mail rend en lien. Une barre oblique inverse est lue comme `/` par
// l'analyseur WHATWG, mais pas par tous les logiciels de messagerie.
const UNSAFE_URL_CHARS = /[\s\p{Cc}\p{Cf}\\]/u;

/**
 * Origine `https:` d'une URL, ou `null` si elle ne s'analyse pas ou n'est pas
 * en `https:`.
 *
 * @param {string} value
 */
function httpsOriginOf(value) {
  if (!URL.canParse(value)) {
    return null;
  }
  const url = new URL(value);
  return url.protocol === 'https:' ? url.origin : null;
}

/**
 * Vrai si `url` désigne un fichier du store dont l'origine est `blobOrigin`.
 *
 * Deux contrôles. L'origine analysée (schéma, hôte en minuscules, port) doit
 * être celle du store. Et le texte doit commencer par cette origine suivie de
 * `/`, sans tenir compte de la casse : l'URL est rendue telle quelle en lien
 * dans le mail, et ce début garantit que tout logiciel y lit le même hôte
 * (pas d'identifiant `https://store...@evil.online`, pas de port, pas de
 * `https:\\`). Une URL relative au schéma (`//evil/a.stl`) ne s'analyse pas.
 *
 * @param {string} url
 * @param {string} blobOrigin
 */
function isBlobFileUrl(url, blobOrigin) {
  return (
    !UNSAFE_URL_CHARS.test(url) &&
    httpsOriginOf(url) === blobOrigin &&
    url.slice(0, blobOrigin.length + 1).toLowerCase() === `${blobOrigin}/`
  );
}

/**
 * Schéma serveur : le même, plus le contrôle que chaque fichier vient bien du
 * store Vercel Blob du projet. La comparaison porte sur l'origine, jamais sur
 * un simple préfixe de texte : `store.public.blob.vercel-storage.com.evil.online`
 * est refusé, et une majuscule, un chemin ou des blancs autour de la variable
 * d'environnement ne font pas refuser les vrais fichiers.
 *
 * @param {string} blobPublicBaseUrl URL publique du store Blob (`https:`), avec
 *   ou sans chemin
 * @throws {Error} si `blobPublicBaseUrl` n'est pas une URL `https:` valide : une
 *   base vide ou fausse ferait accepter ou refuser tous les fichiers.
 */
export function createContactSubmissionSchema(blobPublicBaseUrl) {
  const blobOrigin = typeof blobPublicBaseUrl === 'string' ? httpsOriginOf(blobPublicBaseUrl.trim()) : null;
  if (blobOrigin === null) {
    throw new Error('BLOB_PUBLIC_BASE_URL doit être une URL https valide');
  }

  const fileUrl = z
    .string()
    .min(1, "L'URL du fichier est requise")
    .max(FILE_URL_MAX, "L'URL du fichier est trop longue")
    .refine((url) => isBlobFileUrl(url, blobOrigin), "L'URL du fichier n'est pas autorisée");

  return withCompanyRule(z.object(buildContactFields(buildFileSchema(fileUrl))));
}
