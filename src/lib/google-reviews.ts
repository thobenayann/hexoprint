// Types pour les avis Google Places
export interface GoogleReview {
    author_name: string;
    author_url?: string;
    language: string;
    profile_photo_url?: string;
    rating: number;
    relative_time_description: string;
    text: string;
    time: number;
}

export interface GooglePlaceDetails {
    place_id: string;
    name: string;
    formatted_address: string;
    rating: number;
    user_ratings_total: number;
    reviews: GoogleReview[];
}

export interface GooglePlacesApiResponse {
    result: GooglePlaceDetails;
    status: string;
}

// Types pour notre application (transformés)
export interface HexoprintTestimonial {
    id: string;
    name: string;
    role?: string;
    company: string;
    content: string;
    rating: number;
    category: 'Professionnel' | 'Particulier';
    avatar?: string;
    date: string;
    isVerifiedGoogle?: boolean;
}

/**
 * Service pour récupérer les avis Google Business
 */
export class GoogleReviewsService {
    private static readonly API_BASE =
        'https://maps.googleapis.com/maps/api/place/details/json';

    /**
     * Récupère les avis depuis l'API Google Places
     */
    static async fetchGoogleReviews(
        placeId: string
    ): Promise<HexoprintTestimonial[]> {
        try {
            const apiKey = process.env.GOOGLE_PLACES_API_KEY;

            if (!apiKey) {
                throw new Error('GOOGLE_PLACES_API_KEY manquante');
            }

            const fields =
                'place_id,name,formatted_address,rating,user_ratings_total,reviews';
            const url = `${this.API_BASE}?place_id=${placeId}&fields=${fields}&key=${apiKey}&language=fr`;

            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`Erreur API Google Places: ${response.status}`);
            }

            const data: GooglePlacesApiResponse = await response.json();

            if (data.status !== 'OK') {
                throw new Error(`Statut API Google Places: ${data.status}`);
            }

            return this.transformGoogleReviewsToTestimonials(
                data.result.reviews || []
            );
        } catch (error) {
            console.error(
                'Erreur lors de la récupération des avis Google:',
                error
            );
            throw error;
        }
    }

    /**
     * Transforme les avis Google en format Hexoprint
     */
    private static transformGoogleReviewsToTestimonials(
        reviews: GoogleReview[]
    ): HexoprintTestimonial[] {
        return reviews
            .filter((review) => review.rating >= 4) // Seulement les avis 4-5 étoiles
            .map((review, index) => {
                const inferredRole = this.inferRoleFromReview(review.text);
                return {
                    id: `google-${review.time}-${index}`,
                    name: review.author_name,
                    role:
                        inferredRole !== 'Client satisfait'
                            ? inferredRole
                            : undefined, // Rôle optionnel
                    company: this.inferCompanyTypeFromReview(review.text),
                    content: this.cleanReviewText(review.text),
                    rating: review.rating,
                    category: this.categorizeReview(review.text),
                    avatar: review.profile_photo_url,
                    date: this.formatRelativeTime(
                        review.relative_time_description
                    ),
                    isVerifiedGoogle: true,
                };
            })
            .slice(0, 6); // Limite à 6 avis maximum
    }

    /**
     * Nettoie et formate le texte de l'avis
     */
    private static cleanReviewText(text: string): string {
        // Limite la longueur et nettoie le texte
        let cleaned = text.trim();

        if (cleaned.length > 200) {
            cleaned = cleaned.substring(0, 200).trim() + '...';
        }

        return cleaned;
    }

    /**
     * Infère le rôle à partir du contenu de l'avis
     */
    private static inferRoleFromReview(text: string): string {
        const lowerText = text.toLowerCase();

        if (
            lowerText.includes('entreprise') ||
            lowerText.includes('société') ||
            lowerText.includes('professionnel')
        ) {
            return 'Responsable production';
        }
        if (
            lowerText.includes('ingénieur') ||
            lowerText.includes('technique')
        ) {
            return 'Ingénieur R&D';
        }
        if (
            lowerText.includes('modélisme') ||
            lowerText.includes('figurine') ||
            lowerText.includes('collection')
        ) {
            return 'Passionné de modélisme';
        }
        if (
            lowerText.includes('design') ||
            lowerText.includes('créatif') ||
            lowerText.includes('création')
        ) {
            return 'Designer produit';
        }

        return 'Client satisfait';
    }

    /**
     * Infère le type d'entreprise/client à partir du contenu
     */
    private static inferCompanyTypeFromReview(text: string): string {
        const lowerText = text.toLowerCase();

        if (lowerText.includes('entreprise') || lowerText.includes('société')) {
            return 'Entreprise';
        }
        if (lowerText.includes('professionnel')) {
            return 'Professionnel';
        }

        return 'Particulier';
    }

    /**
     * Catégorise l'avis (Professionnel/Particulier)
     */
    private static categorizeReview(
        text: string
    ): 'Professionnel' | 'Particulier' {
        const lowerText = text.toLowerCase();

        const professionalKeywords = [
            'entreprise',
            'société',
            'professionnel',
            'industrie',
            'production',
            'prototype',
            'r&d',
            'technique',
            'spécification',
            'délai',
        ];

        const hasProKeywords = professionalKeywords.some((keyword) =>
            lowerText.includes(keyword)
        );

        return hasProKeywords ? 'Professionnel' : 'Particulier';
    }

    /**
     * Formate la description du temps relatif
     */
    private static formatRelativeTime(relativeTime: string): string {
        // Convertit "il y a X jours/mois/années" en format lisible
        return relativeTime.replace('il y a ', 'Il y a ');
    }
}
