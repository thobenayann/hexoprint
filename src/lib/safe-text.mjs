/**
 * Affichage sûr d'un texte saisi par un visiteur, pour le mail d'administration :
 * un lien inconnu ou un domaine nu devient du texte « désamorcé »
 * (`hxxps://partagepro[.]online/fr`), que ni la messagerie ni l'œil pressé ne
 * prennent pour un lien. Module pur (aucune entrée-sortie), importé par les
 * gabarits de mail et testé seul par `node --test`.
 *
 * Le repérage des liens vient de `contact-screening.mjs` : le mail et le tri
 * lisent le texte avec les mêmes règles.
 *
 * @typedef {{ kind: 'text'; value: string }} TextSegment
 * @typedef {{ kind: 'link'; value: string; href: string }} LinkSegment
 * @typedef {TextSegment | LinkSegment} SafeSegment
 *
 * @typedef {object} SafeTextOptions
 * @property {boolean} allowLinks Si faux, rien n'est cliquable : tout lien et
 *   tout domaine nu est désamorcé, même vers un hôte autorisé.
 * @property {readonly string[]} [extraAllowedHosts] Hôtes ajoutés par la
 *   configuration, par exemple celui du store Blob du projet.
 */

import { findLinks, isAllowedHost, isAllowedLink } from './contact-screening.mjs';

// `http`, `https`, puis `:` et les `/` ou `\` qui le suivent (`https:/` et
// `https:\\` sont lus comme des liens par les navigateurs). Le `:` est exigé :
// `httpbin.org/get` n'a pas de schéma.
const SCHEME_AND_SEPARATOR = /^(https?)(:[\/\\]*)/i;
const AUTHORITY_END = /[\/?#\\]/;

// Un mot de schéma suivi de `:` et de deux `/` ou `\` (`ftp://`, `sftp://`,
// `file://`, `smb://`, `1ftp://`), ou `http(s)` suivi d'un seul (`https:/`).
// Le mot de schéma ne démarre qu'au début d'une suite de caractères de schéma :
// sans ce regard arrière, chaque lettre d'un long mot relancerait la lecture
// de tout le mot (temps quadratique). Un chemin Windows (`C:\Modeles`) n'a
// qu'un séparateur, il n'est pas touché.
const SCHEME_WORD = /(?<![a-z0-9+-])[a-z0-9+-]+(?=:[\/\\]{2})|http(?:s?)(?=:[\/\\])/gi;
const ENDS_WITH_HTTP = /https?$/i;

/**
 * Le mot de schéma sous sa forme désamorcée : `http` devient `hxxp`, tout autre
 * schéma perd sa dernière lettre au profit d'un `x` (`ftp` devient `ftx`). Les
 * deux sont stables : on peut désamorcer deux fois sans rien changer de plus.
 * Le `:` et les `/` qui suivent restent, ce qui empêche aussi qu'une
 * messagerie lise le `//` seul comme un lien sans schéma.
 *
 * @param {string} word
 */
function defangSchemeWord(word) {
  if (/hxxps?$/i.test(word)) {
    return word;
  }
  const http = ENDS_WITH_HTTP.exec(word);
  if (http) {
    return `${word.slice(0, http.index)}hxxp${http[0].slice('http'.length).toLowerCase()}`;
  }
  return `${word.slice(0, -1)}x`;
}

/**
 * Désamorce tout schéma qui reste écrit dans un texte, sans hôte derrière lui
 * pour `findLinks` : `https://https://x.online` (le premier ne mène nulle part),
 * mais aussi `ftp://203.0.113.7/plan.zip` ou `file://serveur/dossier`, que
 * `findLinks` ne compte pas comme liens et qu'une messagerie rend cliquables.
 *
 * @param {string} text
 */
function defangStraySchemes(text) {
  return text.replace(SCHEME_WORD, defangSchemeWord);
}

/**
 * Désamorce un lien : `http` devient `hxxp` (le `s` reste), chaque `.` de
 * l'autorité (identifiant, hôte et port) devient `[.]`, le chemin est inchangé.
 * Accepte un lien sans schéma (`sharez.online/fr/x`) et tout ce que renvoie
 * `findLinks` dans `raw`, majuscules comprises.
 *
 * Le schéma de tête n'est plus écrit `http` et l'hôte n'est plus écrit en clair :
 * une messagerie qui rend les liens cliquables n'a rien à saisir. Un `http://`
 * caché plus loin dans l'autorité ou dans le chemin est traité par
 * `toSafeSegments`, pas ici.
 *
 * @param {string} raw
 * @returns {string}
 */
export function defang(raw) {
  const scheme = SCHEME_AND_SEPARATOR.exec(raw);
  const head = scheme ? `hxxp${scheme[1].slice('http'.length).toLowerCase()}${scheme[2]}` : '';
  const rest = scheme ? raw.slice(scheme[0].length) : raw;

  const authorityEnd = rest.search(AUTHORITY_END);
  const authority = authorityEnd === -1 ? rest : rest.slice(0, authorityEnd);
  const path = authorityEnd === -1 ? '' : rest.slice(authorityEnd);
  return head + authority.replace(/\./g, '[.]') + path;
}

/*
 * Domaines nus : `mot.lettres` sans schéma ni chemin (`truc.online`), que
 * `findLinks` ne renvoie pas mais que Gmail et Outlook rendent cliquables.
 *
 * On lit des « suites » : les plus longues séries de lettres, chiffres, `_`,
 * `-` et `.`. Une suite est un domaine si elle contient un point entre un
 * caractère de domaine et au moins deux lettres (`truc.online`, `a.b.co`), ce
 * qui écarte `2.5`, `0.4mm`, `1.2.3-beta`, `a.b` et la fin de phrase `ok. Oui`.
 * Tous ses points entre deux caractères de domaine deviennent `[.]`.
 *
 * Une suite de nombres séparés par des points, au moins quatre
 * (`203.0.113.7`), est traitée de la même façon : c'est une adresse IP, que
 * Gmail rend cliquable derrière `ftp://` et que Windows ouvre dans un chemin
 * `\\203.0.113.7\partage`. Elle n'a pas de lettres, `HAS_TLD_LIKE_LABEL` ne la
 * voit pas. `v1.2.3.4` et `2.5` ne sont pas concernés (lettre devant, ou moins
 * de quatre nombres).
 *
 * Pourquoi c'est linéaire :
 * - une suite est maximale, donc deux suites ne se recouvrent jamais.
 * - chaque test d'une suite lit chaque caractère un nombre borné de fois
 *   (aucune répétition n'en contient une autre, les regards avant et arrière
 *   lisent un seul caractère, et `DOTTED_NUMBERS` s'arrête à son premier
 *   succès).
 * - le reste (adresse e-mail, hôte autorisé) lit au plus huit caractères autour
 *   de la suite, ou la suite voisine.
 */
const DOMAIN_RUN = /[\p{L}\p{M}\p{N}_.-]+/gu;
const HAS_TLD_LIKE_LABEL = /[\p{L}\p{M}\p{N}_-]\.[\p{L}\p{M}]{2,}/u;
const DOTTED_NUMBERS = /(?<![\p{L}\p{M}\p{N}_])\d+(?:\.\d+){3,}(?![\p{L}\p{M}\p{N}_])/u;

/** @param {string} run */
function looksLikeDomain(run) {
  return HAS_TLD_LIKE_LABEL.test(run) || DOTTED_NUMBERS.test(run);
}
const DOT_BETWEEN_LABELS = /(?<=[\p{L}\p{M}\p{N}_-])\.(?=[\p{L}\p{M}\p{N}_-])/gu;
// Même définition que `findLinks` : un `@` ne marque une adresse e-mail que
// s'il suit une lettre ou un chiffre, avec au plus une marque combinante.
// `voir @partagepro.online` n'a pas de partie locale, ce n'est pas une adresse.
const ADDRESS_LOCAL_PART_BEFORE_AT = /[\p{L}\p{N}]\p{M}?@$/u;
const LOOKBEHIND_LENGTH = 8;

/**
 * @typedef {object} BareDomain
 * @property {number} start
 * @property {number} end Exclue.
 * @property {string} value La suite telle qu'écrite.
 */

/**
 * Domaines nus d'un texte, dans l'ordre. Les adresses e-mail sont écartées si
 * `skipAddresses` est vrai : dans un texte libre, `jean@exemple.fr` reste lisible.
 * Dans le chemin d'un lien, `x@evil.com` n'est pas une adresse, c'est un moyen
 * de cacher un domaine : on ne l'écarte pas.
 *
 * @param {string} text
 * @param {boolean} skipAddresses
 * @returns {BareDomain[]}
 */
function findBareDomains(text, skipAddresses) {
  const runs = [...text.matchAll(DOMAIN_RUN)];
  /** @type {BareDomain[]} */
  const domains = [];

  runs.forEach((run, index) => {
    const value = run[0];
    if (!looksLikeDomain(value)) {
      return;
    }
    const start = /** @type {number} */ (run.index);
    const end = start + value.length;

    if (skipAddresses) {
      // Domaine d'une adresse : `jean@exemple.fr`.
      const before = text.slice(Math.max(0, start - LOOKBEHIND_LENGTH), start);
      if (ADDRESS_LOCAL_PART_BEFORE_AT.test(before)) {
        return;
      }
      // Partie locale d'une adresse : `jean.dupont@exemple.fr`, à condition que
      // ce qui suit le `@` ressemble à un domaine. `partagepro.online@x` n'est
      // pas une adresse, et reste désamorcé.
      const next = runs[index + 1];
      if (text[end] === '@' && next && next.index === end + 1 && looksLikeDomain(next[0])) {
        return;
      }
    }
    domains.push({ start, end, value });
  });
  return domains;
}

/** @param {string} value */
function defangDomain(value) {
  return value.replace(DOT_BETWEEN_LABELS, '[.]');
}

/**
 * Désamorce les domaines nus d'un texte déjà désamorcé en tête : le chemin
 * d'un lien (`/x?u=evil.com`) peut en contenir, et `defang` le laisse intact.
 *
 * @param {string} text
 */
function defangBareDomains(text) {
  let output = '';
  let cursor = 0;
  for (const domain of findBareDomains(text, false)) {
    output += text.slice(cursor, domain.start) + defangDomain(domain.value);
    cursor = domain.end;
  }
  return output + text.slice(cursor);
}

/** @param {string} value */
function trimDots(value) {
  let start = 0;
  let end = value.length;
  while (start < end && value[start] === '.') start += 1;
  while (end > start && value[end - 1] === '.') end -= 1;
  return value.slice(start, end);
}

/**
 * Position du premier `)` ou `]` sans ouvrant devant lui, ou -1. Un couple
 * ouvrant et fermant à l'intérieur du lien (`/Objet_(2)`) n'est pas concerné.
 *
 * @param {string} raw
 */
function firstUnbalancedCloser(raw) {
  let parentheses = 0;
  let brackets = 0;
  for (let index = 0; index < raw.length; index += 1) {
    const char = raw[index];
    if (char === '(') {
      parentheses += 1;
    } else if (char === '[') {
      brackets += 1;
    } else if (char === ')') {
      if (parentheses === 0) return index;
      parentheses -= 1;
    } else if (char === ']') {
      if (brackets === 0) return index;
      brackets -= 1;
    }
  }
  return -1;
}

/**
 * Le segment cliquable d'un lien autorisé, ou `null` s'il ne doit pas l'être.
 *
 * Un `)` ou un `]` sans ouvrant met fin au lien pour une messagerie : dans
 * `(https://we.tl/x)evil.online`, `findLinks` garde `evil.online` dans le chemin
 * (la parenthèse est un caractère de chemin), mais Gmail termine l'URL à la
 * parenthèse et rend `evil.online` cliquable à part. Le lien s'arrête donc au
 * premier fermant sans ouvrant, et ce qui suit redevient du texte ordinaire,
 * traité comme tel (domaines, schémas). Si le début du lien ne se relit pas
 * comme un lien autorisé, on renonce au lien cliquable.
 *
 * @param {import('./contact-screening.mjs').FoundLink} link
 * @param {readonly string[]} extraAllowedHosts
 * @returns {LinkSegment | null}
 */
function toClickableLink(link, extraAllowedHosts) {
  if (!isAllowedLink(link, extraAllowedHosts)) {
    return null;
  }
  const closer = firstUnbalancedCloser(link.raw);
  if (closer === -1) {
    return { kind: 'link', value: link.raw, href: link.href };
  }

  // `findLinks` retire lui-même la ponctuation finale du début du lien.
  const head = findLinks(link.raw.slice(0, closer));
  if (head.length !== 1 || head[0].start !== 0 || !isAllowedLink(head[0], extraAllowedHosts)) {
    return null;
  }
  return { kind: 'link', value: head[0].raw, href: head[0].href };
}

/**
 * Découpe un texte en segments sûrs : du texte, et des liens cliquables. Un lien
 * ne devient un segment `link` que si `allowLinks` est vrai et si
 * `isAllowedLink` l'accepte (hôte autorisé, URL utilisable, pas d'identifiant) :
 * son `href` est celui de `findLinks`, et il s'arrête au premier `)` ou `]` sans
 * ouvrant. Tout autre lien devient du texte désamorcé, de même que tout domaine
 * nu non autorisé, toute adresse IP écrite avec des points et tout schéma
 * (`ftp://`) resté dans le texte, en mode `allowLinks` comme sans. Un domaine nu
 * autorisé reste tel qu'écrit, sauf si `allowLinks` est faux.
 *
 * Si tous les liens sont autorisés et qu'il n'y a ni autre domaine nu, ni IP, ni
 * schéma isolé, ni fermant sans ouvrant suivi d'un domaine, la concaténation des
 * `value` redonne exactement le texte d'origine.
 *
 * @param {string} text
 * @param {SafeTextOptions} options
 * @returns {SafeSegment[]}
 */
export function toSafeSegments(text, options) {
  const source = typeof text === 'string' ? text : '';
  if (source === '') {
    return [];
  }
  const allowLinks = options?.allowLinks === true;
  const extraAllowedHosts = options?.extraAllowedHosts ?? [];

  /** @type {Array<{ start: number; end: number; segment: SafeSegment }>} */
  const replacements = [];
  for (const link of findLinks(source)) {
    const clickable = allowLinks ? toClickableLink(link, extraAllowedHosts) : null;
    if (clickable) {
      // Un lien raccourci laisse son reste dans le texte : il sera relu plus bas.
      replacements.push({ start: link.start, end: link.start + clickable.value.length, segment: clickable });
    } else {
      replacements.push({
        start: link.start,
        end: link.end,
        segment: { kind: 'text', value: defangBareDomains(defangStraySchemes(defang(link.raw))) },
      });
    }
  }
  const linkCount = replacements.length;

  // Hors des liens, aucun schéma ne reste écrit. Les positions ne changent pas :
  // `hxxp` a la longueur de `http`, et `ftx` celle de `ftp`.
  const base = defangStraySchemes(source);

  // Les domaines nus se cherchent dans le texte où chaque lien est remplacé par
  // des espaces (mêmes positions) : une suite collée à un lien (`evil.com`
  // dans `evil.comhttps://x.online/`) s'arrête à lui au lieu de lui être
  // rattachée, et ne lui échappe pas.
  let masked = '';
  let cursor = 0;
  for (const { start, end } of replacements.slice(0, linkCount)) {
    masked += base.slice(cursor, start) + ' '.repeat(end - start);
    cursor = end;
  }
  masked += base.slice(cursor);

  for (const domain of findBareDomains(masked, true)) {
    if (allowLinks && isAllowedHost(trimDots(domain.value), extraAllowedHosts)) {
      continue;
    }
    replacements.push({
      start: domain.start,
      end: domain.end,
      segment: { kind: 'text', value: defangDomain(domain.value) },
    });
  }
  replacements.sort((a, b) => a.start - b.start);

  /** @type {SafeSegment[]} */
  const segments = [];
  /** @param {string} value */
  const appendText = (value) => {
    if (value === '') {
      return;
    }
    const last = segments[segments.length - 1];
    if (last && last.kind === 'text') {
      last.value += value;
    } else {
      segments.push({ kind: 'text', value });
    }
  };

  cursor = 0;
  for (const { start, end, segment } of replacements) {
    appendText(base.slice(cursor, start));
    if (segment.kind === 'text') {
      appendText(segment.value);
    } else {
      segments.push(segment);
    }
    cursor = end;
  }
  appendText(base.slice(cursor));
  return segments;
}
