// Délai maximal d'une requête du navigateur vers nos routes API.
export const REQUEST_TIMEOUT_MS = 20_000;

// Lit le corps JSON sans jamais lever : une réponse qui n'est pas du JSON (page
// d'erreur du pare-feu, d'un proxy ou de la plateforme) donne `null`, pas une
// SyntaxError que le visiteur verrait telle quelle.
async function readJsonBody(response) {
  try {
    const parsed = await response.json();
    return parsed !== null && typeof parsed === 'object' ? parsed : null;
  } catch {
    return null;
  }
}

/**
 * Envoie la requête et lit sa réponse, avec un délai maximal.
 *
 * Le `fetch` du navigateur est enveloppé par BotID : il attend d'abord le
 * script de défi, et ces attentes ne répondent pas à un AbortSignal. D'où la
 * course avec un minuteur qui rejette, en plus de l'annulation de la requête.
 * Le minuteur est toujours arrêté, que la requête aboutisse ou non.
 *
 * Rejette si la requête échoue avant toute réponse (réseau, script BotID
 * bloqué, délai dépassé). Le motif du rejet est parfois un Event et non une
 * Error : l'appelant ne doit pas s'en servir comme message.
 *
 * @param {string} url
 * @param {RequestInit} init
 * @param {number} [timeoutMs]
 * @returns {Promise<{ response: Response, body: Record<string, unknown> | null }>}
 */
export async function fetchJsonWithTimeout(
  url,
  init,
  timeoutMs = REQUEST_TIMEOUT_MS
) {
  const controller = new AbortController();
  let timer;
  const timeout = new Promise((_resolve, reject) => {
    timer = setTimeout(() => {
      reject(new Error(`Aucune réponse après ${timeoutMs} ms`));
      controller.abort();
    }, timeoutMs);
  });
  const exchange = (async () => {
    const response = await fetch(url, { ...init, signal: controller.signal });
    return { response, body: await readJsonBody(response) };
  })();

  try {
    return await Promise.race([exchange, timeout]);
  } finally {
    clearTimeout(timer);
  }
}
