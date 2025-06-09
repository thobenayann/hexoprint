'use client';

import { useEffect, useState } from 'react';

/**
 * Hook to detect media query matches
 * @param query - CSS media query string
 * @returns boolean indicating if the media query matches
 */
export function useMediaQuery(query: string): boolean {
    const [matches, setMatches] = useState(false);

    useEffect(() => {
        const media = window.matchMedia(query);

        // Set initial value
        setMatches(media.matches);

        // Listen for changes
        const listener = (event: MediaQueryListEvent) => {
            setMatches(event.matches);
        };

        media.addEventListener('change', listener);

        return () => {
            media.removeEventListener('change', listener);
        };
    }, [query]);

    return matches;
}
