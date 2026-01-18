// Note: next-sanity@12+ utilise une approche différente pour le contenu live
// L'API defineLive a été remplacée par Visual Editing et Loaders APIs
// Pour l'instant, nous fournissons un wrapper simple qui utilise le client Sanity standard
import { client, isSanityAvailable } from './client';

// Type pour les options de sanityFetch
type SanityFetchOptions = {
    query: string;
    params?: Record<string, unknown>;
    tags?: string[];
};

// Type pour le retour de sanityFetch
type SanityFetchResult<T> = {
    data: T | null;
};

// Fonction de fallback qui retourne des données vides
const createFallbackSanityFetch = () => {
    return async function fallbackSanityFetch<T>(
        options: SanityFetchOptions
    ): Promise<SanityFetchResult<T>> {
        console.warn(
            `[Sanity] sanityFetch appelé sans configuration Sanity pour la requête: ${options.query.slice(0, 50)}...`
        );
        return { data: null };
    };
};

// Composant de fallback pour SanityLive (conservé pour rétrocompatibilité)
const FallbackSanityLive = () => {
    return null;
};

// Configuration conditionnelle
let sanityFetch: <T>(
    options: SanityFetchOptions
) => Promise<SanityFetchResult<T>>;
let SanityLive: React.ComponentType;

if (isSanityAvailable() && client) {
    const sanityClient = client; // Capture du client pour éviter les problèmes de null
    
    // Utilisation du client Sanity standard pour le fetching
    sanityFetch = async function <T>(
        options: SanityFetchOptions
    ): Promise<SanityFetchResult<T>> {
        try {
            const data = await sanityClient.fetch<T>(
                options.query,
                options.params || {},
                {
                    cache: 'force-cache',
                    next: {
                        tags: options.tags || [],
                    },
                }
            );
            return { data };
        } catch (error) {
            console.error('[Sanity] Erreur lors du fetch:', error);
            return { data: null };
        }
    };
    
    // Pour le contenu live, utilisez la nouvelle approche Visual Editing
    // Voir: https://www.sanity.io/docs/visual-editing
    SanityLive = FallbackSanityLive;
} else {
    // Fallback si Sanity n'est pas configuré
    sanityFetch = createFallbackSanityFetch();
    SanityLive = FallbackSanityLive;
}

export { sanityFetch, SanityLive };
