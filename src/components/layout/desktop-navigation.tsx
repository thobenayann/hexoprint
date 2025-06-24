'use client';

import { DevisButton } from '@/components/ui/devis-button';
import { Logo } from '@/components/ui/logo';
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { useActivePath } from '@/hooks/use-active-path';
import {
    NavigationService,
    type NavigationRoute,
} from '@/lib/navigation-config';
import { cn } from '@/lib/utils';
import { useScroll } from 'framer-motion';
import { Clock } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export function DesktopNavigation() {
    const { scrollY } = useScroll();
    const [isScrolled, setIsScrolled] = useState(false);
    const { isActive } = useActivePath();

    // Récupération des routes visibles (actives + coming-soon) depuis la configuration
    const visibleRoutes = NavigationService.getVisibleRoutes();

    useEffect(() => {
        return scrollY.on('change', (latest: number) => {
            setIsScrolled(latest > 10);
        });
    }, [scrollY]);

    const renderNavigationItem = (route: NavigationRoute) => {
        const hasSubRoutes = NavigationService.hasActiveSubRoutes(route.id);
        const isComingSoon = route.status === 'coming-soon';

        const linkClassName = cn(
            'px-4 py-2 text-sm font-medium transition-colors hover:text-primary flex items-center gap-1',
            isActive(route.path)
                ? !isScrolled
                    ? 'text-blue-300 font-semibold'
                    : 'text-primary font-semibold'
                : !isScrolled
                  ? 'text-white hover:text-blue-300'
                  : 'hover:text-primary',
            isComingSoon && 'opacity-70'
        );

        if (hasSubRoutes) {
            const activeSubRoutes = NavigationService.getActiveSubRoutes(
                route.id
            );

            return (
                <NavigationMenuItem key={route.id}>
                    <NavigationMenuTrigger
                        className={cn(
                            'px-4 py-2 text-sm font-medium transition-colors hover:text-primary bg-transparent border-none shadow-none flex items-center gap-1',
                            isActive(route.path)
                                ? !isScrolled
                                    ? 'text-blue-300 font-semibold'
                                    : 'text-primary font-semibold'
                                : !isScrolled
                                  ? 'text-white hover:text-blue-300'
                                  : 'hover:text-primary',
                            isComingSoon && 'opacity-70'
                        )}
                    >
                        {route.title}
                        {isComingSoon && (
                            <Clock className="w-3 h-3 ml-1 text-blue-400" />
                        )}
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <ul className="grid w-[400px] gap-3 p-4">
                            {activeSubRoutes.map((subRoute) => (
                                <li key={subRoute.id}>
                                    <NavigationMenuLink asChild>
                                        <Link
                                            href={subRoute.path}
                                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                                        >
                                            <div className="text-sm font-medium leading-none">
                                                {subRoute.title}
                                            </div>
                                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                                {subRoute.description}
                                            </p>
                                        </Link>
                                    </NavigationMenuLink>
                                </li>
                            ))}
                        </ul>
                    </NavigationMenuContent>
                </NavigationMenuItem>
            );
        }

        const content = (
            <>
                {route.title}
                {isComingSoon && (
                    <Clock className="w-3 h-3 ml-1 text-blue-400" />
                )}
            </>
        );

        // Si coming-soon, désactiver le lien avec tooltip
        if (isComingSoon) {
            return (
                <NavigationMenuItem key={route.id}>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div className={linkClassName}>{content}</div>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p className="text-sm">Bientôt disponible</p>
                        </TooltipContent>
                    </Tooltip>
                </NavigationMenuItem>
            );
        }

        return (
            <NavigationMenuItem key={route.id}>
                <NavigationMenuLink asChild>
                    <Link href={route.path} className={linkClassName}>
                        {content}
                    </Link>
                </NavigationMenuLink>
            </NavigationMenuItem>
        );
    };

    return (
        <header
            className={cn(
                'fixed top-0 left-0 right-0 z-[9999] transition-all duration-300 ease-in-out',
                isScrolled
                    ? 'bg-background/50 backdrop-blur-md'
                    : 'bg-transparent'
            )}
        >
            <nav
                className={cn(
                    'container mx-auto px-4 h-16 flex items-center justify-between',
                    !isScrolled && 'text-white'
                )}
            >
                {/* Logo à gauche */}
                <Logo
                    className={!isScrolled ? 'text-white' : ''}
                    isScrolled={isScrolled}
                />

                {/* Navigation au centre */}
                <NavigationMenu className="hidden md:flex">
                    <TooltipProvider>
                        <NavigationMenuList
                            className={!isScrolled ? 'text-white' : ''}
                        >
                            {visibleRoutes.map(renderNavigationItem)}
                        </NavigationMenuList>
                    </TooltipProvider>
                </NavigationMenu>

                {/* Bouton devis à droite */}
                <DevisButton />
            </nav>
        </header>
    );
}
