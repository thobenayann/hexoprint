/**
 * Tri des demandes de devis : repère les liens dans les champs du formulaire et
 * classe la demande `clean` ou `suspect`. Module pur (aucune entrée-sortie),
 * importé par la route `/api/contact` et testé seul par `node --test`.
 *
 * @typedef {'link_not_allowed' | 'link_in_identity_field'} ScreeningReason
 *
 * @typedef {object} ScreeningResult
 * @property {'clean' | 'suspect'} verdict
 * @property {ScreeningReason[]} reasons Sans doublon, `link_not_allowed` en premier.
 * @property {string[]} linkHosts Hôtes trouvés, sans chemin, sans doublon, triés.
 *
 * @typedef {object} FoundLink
 * @property {number} start Position du premier caractère du lien dans le texte.
 * @property {number} end Position qui suit le dernier caractère (exclue).
 * @property {string} raw Le lien tel qu'écrit, ponctuation finale retirée.
 * @property {string} href URL absolue normalisée, ou `''` si l'analyseur d'URL
 *   rejette le lien (son hôte n'est alors jamais autorisé).
 * @property {string} host Hôte en minuscules et en punycode.
 *
 * @typedef {object} ScreeningInput
 * @property {string} firstName
 * @property {string} lastName
 * @property {string} [company]
 * @property {string} [phone]
 * @property {string} description
 * @property {ReadonlyArray<{ name: string }>} [files]
 *
 * @typedef {object} ScreeningLog
 * @property {'contact_screening'} event
 * @property {ScreeningResult['verdict']} verdict
 * @property {ScreeningReason[]} reasons
 * @property {string[]} linkHosts
 */

/**
 * Hôtes vers lesquels un lien reste acceptable : le site, le partage de
 * fichiers et les bibliothèques de modèles 3D. Un sous-domaine est accepté
 * (`www.printables.com`). L'hôte du store Blob du projet dépend de la
 * configuration : il est passé par `extraAllowedHosts`.
 *
 * @type {readonly string[]}
 */
export const ALLOWED_LINK_HOSTS = Object.freeze([
  'hexoprint.fr',
  'wetransfer.com',
  'we.tl',
  'swisstransfer.com',
  'transfernow.net',
  'fromsmash.com',
  'drive.google.com',
  'dropbox.com',
  'onedrive.live.com',
  '1drv.ms',
  'icloud.com',
  'printables.com',
  'thingiverse.com',
  'cults3d.com',
  'myminifactory.com',
  'makerworld.com',
  'grabcad.com',
]);

/*
 * Repérage des candidats : une seule expression régulière, en temps linéaire.
 *
 * Trois formes comptent comme lien :
 * 1. `http://` ou `https://` (aussi `https:/` ou `https:\\`, que les
 *    navigateurs acceptent), puis l'autorité, puis un chemin éventuel ;
 * 2. `www.`, puis l'autorité, puis un chemin éventuel ;
 * 3. un domaine nu immédiatement suivi de `/`, dont le dernier libellé est un
 *    vrai suffixe (lettres, ou punycode `xn--`), port facultatif.
 *
 * Pourquoi c'est linéaire :
 * - aucune répétition n'en contient une autre : les seules répétitions de
 *   groupe portent sur un caractère précédé d'un regard avant de longueur
 *   bornée, et les `?` ne rendent un groupe que facultatif ;
 * - deux quantificateurs voisins ne peuvent jamais lire le même caractère :
 *   l'autorité exclut `/?#\`, le chemin commence forcément par l'un d'eux,
 *   les libellés du domaine nu excluent `.` qui les sépare ;
 * - les formes 2 et 3 ne peuvent démarrer qu'au début d'une suite de
 *   caractères de domaine (regard arrière `GLUED_BEFORE`), donc chaque essai
 *   raté ne parcourt que sa propre suite, et ces suites sont disjointes ;
 * - les regards avant et arrière ont une longueur bornée (8 caractères pour
 *   le schéma, un libellé plus 6 caractères de port pour le suffixe) ;
 * - un candidat trouvé est consommé en entier, la recherche reprend après lui.
 */

// Un candidat collé à un mot, à un domaine ou à une adresse e-mail n'est pas
// un lien : `jean@www.exemple.fr`, `awww.`, `exemple.fr`.
const GLUED_BEFORE = String.raw`(?<![\p{L}\p{M}\p{N}_.@-])`;
// Le début d'une autre URL : il termine le candidat en cours, pour que
// `https://we.tl/?u=https://partagepro.online/x` donne deux liens.
const NEXT_URL = String.raw`https?:[\/\\]`;
// Identifiant, hôte et port : tout sauf les séparateurs, les blancs, les
// caractères de contrôle et les délimiteurs HTML (`<`, `>`, `"`, accent grave).
const AUTHORITY_CHAR = String.raw`(?:(?!${NEXT_URL})[^\s\p{Cc}<>"\x60\/?#\\])`;
const PATH_CHAR = String.raw`(?:(?!${NEXT_URL})[^\s\p{Cc}<>"\x60])`;
const OPTIONAL_PATH = String.raw`(?:[\/?#\\]${PATH_CHAR}*)?`;
const LABEL_CHAR = String.raw`[\p{L}\p{M}\p{N}_-]`;
const HOST_CHAR = String.raw`[\p{L}\p{M}\p{N}_.-]`;
// Vérifié une seule fois, quand le `/` qui suit le domaine nu est atteint.
// Écarte les nombres (`2.5/3`), les mesures (`0.4mm/0.6mm`), les initiales.
const ENDS_WITH_TLD = String.raw`(?<=\.(?:[\p{L}\p{M}]{2,}|xn--[\p{L}\p{N}-]+)(?::\d{1,5})?\/)`;

const LINK_CANDIDATE = new RegExp(
  [
    String.raw`https?:[\/\\]+${AUTHORITY_CHAR}+${OPTIONAL_PATH}`,
    String.raw`${GLUED_BEFORE}www\.${AUTHORITY_CHAR}+${OPTIONAL_PATH}`,
    String.raw`${GLUED_BEFORE}${LABEL_CHAR}+\.${HOST_CHAR}*(?::\d{1,5})?\/${ENDS_WITH_TLD}${PATH_CHAR}*`,
  ].join('|'),
  'giu'
);

const SCHEME_PREFIX = /^https?:[\/\\]+/i;
const AUTHORITY_END = /[\/?#\\]/;
const TRAILING_PUNCTUATION = new Set(['.', ',', ';', ':', '!', '?', ')', ']', '}', "'", '"']);
const WWW_PREFIX_LENGTH = 'www.'.length;

/** @param {string} candidate */
function trimTrailingPunctuation(candidate) {
  let end = candidate.length;
  while (end > 0 && TRAILING_PUNCTUATION.has(candidate[end - 1])) {
    end -= 1;
  }
  return candidate.slice(0, end);
}

/**
 * Hôte écrit dans une URL que l'analyseur rejette (port invalide, caractère
 * interdit…) : ce qui suit le dernier `@` de l'autorité, ou toute l'autorité
 * si rien ne suit (`https://partagepro.online@`), en minuscules. Il ne
 * correspond jamais à la liste blanche, puisqu'il ne s'analyse pas.
 *
 * @param {string} absoluteUrl
 */
function writtenHost(absoluteUrl) {
  const rest = absoluteUrl.replace(SCHEME_PREFIX, '');
  const authorityEnd = rest.search(AUTHORITY_END);
  const authority = authorityEnd === -1 ? rest : rest.slice(0, authorityEnd);
  const host = authority.slice(authority.lastIndexOf('@') + 1);
  return (host || authority).toLowerCase();
}

/**
 * Transforme un candidat en lien. L'hôte vient toujours de l'analyseur d'URL
 * WHATWG (`new URL`), jamais du texte brut : il règle la casse, convertit les
 * noms internationaux en punycode (`wеtransfer.com` avec un « е » cyrillique
 * devient `xn--…`) et retire l'identifiant de `https://we.tl@partagepro.online`.
 *
 * @param {string} raw
 * @param {number} start
 * @returns {FoundLink | null}
 */
function toLink(raw, start) {
  const hasScheme = SCHEME_PREFIX.test(raw);
  // `www.` suivi de ponctuation seulement (`www.,`) : rien vers quoi pointer.
  // Un domaine nu fait au moins 5 caractères (`a.bc/`), il n'est pas concerné.
  if (!hasScheme && raw.length <= WWW_PREFIX_LENGTH) {
    return null;
  }

  const absoluteUrl = hasScheme ? raw : `https://${raw}`;
  const end = start + raw.length;

  try {
    const url = new URL(absoluteUrl);
    return { start, end, raw, href: url.href, host: url.hostname };
  } catch {
    // Un lien que l'analyseur refuse reste un lien : un logiciel de messagerie
    // peut en rendre cliquable une partie. Il compte donc comme non autorisé.
    const host = writtenHost(absoluteUrl);
    return host === '' ? null : { start, end, raw, href: '', host };
  }
}

/**
 * Liens présents dans un texte, dans l'ordre. Comptent comme liens une URL
 * `http(s)://`, une adresse commençant par `www.` et un domaine nu suivi d'un
 * chemin (`partagepro.online/fr`). Ne comptent pas : un domaine nu sans chemin
 * (`plan.zip`), une adresse e-mail, un nombre décimal. La ponctuation finale
 * `.,;:!?)]}'"` est retirée du lien.
 *
 * @param {string} text
 * @returns {FoundLink[]}
 */
export function findLinks(text) {
  if (typeof text !== 'string' || text === '') {
    return [];
  }

  /** @type {FoundLink[]} */
  const links = [];
  for (const match of text.matchAll(LINK_CANDIDATE)) {
    const link = toLink(trimTrailingPunctuation(match[0]), match.index);
    if (link) {
      links.push(link);
    }
  }
  return links;
}

/**
 * Hôte normalisé par l'analyseur d'URL, ou `null` s'il ne s'analyse pas.
 * Accepte un hôte nu ou une URL complète.
 *
 * @param {unknown} value
 */
function toHostname(value) {
  if (typeof value !== 'string' || value.trim() === '') {
    return null;
  }
  const trimmed = value.trim();
  try {
    const { hostname } = new URL(SCHEME_PREFIX.test(trimmed) ? trimmed : `https://${trimmed}`);
    return hostname === '' ? null : hostname;
  } catch {
    return null;
  }
}

const NORMALIZED_ALLOWED_HOSTS = ALLOWED_LINK_HOSTS.map((host) => /** @type {string} */ (toHostname(host)));

/**
 * Un hôte est autorisé s'il est égal à un hôte de la liste blanche ou s'il en
 * est un sous-domaine (suffixe `.<domaine>`). `wetransfer.com.evil.online` et
 * `evilwetransfer.com` ne le sont pas.
 *
 * @param {string} host
 * @param {readonly string[]} [extraAllowedHosts] Hôtes ajoutés par la
 *   configuration, par exemple celui du store Blob du projet.
 * @returns {boolean}
 */
export function isAllowedHost(host, extraAllowedHosts = []) {
  const candidate = toHostname(host);
  if (candidate === null) {
    return false;
  }

  const allowedHosts = [...NORMALIZED_ALLOWED_HOSTS, ...extraAllowedHosts.map(toHostname)];
  return allowedHosts.some(
    (allowed) => allowed !== null && (candidate === allowed || candidate.endsWith(`.${allowed}`))
  );
}

const IDENTITY_FIELDS = /** @type {const} */ (['firstName', 'lastName', 'company', 'phone']);

/**
 * Classe une demande de devis validée. Elle est `suspect` si un lien pointe
 * hors de la liste blanche (`link_not_allowed`), ou si un lien, même autorisé,
 * figure dans le nom, le prénom, la société ou le téléphone
 * (`link_in_identity_field`).
 *
 * @param {ScreeningInput} data
 * @param {{ extraAllowedHosts?: readonly string[] }} [options]
 * @returns {ScreeningResult}
 */
export function screenContactSubmission(data, options = {}) {
  const extraAllowedHosts = options.extraAllowedHosts ?? [];
  /** @type {Set<string>} */
  const hosts = new Set();
  let linkNotAllowed = false;
  let linkInIdentityField = false;

  /**
   * @param {unknown} value
   * @param {boolean} isIdentityField
   */
  const inspect = (value, isIdentityField) => {
    for (const link of findLinks(typeof value === 'string' ? value : '')) {
      hosts.add(link.host);
      linkInIdentityField ||= isIdentityField;
      linkNotAllowed ||= !isAllowedHost(link.host, extraAllowedHosts);
    }
  };

  for (const field of IDENTITY_FIELDS) {
    inspect(data[field], true);
  }
  inspect(data.description, false);
  for (const file of data.files ?? []) {
    inspect(file?.name, false);
  }

  /** @type {ScreeningReason[]} */
  const reasons = [];
  if (linkNotAllowed) reasons.push('link_not_allowed');
  if (linkInIdentityField) reasons.push('link_in_identity_field');

  return {
    verdict: reasons.length > 0 ? 'suspect' : 'clean',
    reasons,
    linkHosts: [...hosts].sort(),
  };
}

/**
 * Ligne de trace serveur d'un tri. Elle ne contient aucune donnée saisie par
 * le visiteur : ni nom, ni adresse, ni téléphone, ni description.
 *
 * @param {ScreeningResult} result
 * @returns {ScreeningLog}
 */
export function toScreeningLog(result) {
  return {
    event: 'contact_screening',
    verdict: result.verdict,
    reasons: [...result.reasons],
    linkHosts: [...result.linkHosts],
  };
}
