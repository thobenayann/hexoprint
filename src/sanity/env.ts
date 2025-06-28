// Configuration des variables d'environnement pour Sanity
// Gestion intelligente entre développement et production

export const apiVersion =
    process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2025-06-03';

// Gestion robuste avec fallbacks
export const dataset = getEnvironmentValue(
    [process.env.NEXT_PUBLIC_SANITY_DATASET, process.env.SANITY_DATASET],
    'dev' // fallback par défaut
);

export const projectId = getEnvironmentValue(
    [process.env.NEXT_PUBLIC_SANITY_PROJECT_ID, process.env.SANITY_PROJECT_ID],
    null // pas de fallback - requis
);

// Variables d'environnement côté serveur uniquement
export const readToken = process.env.SANITY_API_READ_TOKEN;
export const writeToken = process.env.SANITY_API_WRITE_TOKEN;

// Détection de l'environnement
export const isDevelopment = process.env.NODE_ENV === 'development';
export const isProduction = process.env.NODE_ENV === 'production';
export const isPreview = process.env.VERCEL_ENV === 'preview';

// Vérification de la configuration Sanity
export const isSanityConfigured = () => {
    return !!(projectId && dataset);
};

// URL de base Sanity (seulement si configuré)
export const sanityUrl = projectId
    ? `https://${projectId}.api.sanity.io/v${apiVersion}/data/query/${dataset}`
    : null;

// Helper pour déterminer si on utilise le token
export const shouldUseToken = () => {
    if (!isSanityConfigured()) return false;

    // En développement, utilise le token si disponible
    if (isDevelopment) return !!readToken;

    // En production, utilise toujours le token si disponible pour les performances
    return !!readToken;
};

// Helper pour obtenir le bon dataset selon l'environnement
export const getDataset = () => {
    if (isProduction) return 'production';
    if (isPreview) return 'production'; // ou 'staging' si vous en avez un
    return 'dev';
};

// Helper pour obtenir une valeur d'environnement avec fallback
function getEnvironmentValue(
    sources: (string | undefined)[],
    fallback: string | null
): string | null {
    for (const source of sources) {
        if (source && source.trim()) {
            return source.trim();
        }
    }

    if (fallback !== null) {
        console.warn(
            `[Sanity] Variables d'environnement manquantes, utilisation du fallback: ${fallback}`
        );
        return fallback;
    }

    return null;
}

// Version améliorée de assertValue qui ne throw pas en production
function assertValue<T>(v: T | undefined, errorMessage: string): T {
    if (v === undefined) {
        if (isProduction || isPreview) {
            // En production/preview, log l'erreur mais ne crash pas
            console.error(`[Sanity Error] ${errorMessage}`);
            // Retourner une valeur par défaut ou null selon le contexte
            return '' as T;
        } else {
            // En développement, throw l'erreur pour alerter le développeur
            throw new Error(errorMessage);
        }
    }

    return v;
}
