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
 * @property {string} raw Le lien tel qu'écrit, sans la ponctuation finale ni les
 *   `.`, `-`, `_` de tête.
 * @property {string} href URL absolue normalisée. Vide (`''`) pour un lien qui
 *   ne doit jamais être autorisé ni rendu cliquable : URL que l'analyseur
 *   rejette, URL avec identifiant (`https://we.tl@partagepro.online`), hôte
 *   remplacé par `invalid-host`. Voir `isAllowedLink`.
 * @property {string} host Hôte en minuscules et en punycode : un domaine ou une
 *   adresse IP (lettres, chiffres, points, tirets, IPv6 entre crochets) de 253
 *   caractères au plus. Pour une URL que l'analyseur rejette, la partie hôte
 *   écrite, sans port, si elle respecte cette forme. Sinon `invalid-host`.
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
 * Les formes 2 et 3 acceptent des `.`, `-`, `_` de tête (`.www.`, `-www.`,
 * `:.partagepro.online/`), retirés ensuite du lien : sans cela, un seul point
 * devant le domaine suffirait à le cacher.
 *
 * Pourquoi c'est linéaire :
 * - aucune répétition n'en contient une autre : les seules répétitions de
 *   groupe portent sur un caractère précédé d'un regard avant de longueur
 *   bornée, et les `?` ne rendent un groupe que facultatif ;
 * - deux quantificateurs voisins ne peuvent jamais lire le même caractère :
 *   l'autorité exclut `/?#\`, le chemin commence forcément par l'un d'eux,
 *   les libellés du domaine nu excluent `.` qui les sépare, la tête `[._-]*`
 *   de la forme 2 ne contient pas de `w` ;
 * - les formes 2 et 3 ne peuvent démarrer qu'au début d'une suite de
 *   caractères de domaine (regard arrière `GLUED_BEFORE`, qui contient `.`,
 *   `-` et `_`), donc chaque essai raté ne parcourt que sa propre suite, et
 *   ces suites sont disjointes ;
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
// Identifiant, hôte et port, lus comme le ferait un logiciel de messagerie
// strict : tout sauf les séparateurs, les blancs, les caractères de contrôle
// et les délimiteurs HTML ou Markdown (`<`, `>`, `"`, accent grave). La
// lecture large, qui traverse ces délimiteurs, est traitée dans `findLinks`.
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
    String.raw`${GLUED_BEFORE}[._-]*www\.${AUTHORITY_CHAR}+${OPTIONAL_PATH}`,
    String.raw`${GLUED_BEFORE}\.*${LABEL_CHAR}+\.${HOST_CHAR}*(?::\d{1,5})?\/${ENDS_WITH_TLD}${PATH_CHAR}*`,
  ].join('|'),
  'giu'
);

// Lecture large de l'autorité, à partir d'un délimiteur : jusqu'au premier
// blanc, caractère de contrôle ou `/?#\`, comme l'analyseur d'URL WHATWG.
const WIDE_AUTHORITY = /[^\s\p{Cc}\/?#\\]*/uy;
const PATH_AFTER_AUTHORITY = new RegExp(OPTIONAL_PATH, 'iuy');
const STRICT_AUTHORITY_DELIMITERS = new Set(['"', '<', '>', '`']);

const SCHEME_PREFIX = /^https?:[\/\\]+/i;
const AUTHORITY_END = /[\/?#\\]/;
const LEADING_JUNK = /^[._-]*/;
const TRAILING_PUNCTUATION = new Set(['.', ',', ';', ':', '!', '?', ')', ']', '}', "'", '"']);
const WWW_PREFIX_LENGTH = 'www.'.length;

/** Valeur de `host` quand l'hôte écrit ne peut pas figurer dans la trace. */
export const INVALID_HOST = 'invalid-host';
const MAX_HOST_LENGTH = 253;
// Hôte « simple » : domaine ASCII ou IPv4, ou IPv6 entre crochets, puis port
// facultatif. Rien d'autre n'entre dans `linkHosts` ni dans la trace serveur.
const PLAIN_HOST = /^(\[[0-9a-f:.]+\]|[a-z0-9.-]+)(?::\d*)?$/;

/** @param {string} candidate */
function trimTrailingPunctuation(candidate) {
  let end = candidate.length;
  while (end > 0 && TRAILING_PUNCTUATION.has(candidate[end - 1])) {
    end -= 1;
  }
  return candidate.slice(0, end);
}

/**
 * Autorité d'une URL absolue : entre le schéma et le premier `/?#\`.
 *
 * @param {string} absoluteUrl
 */
function authorityOf(absoluteUrl) {
  const rest = absoluteUrl.replace(SCHEME_PREFIX, '');
  const authorityEnd = rest.search(AUTHORITY_END);
  return authorityEnd === -1 ? rest : rest.slice(0, authorityEnd);
}

/**
 * Hôte tel qu'il peut figurer dans `linkHosts` et dans la trace serveur : en
 * minuscules, sans port, borné à 253 caractères (la limite d'un nom DNS) et
 * réduit à un domaine ou une adresse IP. Tout le reste devient `invalid-host`,
 * pour qu'aucun texte saisi par le visiteur n'atteigne la trace.
 *
 * @param {string} hostAndPort
 */
function toReportedHost(hostAndPort) {
  const match = PLAIN_HOST.exec(hostAndPort.toLowerCase());
  return match && match[1].length <= MAX_HOST_LENGTH ? match[1] : INVALID_HOST;
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

  // `URL.canParse` évite une exception par URL invalide : un texte piégé peut
  // en contenir des milliers, et une exception coûte cher.
  if (!URL.canParse(absoluteUrl)) {
    // Un lien que l'analyseur refuse reste un lien : un logiciel de messagerie
    // peut en rendre cliquable une partie. Il n'est jamais autorisé.
    const authority = authorityOf(absoluteUrl);
    if (authority === '') {
      return null;
    }
    const hostAndPort = authority.slice(authority.lastIndexOf('@') + 1) || authority;
    return { start, end, raw, href: '', host: toReportedHost(hostAndPort) };
  }

  const url = new URL(absoluteUrl);
  const host = toReportedHost(url.hostname);
  // Un identifiant dans l'URL n'a aucun usage légitime ici, et deux logiciels
  // peuvent y lire deux hôtes différents (`https://partagepro.online"@we.tl`).
  const neverAllowed = url.username !== '' || url.password !== '' || host === INVALID_HOST;
  return { start, end, raw, href: neverAllowed ? '' : url.href, host };
}

/**
 * Lecture large de l'autorité qui commence à `from` : sa fin, et le dernier
 * `@` qu'elle contient (ou -1). Le dernier résultat est gardé : des candidats
 * successifs dans la même autorité (`www.a"www.a"…`) ne la relisent pas, ce
 * qui garde `findLinks` linéaire.
 *
 * @param {string} text
 */
function createWideAuthorityReader(text) {
  let cachedEnd = -1;
  let cachedLastAt = -1;
  /** @param {number} from */
  return (from) => {
    if (from >= cachedEnd) {
      WIDE_AUTHORITY.lastIndex = from;
      WIDE_AUTHORITY.exec(text);
      cachedEnd = WIDE_AUTHORITY.lastIndex;
      cachedLastAt = text.slice(from, cachedEnd).lastIndexOf('@');
      cachedLastAt = cachedLastAt === -1 ? -1 : from + cachedLastAt;
    }
    return { end: cachedEnd, lastAt: cachedLastAt >= from ? cachedLastAt : -1 };
  };
}

/**
 * Liens présents dans un texte, dans l'ordre. Comptent comme liens une URL
 * `http(s)://`, une adresse commençant par `www.` et un domaine nu suivi d'un
 * chemin (`partagepro.online/fr`). Ne comptent pas : un domaine nu sans chemin
 * (`plan.zip`), une adresse e-mail, un nombre décimal. La ponctuation finale
 * `.,;:!?)]}'"` est retirée du lien.
 *
 * Une autorité qui s'arrête sur `"`, `<`, `>` ou un accent grave est lue de
 * deux façons. Un logiciel strict coupe le lien au délimiteur. Un logiciel
 * large, comme l'analyseur WHATWG, le prolonge jusqu'au `/` : si un `@` suit,
 * l'hôte réel est après lui (`https://we.tl"@partagepro.online/x`). Dans ce
 * cas le lien couvre toute la lecture large, et son identifiant le rend
 * non autorisé.
 *
 * @param {string} text
 * @returns {FoundLink[]}
 */
export function findLinks(text) {
  if (typeof text !== 'string' || text === '') {
    return [];
  }

  const candidates = new RegExp(LINK_CANDIDATE.source, LINK_CANDIDATE.flags);
  const readWideAuthority = createWideAuthorityReader(text);
  /** @type {FoundLink[]} */
  const links = [];

  /** @type {RegExpExecArray | null} */
  let match;
  while ((match = candidates.exec(text)) !== null) {
    let end = candidates.lastIndex;
    const isAuthorityOnly = !AUTHORITY_END.test(match[0].replace(SCHEME_PREFIX, ''));
    if (isAuthorityOnly && STRICT_AUTHORITY_DELIMITERS.has(text[end])) {
      const wide = readWideAuthority(end);
      if (wide.lastAt !== -1) {
        PATH_AFTER_AUTHORITY.lastIndex = wide.end;
        PATH_AFTER_AUTHORITY.exec(text);
        end = PATH_AFTER_AUTHORITY.lastIndex;
        candidates.lastIndex = end;
      }
    }

    const candidate = text.slice(match.index, end);
    const leading = /** @type {RegExpExecArray} */ (LEADING_JUNK.exec(candidate))[0].length;
    const link = toLink(trimTrailingPunctuation(candidate.slice(leading)), match.index + leading);
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

/**
 * Un lien trouvé par `findLinks` est autorisé si son hôte l'est et s'il a une
 * URL utilisable (`href` non vide). À utiliser plutôt que `isAllowedHost`
 * seul, avant de rendre un lien cliquable.
 *
 * @param {Pick<FoundLink, 'href' | 'host'>} link
 * @param {readonly string[]} [extraAllowedHosts]
 * @returns {boolean}
 */
export function isAllowedLink(link, extraAllowedHosts = []) {
  return link.href !== '' && isAllowedHost(link.host, extraAllowedHosts);
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
      linkNotAllowed ||= !isAllowedLink(link, extraAllowedHosts);
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
