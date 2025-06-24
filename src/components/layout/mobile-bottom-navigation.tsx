'use client';

import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { useActivePath } from '@/hooks/use-active-path';
import { NavigationService } from '@/lib/navigation-config';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { Clock } from 'lucide-react';
import Link from 'next/link';
import * as React from 'react';

/**
 * Animation variants for the button container
 */
const buttonVariants = {
    initial: {
        gap: 0,
        paddingLeft: '.5rem',
        paddingRight: '.5rem',
    },
    animate: (isSelected: boolean) => ({
        gap: isSelected ? '.5rem' : 0,
        paddingLeft: isSelected ? '1rem' : '.5rem',
        paddingRight: isSelected ? '1rem' : '.5rem',
    }),
};

/**
 * Animation variants for the text span
 */
const spanVariants = {
    initial: { width: 0, opacity: 0 },
    animate: { width: 'auto', opacity: 1 },
    exit: { width: 0, opacity: 0 },
};

const transition = { delay: 0.1, type: 'spring', bounce: 0, duration: 0.6 };

/**
 * Mobile bottom navigation component for Hexoprint
 * Displays navigation tabs at the bottom of the screen on mobile
 * Utilise la configuration centralisée des routes
 */
export function MobileBottomNavigation() {
    const [selectedIndex, setSelectedIndex] = React.useState<number | null>(
        null
    );
    const { isActive } = useActivePath();
    const outsideClickRef = React.useRef<HTMLDivElement>(null);

    // Récupération des routes visibles (actives + coming-soon) depuis la configuration
    const visibleRoutes = NavigationService.getVisibleRoutes();

    // Handle clicking outside to close expanded tabs
    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                outsideClickRef.current &&
                !outsideClickRef.current.contains(event.target as Node)
            ) {
                setSelectedIndex(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleSelect = (index: number) => {
        setSelectedIndex(selectedIndex === index ? null : index);
    };

    return (
        <TooltipProvider>
            <div className="fixed bottom-0 left-0 right-0 z-[9999] md:hidden">
                <div
                    ref={outsideClickRef}
                    className={cn(
                        'flex items-center justify-around bg-background/95 backdrop-blur-md border-t border-border p-2 safe-area-pb'
                    )}
                >
                    {visibleRoutes.map((route, index) => {
                        const Icon = route.icon;
                        const isSelected = index === selectedIndex;
                        const isCurrentPage = isActive(route.path);
                        const isComingSoon = route.status === 'coming-soon';

                        const content = (
                            <motion.div
                                variants={buttonVariants}
                                initial={false}
                                animate="animate"
                                custom={isSelected}
                                transition={transition}
                                className={cn(
                                    'relative flex items-center justify-center rounded-xl px-2 py-2 text-sm font-medium transition-colors duration-300 cursor-pointer min-w-[2.5rem]',
                                    isCurrentPage
                                        ? 'text-primary'
                                        : isSelected
                                          ? 'text-primary'
                                          : 'text-muted-foreground hover:text-foreground',
                                    isComingSoon && 'opacity-70'
                                )}
                            >
                                <div className="relative">
                                    <Icon size={20} />
                                    {isComingSoon && (
                                        <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-400 rounded-full flex items-center justify-center">
                                            <Clock className="w-1.5 h-1.5 text-white" />
                                        </div>
                                    )}
                                </div>
                                <AnimatePresence initial={false}>
                                    {isSelected && (
                                        <motion.span
                                            variants={spanVariants}
                                            initial="initial"
                                            animate="animate"
                                            exit="exit"
                                            transition={transition}
                                            className="overflow-hidden pl-2 whitespace-nowrap flex items-center gap-1"
                                        >
                                            {route.title}
                                            {isComingSoon && (
                                                <span className="text-xs text-blue-400">
                                                    (bientôt)
                                                </span>
                                            )}
                                        </motion.span>
                                    )}
                                </AnimatePresence>

                                {/* Active indicator for current page */}
                                {isCurrentPage && (
                                    <motion.div
                                        layoutId="currentPageTab"
                                        className="absolute inset-0 w-full rounded-xl -z-10"
                                        initial={false}
                                        transition={{
                                            type: 'spring',
                                            stiffness: 300,
                                            damping: 30,
                                        }}
                                    >
                                        <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-primary rounded-t-full">
                                            <div className="absolute w-12 h-6 bg-primary/30 rounded-full blur-md -top-2 -left-2" />
                                            <div className="absolute w-8 h-6 bg-primary/30 rounded-full blur-md -top-1" />
                                            <div className="absolute w-4 h-4 bg-primary/30 rounded-full blur-sm top-0 left-2" />
                                        </div>
                                        <div className="absolute inset-0 bg-primary/10 rounded-xl backdrop-blur-sm" />
                                    </motion.div>
                                )}

                                {/* Temporary selection indicator */}
                                {isSelected && !isCurrentPage && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute inset-0 w-full rounded-xl -z-10"
                                        initial={false}
                                        transition={{
                                            type: 'spring',
                                            stiffness: 300,
                                            damping: 30,
                                        }}
                                    >
                                        <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-primary/80 rounded-t-full">
                                            <div className="absolute w-12 h-6 bg-primary/20 rounded-full blur-md -top-2 -left-2" />
                                            <div className="absolute w-8 h-6 bg-primary/20 rounded-full blur-md -top-1" />
                                            <div className="absolute w-4 h-4 bg-primary/20 rounded-full blur-sm top-0 left-2" />
                                        </div>
                                        <div className="absolute inset-0 bg-primary/5 rounded-xl backdrop-blur-sm" />
                                    </motion.div>
                                )}
                            </motion.div>
                        );

                        // Si coming-soon, désactiver le lien avec tooltip
                        if (isComingSoon) {
                            return (
                                <Tooltip key={route.id}>
                                    <TooltipTrigger asChild>
                                        <div
                                            onClick={() => handleSelect(index)}
                                            className="contents"
                                        >
                                            {content}
                                        </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p className="text-sm">
                                            Bientôt disponible
                                        </p>
                                    </TooltipContent>
                                </Tooltip>
                            );
                        }

                        return (
                            <Link
                                href={route.path}
                                key={route.id}
                                onClick={() => handleSelect(index)}
                                className="contents"
                            >
                                {content}
                            </Link>
                        );
                    })}
                </div>
            </div>
        </TooltipProvider>
    );
}
