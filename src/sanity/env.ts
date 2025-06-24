// Configuration des variables d'environnement pour Sanity
// Gestion intelligente entre développement et production

export const apiVersion =
    process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2025-06-03';

export const dataset = assertValue(
    process.env.NEXT_PUBLIC_SANITY_DATASET || process.env.SANITY_DATASET,
    'Missing environment variable: NEXT_PUBLIC_SANITY_DATASET or SANITY_DATASET'
);

export const projectId = assertValue(
    process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || process.env.SANITY_PROJECT_ID,
    'Missing environment variable: NEXT_PUBLIC_SANITY_PROJECT_ID or SANITY_PROJECT_ID'
);

// Variables d'environnement côté serveur uniquement
export const readToken = process.env.SANITY_API_READ_TOKEN;
export const writeToken = process.env.SANITY_API_WRITE_TOKEN;

// Détection de l'environnement
export const isDevelopment = process.env.NODE_ENV === 'development';
export const isProduction = process.env.NODE_ENV === 'production';
export const isPreview = process.env.VERCEL_ENV === 'preview';

// URL de base Sanity
export const sanityUrl = `https://${projectId}.api.sanity.io/v${apiVersion}/data/query/${dataset}`;

// Helper pour déterminer si on utilise le token
export const shouldUseToken = () => {
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

function assertValue<T>(v: T | undefined, errorMessage: string): T {
    if (v === undefined) {
        throw new Error(errorMessage);
    }

    return v;
}
