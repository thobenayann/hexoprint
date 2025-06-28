'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

// Types pour les filtres
export type CategoryFilter =
    | 'all'
    | 'prototypes'
    | 'pieces-detachees'
    | 'decoration'
    | 'outillage'
    | 'modeles-reduits'
    | 'art-creatif'
    | 'reparation'
    | 'autre';
export type MaterialFilter =
    | 'all'
    | 'pla'
    | 'abs'
    | 'petg'
    | 'tpu'
    | 'resine'
    | 'autre';
export type ViewType = 'grid' | 'list';

// Hook principal pour gérer les filtres de la galerie
export function useGalleryFilters() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const category = (searchParams.get('category') as CategoryFilter) || 'all';
    const material = (searchParams.get('material') as MaterialFilter) || 'all';
    const view = (searchParams.get('view') as ViewType) || 'grid';

    // Fonction pour scroller vers la galerie en smooth (uniquement en mobile)
    const scrollToGallery = useCallback(() => {
        // Ne scroller qu'en mobile (écrans < 768px)
        if (window.innerWidth >= 768) return;

        // Chercher l'élément galerie
        const galleryElement = document.querySelector('[data-gallery-section]');
        if (galleryElement) {
            // Calculer la position en tenant compte du header mobile sticky
            const headerHeight = 80; // Approximation de la hauteur du header mobile
            const elementTop =
                galleryElement.getBoundingClientRect().top + window.scrollY;
            const targetPosition = elementTop - headerHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth',
            });
        }
    }, []);

    const setFilter = useCallback(
        (filterType: 'category' | 'material' | 'all', value: string) => {
            const params = new URLSearchParams(searchParams.toString());

            if (filterType === 'all') {
                params.delete('category');
                params.delete('material');
            } else if (filterType === 'category') {
                if (value === 'all') {
                    params.delete('category');
                } else {
                    params.set('category', value);
                }
            } else if (filterType === 'material') {
                if (value === 'all') {
                    params.delete('material');
                } else {
                    params.set('material', value);
                }
            }

            // Conserver la vue actuelle
            if (view !== 'grid') {
                params.set('view', view);
            } else {
                params.delete('view');
            }

            router.push(`?${params.toString()}`, { scroll: false });

            // Scroller vers la galerie après un court délai pour laisser l'URL se mettre à jour
            setTimeout(scrollToGallery, 100);
        },
        [searchParams, view, router, scrollToGallery]
    );

    const setView = useCallback(
        (newView: ViewType) => {
            const params = new URLSearchParams(searchParams.toString());

            if (newView === 'grid') {
                params.delete('view');
            } else {
                params.set('view', newView);
            }

            router.push(`?${params.toString()}`, { scroll: false });
        },
        [searchParams, router]
    );

    const clearFilters = useCallback(() => {
        const params = new URLSearchParams();

        // Conserver seulement la vue si ce n'est pas grid
        if (view !== 'grid') {
            params.set('view', view);
        }

        router.push(`?${params.toString()}`, { scroll: false });

        // Scroller vers la galerie
        setTimeout(scrollToGallery, 100);
    }, [view, router, scrollToGallery]);

    return {
        category,
        material,
        view,
        setFilter,
        setView,
        clearFilters,
    };
}

// Hook pour gérer le comportement sticky des filtres mobiles
export function useStickyFilters() {
    const [isSticky, setIsSticky] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            // Récupérer l'élément filters principal
            const filtersSection = document.querySelector(
                '[data-filters-section]'
            );

            // Récupérer la section mobile spécifique (celle qui a le contenu)
            const mobileFiltersSection = document.querySelector(
                '[data-filters-mobile]'
            );

            // Récupérer les autres éléments pour la logique
            const gallerySection = document.querySelector(
                '[data-gallery-section]'
            );
            const ctaSection = document.querySelector('[data-cta-section]');

            // Utiliser la section mobile pour la détection (qui a du contenu visible)
            const targetSection = mobileFiltersSection || filtersSection;

            if (!targetSection || !gallerySection) {
                return;
            }

            const targetRect = targetSection.getBoundingClientRect();
            const galleryRect = gallerySection.getBoundingClientRect();
            const ctaRect = ctaSection?.getBoundingClientRect();

            // 1. Le filtre devient sticky quand on dépasse sa section
            const hasPassedFilters = targetRect.bottom < 0;

            // 2. Le filtre reste visible tant qu'on est dans la zone galerie
            const isInGalleryZone = galleryRect.bottom > 0;

            // 3. Le filtre disparaît quand on arrive à la section CTA (ou fin de galerie)
            const hasReachedEnd = ctaRect
                ? ctaRect.top < window.innerHeight * 0.5
                : galleryRect.bottom < window.innerHeight * 0.3;

            // Logique finale : sticky si on a dépassé les filtres ET qu'on est encore dans la galerie ET pas encore à la fin
            const shouldBeSticky =
                hasPassedFilters && isInGalleryZone && !hasReachedEnd;

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
        window.addEventListener('resize', throttledHandleScroll, {
            passive: true,
        });

        return () => {
            clearTimeout(timeoutId);
            window.removeEventListener('scroll', throttledHandleScroll);
            window.removeEventListener('resize', throttledHandleScroll);
        };
    }, []);

    return isSticky;
}

// Hook original commenté pour debug
export function useStickyFiltersOriginal() {
    const [isSticky, setIsSticky] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            // Attendre que les éléments soient disponibles
            const filtersSection = document.querySelector(
                '[data-filters-section]'
            );
            const gallerySection = document.querySelector(
                '[data-gallery-section]'
            );
            const ctaSection = document.querySelector('[data-cta-section]');

            // Debug temporaire
            if (!filtersSection) {
                console.warn('filtersSection not found');
                return;
            }
            if (!gallerySection) {
                console.warn('gallerySection not found');
                return;
            }

            const filtersSectionRect = filtersSection.getBoundingClientRect();
            const gallerySectionRect = gallerySection.getBoundingClientRect();
            const ctaSectionRect = ctaSection?.getBoundingClientRect();

            // Logique simplifiée : activer sticky quand on dépasse les filtres
            const shouldBeSticky = filtersSectionRect.bottom < 100; // Marge de 100px

            // Désactiver sticky quand on arrive près du CTA
            const shouldStopSticky = ctaSectionRect
                ? ctaSectionRect.top < window.innerHeight * 0.8
                : false;

            // Être dans la zone de la galerie
            const inGalleryZone =
                gallerySectionRect.top < window.innerHeight &&
                gallerySectionRect.bottom > 200;

            const newStickyState =
                shouldBeSticky && inGalleryZone && !shouldStopSticky;

            // Debug temporaire
            console.log('Sticky Debug:', {
                shouldBeSticky,
                inGalleryZone,
                shouldStopSticky,
                newStickyState,
                filterBottom: filtersSectionRect.bottom,
                galleryTop: gallerySectionRect.top,
                galleryBottom: gallerySectionRect.bottom,
                ctaTop: ctaSectionRect?.top,
            });

            setIsSticky(newStickyState);
        };

        // Délai pour s'assurer que les éléments sont montés
        const timeoutId = setTimeout(() => {
            handleScroll();
        }, 100);

        // Écouter le scroll avec throttling
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
        window.addEventListener('resize', throttledHandleScroll, {
            passive: true,
        });

        return () => {
            clearTimeout(timeoutId);
            window.removeEventListener('scroll', throttledHandleScroll);
            window.removeEventListener('resize', throttledHandleScroll);
        };
    }, []);

    return isSticky;
}
