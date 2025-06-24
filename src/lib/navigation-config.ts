import type { LucideIcon } from 'lucide-react';
import {
    BookOpen,
    Image as Gallery,
    Home,
    Mail,
    Printer,
    User,
} from 'lucide-react';

/**
 * Status des routes de navigation
 */
export type RouteStatus = 'active' | 'inactive' | 'coming-soon';

/**
 * Configuration d'une route de navigation
 */
export type NavigationRoute = {
    /** Identifiant unique de la route */
    id: string;
    /** Titre affiché dans la navigation */
    title: string;
    /** Chemin de la route */
    path: string;
    /** Icône pour la navigation mobile */
    icon: LucideIcon;
    /** Status de la route (active, inactive, coming-soon) */
    status: RouteStatus;
    /** Description pour les sous-menus (optionnel) */
    description?: string;
    /** Sous-routes pour les menus déroulants */
    subRoutes?: NavigationSubRoute[];
};

/**
 * Configuration d'une sous-route
 */
export type NavigationSubRoute = {
    /** Identifiant unique de la sous-route */
    id: string;
    /** Titre affiché */
    title: string;
    /** Chemin de la sous-route */
    path: string;
    /** Description de la sous-route */
    description: string;
    /** Status de la sous-route */
    status: RouteStatus;
};

/**
 * Configuration complète de la navigation
 * Centralise toutes les routes et leurs statuts
 */
export const NAVIGATION_CONFIG: NavigationRoute[] = [
    {
        id: 'home',
        title: 'Accueil',
        path: '/',
        icon: Home,
        status: 'active',
    },
    {
        id: 'about',
        title: 'À propos',
        path: '/a-propos',
        icon: User,
        status: 'active',
    },
    {
        id: 'services',
        title: 'Prestations',
        path: '/prestations',
        icon: Printer,
        status: 'active',
        subRoutes: [
            {
                id: 'services-professionals',
                title: 'Professionnels',
                path: '/prestations',
                description:
                    'Prototypage rapide, réparation industrielle et pièces sur-mesure',
                status: 'active',
            },
            {
                id: 'services-individuals',
                title: 'Particuliers',
                path: '/prestations',
                description:
                    'Modélisme, déco, bricolage et créations personnalisées',
                status: 'active',
            },
        ],
    },
    {
        id: 'gallery',
        title: 'Galerie',
        path: '/galerie',
        icon: Gallery,
        status: 'coming-soon',
    },
    {
        id: 'blog',
        title: 'Blog',
        path: '/blog',
        icon: BookOpen,
        status: 'coming-soon',
    },
    {
        id: 'contact',
        title: 'Contact',
        path: '/contact',
        icon: Mail,
        status: 'active',
    },
];

/**
 * Utilitaires pour la gestion des routes
 */
export class NavigationService {
    /**
     * Récupère toutes les routes actives
     */
    static getActiveRoutes(): NavigationRoute[] {
        return NAVIGATION_CONFIG.filter((route) => route.status === 'active');
    }

    /**
     * Récupère toutes les routes visibles (actives + coming-soon)
     */
    static getVisibleRoutes(): NavigationRoute[] {
        return NAVIGATION_CONFIG.filter((route) =>
            ['active', 'coming-soon'].includes(route.status)
        );
    }

    /**
     * Vérifie si une route est active
     */
    static isRouteActive(routeId: string): boolean {
        const route = NAVIGATION_CONFIG.find((r) => r.id === routeId);
        return route?.status === 'active';
    }

    /**
     * Récupère une route par son ID
     */
    static getRouteById(routeId: string): NavigationRoute | undefined {
        return NAVIGATION_CONFIG.find((route) => route.id === routeId);
    }

    /**
     * Récupère une route par son chemin
     */
    static getRouteByPath(path: string): NavigationRoute | undefined {
        return NAVIGATION_CONFIG.find((route) => route.path === path);
    }

    /**
     * Récupère les sous-routes actives d'une route
     */
    static getActiveSubRoutes(routeId: string): NavigationSubRoute[] {
        const route = this.getRouteById(routeId);
        return (
            route?.subRoutes?.filter(
                (subRoute) => subRoute.status === 'active'
            ) || []
        );
    }

    /**
     * Vérifie si une route a des sous-routes actives
     */
    static hasActiveSubRoutes(routeId: string): boolean {
        return this.getActiveSubRoutes(routeId).length > 0;
    }
}

/**
 * Hook personnalisé pour utiliser la configuration de navigation
 * (si nécessaire pour la logique métier côté client)
 */
export function useNavigationConfig() {
    return {
        routes: NAVIGATION_CONFIG,
        activeRoutes: NavigationService.getActiveRoutes(),
        visibleRoutes: NavigationService.getVisibleRoutes(),
        isRouteActive: NavigationService.isRouteActive,
        getRouteById: NavigationService.getRouteById,
        getRouteByPath: NavigationService.getRouteByPath,
    };
}
