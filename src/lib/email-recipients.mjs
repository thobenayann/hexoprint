/**
 * Choix des destinataires des mails admin selon l'environnement de déploiement.
 *
 * Module pur : aucune dépendance, aucun accès à `process.env`. L'appelant passe
 * l'objet d'environnement, ce qui permet de le tester avec des jeux de données.
 */

/** @typedef {'production' | 'preview' | 'development' | 'test'} DeployEnv */

/** @typedef {Record<string, string | undefined>} EnvLike */

const DEPLOY_LABELS = {
  production: 'production',
  preview: 'preview',
  development: 'développement',
  test: 'test',
};

/**
 * @param {string | undefined} value
 * @returns {string}
 */
function clean(value) {
  return typeof value === 'string' ? value.trim() : '';
}

/**
 * Environnement de déploiement :
 * - `NODE_ENV=test` reste le mode test.
 * - Sur Vercel, `VERCEL_ENV` fait foi (`production`, `preview` ou `development`).
 *   Une valeur inconnue est traitée comme `preview`, le cas où le gérant ne
 *   reçoit jamais de mail.
 * - `VERCEL_ENV=development` avec `NODE_ENV=production` (un `vercel build` sur la
 *   cible development) est aussi traité comme `preview`. Le service d'envoi
 *   choisit son mode d'après `NODE_ENV` seul, donc il enverrait de vrais mails :
 *   ils ne doivent aller qu'à `EMAIL_TO_ADMIN`.
 * - Hors Vercel, `NODE_ENV=production` vaut production, le reste vaut développement.
 *
 * @param {EnvLike} env
 * @returns {DeployEnv}
 */
export function resolveDeployEnv(env) {
  if (env.NODE_ENV === 'test') return 'test';

  const vercelEnv = clean(env.VERCEL_ENV);
  if (vercelEnv === 'development') {
    return env.NODE_ENV === 'production' ? 'preview' : 'development';
  }
  if (vercelEnv === 'production') return 'production';
  if (vercelEnv) return 'preview';

  return env.NODE_ENV === 'production' ? 'production' : 'development';
}

/**
 * Destinataires des mails admin.
 *
 * - production : `EMAIL_TO` (obligatoire), puis `EMAIL_TO_ADMIN` s'il est défini.
 * - preview : `EMAIL_TO_ADMIN` (obligatoire) seul. `EMAIL_TO` n'est jamais lu,
 *   pour que le gérant ne reçoive aucun mail d'essai.
 * - développement et test : aucune variable obligatoire. `EMAIL_TO` est repris
 *   s'il est défini.
 *
 * @param {EnvLike} env
 * @returns {string[]}
 * @throws {Error} Si la variable obligatoire de l'environnement est absente ou vide.
 */
export function resolveAdminRecipients(env) {
  const deployEnv = resolveDeployEnv(env);
  const emailTo = clean(env.EMAIL_TO);
  const emailToAdmin = clean(env.EMAIL_TO_ADMIN);

  if (deployEnv === 'production') {
    if (!emailTo) {
      throw new Error(missingMessage('EMAIL_TO', deployEnv, 'adresse de réception du gérant'));
    }
    return emailToAdmin ? [emailTo, emailToAdmin] : [emailTo];
  }

  if (deployEnv === 'preview') {
    if (!emailToAdmin) {
      throw new Error(
        missingMessage(
          'EMAIL_TO_ADMIN',
          deployEnv,
          'seul destinataire des mails de test, le gérant n\'en reçoit jamais',
          rawOrigin(env)
        )
      );
    }
    return [emailToAdmin];
  }

  return emailTo ? [emailTo] : [];
}

/**
 * Valeur brute de `VERCEL_ENV` quand elle n'est pas `preview` mais que
 * l'environnement est traité comme tel (valeur inconnue, ou development en
 * mode production). Aide au diagnostic dans le message d'erreur.
 *
 * @param {EnvLike} env
 * @returns {string}
 */
function rawOrigin(env) {
  const vercelEnv = clean(env.VERCEL_ENV);
  if (!vercelEnv || vercelEnv === 'preview') return '';
  return vercelEnv === 'development'
    ? 'VERCEL_ENV=development avec NODE_ENV=production'
    : `VERCEL_ENV=${vercelEnv}`;
}

/**
 * @param {string} name
 * @param {DeployEnv} deployEnv
 * @param {string} role
 * @param {string} [origin]
 * @returns {string}
 */
function missingMessage(name, deployEnv, role, origin = '') {
  const label = DEPLOY_LABELS[deployEnv];
  const details = origin ? `${origin} : ${role}` : role;
  return `${name} est requis en ${label} (${details}). Définissez-le dans les variables d'environnement Vercel de l'environnement ${label}.`;
}
