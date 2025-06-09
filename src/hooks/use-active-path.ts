'use client';

import { usePathname } from 'next/navigation';

/**
 * Hook to check if a path is currently active
 * @param path - The path to check
 * @returns boolean indicating if the path is active
 */
export function useActivePath() {
    const pathname = usePathname();

    const isActive = (path: string): boolean => {
        if (path === '/') {
            return pathname === '/';
        }
        return pathname.startsWith(path);
    };

    return { pathname, isActive };
}
