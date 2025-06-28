// Querying with "sanityFetch" will keep content automatically updated
// Before using it, import and render "<SanityLive />" in your layout, see
// https://github.com/sanity-io/next-sanity#live-content-api for more information.
import { defineLive } from 'next-sanity';
import { client, isSanityAvailable } from './client';

// Fonction de fallback qui retourne des données vides
const createFallbackSanityFetch = () => {
    return async function fallbackSanityFetch<T>(options: {
        query: string;
        params?: any;
        tags?: string[];
    }): Promise<{ data: T | null }> {
        console.warn(
            '[Sanity] sanityFetch appelé sans configuration Sanity, retour de données vides'
        );
        return { data: null };
    };
};

// Composant de fallback pour SanityLive
const FallbackSanityLive = () => {
    if (process.env.NODE_ENV === 'development') {
        console.warn(
            '[Sanity] SanityLive désactivé - configuration Sanity manquante'
        );
    }
    return null;
};

// Configuration conditionnelle
let sanityFetch: any;
let SanityLive: any;

if (isSanityAvailable() && client) {
    try {
        const liveConfig = defineLive({
            client: client.withConfig({
                // Live content is currently only available on the experimental API
                // https://www.sanity.io/docs/api-versioning
                apiVersion: 'vX',
            }),
            serverToken: process.env.SANITY_API_READ_TOKEN,
            browserToken: process.env.NEXT_PUBLIC_SANITY_BROWSER_TOKEN,
        });

        sanityFetch = liveConfig.sanityFetch;
        SanityLive = liveConfig.SanityLive;
    } catch (error) {
        console.error(
            '[Sanity] Erreur lors de la configuration de defineLive:',
            error
        );
        sanityFetch = createFallbackSanityFetch();
        SanityLive = FallbackSanityLive;
    }
} else {
    // Fallback si Sanity n'est pas configuré
    sanityFetch = createFallbackSanityFetch();
    SanityLive = FallbackSanityLive;
}

export { sanityFetch, SanityLive };
