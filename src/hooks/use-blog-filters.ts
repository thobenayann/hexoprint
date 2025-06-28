'use client';

import { type ArticleCategory } from '@/types/blog';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { useMediaQuery } from './use-media-query';

// Types pour les filtres de blog
export type BlogCategoryFilter = ArticleCategory | 'all';

// Hook principal pour gérer les filtres du blog
export function useBlogFilters() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const isDesktop = useMediaQuery('(min-width: 768px)');

    const category =
        (searchParams.get('category') as BlogCategoryFilter) || 'all';

    // Fonction pour scroller vers la grille d'articles (uniquement en mobile)
    const scrollToBlogGrid = useCallback(() => {
        // Ne scroller qu'en mobile (écrans < 768px)
        if (isDesktop) return;

        // Chercher l'élément grille d'articles
        const blogGridElement = document.querySelector(
            '[data-blog-grid-section]'
        );
        if (blogGridElement) {
            // Calculer la position en tenant compte du header mobile sticky
            const headerHeight = 80; // Approximation de la hauteur du header mobile
            const elementTop =
                blogGridElement.getBoundingClientRect().top + window.scrollY;
            const targetPosition = elementTop - headerHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth',
            });
        }
    }, [isDesktop]);

    const setFilter = useCallback(
        (filterType: 'category' | 'all', value: string) => {
            const params = new URLSearchParams(searchParams.toString());

            if (filterType === 'all') {
                params.delete('category');
            } else if (filterType === 'category') {
                if (value === 'all') {
                    params.delete('category');
                } else {
                    params.set('category', value);
                }
            }

            router.push(`?${params.toString()}`, { scroll: false });

            // Scroller vers la grille d'articles après un court délai pour laisser l'URL se mettre à jour
            setTimeout(scrollToBlogGrid, 100);
        },
        [searchParams, router, scrollToBlogGrid]
    );

    const clearFilters = useCallback(() => {
        const params = new URLSearchParams();
        router.push(`?${params.toString()}`, { scroll: false });

        // Scroller vers la grille d'articles
        setTimeout(scrollToBlogGrid, 100);
    }, [router, scrollToBlogGrid]);

    return {
        category,
        setFilter,
        clearFilters,
    };
}

// Hook pour gérer le comportement sticky des filtres mobiles de blog
export function useBlogStickyFilters() {
    const [isSticky, setIsSticky] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            // Récupérer l'élément filters principal
            const filtersSection = document.querySelector(
                '[data-blog-filters-section]'
            );

            // Récupérer la section mobile spécifique
            const mobileFiltersSection = document.querySelector(
                '[data-blog-filters-mobile]'
            );

            // Récupérer les autres éléments pour la logique
            const blogGridSection = document.querySelector(
                '[data-blog-grid-section]'
            );
            const ctaSection = document.querySelector('[data-cta-section]');

            // Utiliser la section mobile pour la détection
            const targetSection = mobileFiltersSection || filtersSection;

            if (!targetSection || !blogGridSection) {
                return;
            }

            const targetRect = targetSection.getBoundingClientRect();
            const blogGridRect = blogGridSection.getBoundingClientRect();
            const ctaRect = ctaSection?.getBoundingClientRect();

            // 1. Le filtre devient sticky quand on dépasse sa section
            const hasPassedFilters = targetRect.bottom < 0;

            // 2. Le filtre reste visible tant qu'on est dans la zone blog
            const isInBlogZone = blogGridRect.bottom > 0;

            // 3. Le filtre disparaît quand on arrive à la section CTA
            const hasReachedEnd = ctaRect
                ? ctaRect.top < window.innerHeight * 0.5
                : blogGridRect.bottom < window.innerHeight * 0.3;

            // Logique finale : sticky si on a dépassé les filtres ET qu'on est encore dans le blog ET pas encore à la fin
            const shouldBeSticky =
                hasPassedFilters && isInBlogZone && !hasReachedEnd;

            setIsSticky(shouldBeSticky);
        };

        // Délai pour s'assurer que les éléments sont montés
        const timeoutId = setTimeout(handleScroll, 500);

        // Écouter le scroll avec throttling pour optimiser les performances
        let ticking = false;
        const throttledHandleScroll = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    handleScroll();
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener('scroll', throttledHandleScroll, {
            passive: true,
        });

        return () => {
            clearTimeout(timeoutId);
            window.removeEventListener('scroll', throttledHandleScroll);
        };
    }, []);

    return isSticky;
}
