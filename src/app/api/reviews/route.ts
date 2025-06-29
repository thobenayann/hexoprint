import {
    GoogleReviewsService,
    type HexoprintTestimonial,
} from '@/lib/google-reviews';
import { NextResponse } from 'next/server';

// Cache des avis (évite les appels API répétés)
let cachedReviews: HexoprintTestimonial[] | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 60 * 60 * 1000; // 1 heure en millisecondes

// Avis de fallback (vrais témoignages clients)
const fallbackTestimonials: HexoprintTestimonial[] = [
    {
        id: 'fallback-1',
        name: 'Dorian C.',
        role: 'Propriétaire camping-car',
        company: 'Particulier',
        content:
            "J'ai eu recours à Hexo'print pour la réalisation d'une pièce de remplacement pour un meuble camping car. Très bon contact, service au top (reprise du fichier STL qui n'était pas parfait, plusieurs échanges pour s'assurer de la bonne réalisation,...), impression et envoi à tarif plus que correct. Et la pièce remplie parfaitement son rôle. Je recommande vivement !",
        rating: 5,
        category: 'Particulier',
        date: 'Il y a 2 ans',
        isVerifiedGoogle: false,
    },
    {
        id: 'fallback-2',
        name: 'Dany Mace',
        role: 'Passionné automobile',
        company: 'Particulier',
        content:
            'Fabrication de cache pour bas de caisse automobile. Entreprise très sérieuse je conseille les yeux fermés encore merci à bientôt',
        rating: 5,
        category: 'Particulier',
        date: 'Il y a 3 ans',
        isVerifiedGoogle: false,
    },
    {
        id: 'fallback-3',
        name: 'Alice Mi',
        role: 'Local Guide',
        company: 'Google Local Guide',
        content: 'Le patron est sympa !',
        rating: 5,
        category: 'Particulier',
        date: 'Il y a 3 ans',
        isVerifiedGoogle: false,
    },
];

export async function GET() {
    try {
        // Vérifier le cache
        const now = Date.now();
        if (cachedReviews && now - cacheTimestamp < CACHE_DURATION) {
            return NextResponse.json({
                success: true,
                reviews: cachedReviews,
                source: 'cache',
            });
        }

        // Récupérer le Place ID depuis les variables d'environnement
        const placeId = process.env.HEXOPRINT_PLACE_ID;

        if (!placeId) {
            console.warn(
                'HEXOPRINT_PLACE_ID non configuré, utilisation des avis de fallback'
            );
            return NextResponse.json({
                success: true,
                reviews: fallbackTestimonials,
                source: 'fallback',
                reason: 'missing_place_id',
            });
        }

        try {
            // Tenter de récupérer les vrais avis Google
            const googleReviews =
                await GoogleReviewsService.fetchGoogleReviews(placeId);

            if (googleReviews.length === 0) {
                // Aucun avis trouvé, utiliser le fallback
                return NextResponse.json({
                    success: true,
                    reviews: fallbackTestimonials,
                    source: 'fallback',
                    reason: 'no_reviews_found',
                });
            }

            // Mélanger les vrais avis avec quelques fallbacks si nécessaire
            const mixedReviews = [...googleReviews];

            // Si on a moins de 4 avis Google, compléter avec des fallbacks
            if (googleReviews.length < 4) {
                const neededFallbacks = 4 - googleReviews.length;
                mixedReviews.push(
                    ...fallbackTestimonials.slice(0, neededFallbacks)
                );
            }

            // Mettre à jour le cache
            cachedReviews = mixedReviews;
            cacheTimestamp = now;

            return NextResponse.json({
                success: true,
                reviews: mixedReviews,
                source: 'google',
                googleCount: googleReviews.length,
                fallbackCount: mixedReviews.length - googleReviews.length,
            });
        } catch (googleError) {
            console.error(
                'Erreur lors de la récupération des avis Google:',
                googleError
            );

            // En cas d'erreur avec l'API Google, utiliser les avis de fallback
            return NextResponse.json({
                success: true,
                reviews: fallbackTestimonials,
                source: 'fallback',
                reason: 'google_api_error',
                error:
                    googleError instanceof Error
                        ? googleError.message
                        : 'Erreur inconnue',
            });
        }
    } catch (error) {
        console.error("Erreur dans l'API reviews:", error);

        // En cas d'erreur totale, retourner les avis de fallback
        return NextResponse.json(
            {
                success: true,
                reviews: fallbackTestimonials,
                source: 'fallback',
                reason: 'api_error',
            },
            { status: 200 }
        ); // 200 pour éviter d'afficher une erreur à l'utilisateur
    }
}

// Configuration pour la route API
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
