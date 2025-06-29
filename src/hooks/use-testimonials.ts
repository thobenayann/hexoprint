'use client';

import { type HexoprintTestimonial } from '@/lib/google-reviews';
import { useEffect, useState } from 'react';

interface UseTestimonialsResult {
    testimonials: HexoprintTestimonial[];
    isLoading: boolean;
    error: string | null;
    isGoogleSource: boolean;
    retry: () => void;
}

interface ApiResponse {
    success: boolean;
    reviews: HexoprintTestimonial[];
    source: 'google' | 'cache' | 'fallback';
    googleCount?: number;
    fallbackCount?: number;
    reason?: string;
    error?: string;
}

export function useTestimonials(): UseTestimonialsResult {
    const [testimonials, setTestimonials] = useState<HexoprintTestimonial[]>(
        []
    );
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isGoogleSource, setIsGoogleSource] = useState(false);

    const fetchTestimonials = async () => {
        try {
            setIsLoading(true);
            setError(null);

            const response = await fetch('/api/reviews', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(
                    `Erreur ${response.status}: ${response.statusText}`
                );
            }

            const data: ApiResponse = await response.json();

            if (!data.success) {
                throw new Error('Erreur lors de la récupération des avis');
            }

            setTestimonials(data.reviews);
            setIsGoogleSource(
                data.source === 'google' || data.source === 'cache'
            );

            // Log pour le développement (peut être retiré en production)
            if (process.env.NODE_ENV === 'development') {
                console.log('📊 Avis récupérés:', {
                    source: data.source,
                    total: data.reviews.length,
                    googleCount: data.googleCount || 0,
                    fallbackCount: data.fallbackCount || 0,
                    reason: data.reason || 'success',
                });
            }
        } catch (err) {
            console.error('Erreur lors de la récupération des avis:', err);
            setError(err instanceof Error ? err.message : 'Erreur inconnue');

            // En cas d'erreur complète, on peut afficher des avis par défaut
            setTestimonials([]);
        } finally {
            setIsLoading(false);
        }
    };

    const retry = () => {
        fetchTestimonials();
    };

    useEffect(() => {
        fetchTestimonials();
    }, []);

    return {
        testimonials,
        isLoading,
        error,
        isGoogleSource,
        retry,
    };
}
