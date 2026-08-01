'use client';

import { useCallback, useSyncExternalStore } from 'react';

const getServerSnapshot = () => false;

/**
 * Hook to detect media query matches
 * @param query - CSS media query string
 * @returns boolean indicating if the media query matches
 */
export function useMediaQuery(query: string): boolean {
    const subscribe = useCallback(
        (onStoreChange: () => void) => {
            const media = window.matchMedia(query);
            media.addEventListener('change', onStoreChange);

            return () => {
                media.removeEventListener('change', onStoreChange);
            };
        },
        [query]
    );

    const getSnapshot = useCallback(
        () => window.matchMedia(query).matches,
        [query]
    );

    return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
