'use client';

import { useActivePath } from '@/hooks/use-active-path';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import {
    BookOpen,
    Image as Gallery,
    Home,
    Mail,
    Printer,
    User,
} from 'lucide-react';
import Link from 'next/link';
import * as React from 'react';

/**
 * Represents a navigation tab with an icon and path
 */
type NavTab = {
    title: string;
    icon: React.ComponentType<{ size?: number }>;
    path: string;
};

/**
 * Navigation tabs configuration for Hexoprint
 */
const navigationTabs: NavTab[] = [
    {
        title: 'Accueil',
        icon: Home,
        path: '/',
    },
    {
        title: 'À propos',
        icon: User,
        path: '/a-propos',
    },
    {
        title: 'Prestations',
        icon: Printer,
        path: '/prestations',
    },
    {
        title: 'Galerie',
        icon: Gallery,
        path: '/galerie',
    },
    {
        title: 'Blog',
        icon: BookOpen,
        path: '/blog',
    },
    {
        title: 'Contact',
        icon: Mail,
        path: '/contact',
    },
];

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
 */
export function MobileBottomNavigation() {
    const [selectedIndex, setSelectedIndex] = React.useState<number | null>(
        null
    );
    const { isActive } = useActivePath();
    const outsideClickRef = React.useRef<HTMLDivElement>(null);

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
        <div className='fixed bottom-0 left-0 right-0 z-[9999] md:hidden'>
            <div
                ref={outsideClickRef}
                className={cn(
                    'flex items-center justify-around bg-background/95 backdrop-blur-md border-t border-border p-2 safe-area-pb'
                )}
            >
                {navigationTabs.map((tab, index) => {
                    const Icon = tab.icon;
                    const isSelected = index === selectedIndex;
                    const isCurrentPage = isActive(tab.path);

                    return (
                        <Link
                            href={tab.path}
                            key={tab.title}
                            onClick={() => handleSelect(index)}
                            className='contents'
                        >
                            <motion.div
                                variants={buttonVariants}
                                initial={false}
                                animate='animate'
                                custom={isSelected}
                                transition={transition}
                                className={cn(
                                    'relative flex items-center justify-center rounded-xl px-2 py-2 text-sm font-medium transition-colors duration-300 cursor-pointer min-w-[2.5rem]',
                                    isCurrentPage
                                        ? 'text-primary'
                                        : isSelected
                                        ? 'text-primary'
                                        : 'text-muted-foreground hover:text-foreground'
                                )}
                            >
                                <Icon size={20} />
                                <AnimatePresence initial={false}>
                                    {isSelected && (
                                        <motion.span
                                            variants={spanVariants}
                                            initial='initial'
                                            animate='animate'
                                            exit='exit'
                                            transition={transition}
                                            className='overflow-hidden pl-2 whitespace-nowrap'
                                        >
                                            {tab.title}
                                        </motion.span>
                                    )}
                                </AnimatePresence>

                                {/* Active indicator for current page */}
                                {isCurrentPage && (
                                    <motion.div
                                        layoutId='currentPageTab'
                                        className='absolute inset-0 w-full rounded-xl -z-10'
                                        initial={false}
                                        transition={{
                                            type: 'spring',
                                            stiffness: 300,
                                            damping: 30,
                                        }}
                                    >
                                        <div className='absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-primary rounded-t-full'>
                                            <div className='absolute w-12 h-6 bg-primary/30 rounded-full blur-md -top-2 -left-2' />
                                            <div className='absolute w-8 h-6 bg-primary/30 rounded-full blur-md -top-1' />
                                            <div className='absolute w-4 h-4 bg-primary/30 rounded-full blur-sm top-0 left-2' />
                                        </div>
                                        <div className='absolute inset-0 bg-primary/10 rounded-xl backdrop-blur-sm' />
                                    </motion.div>
                                )}

                                {/* Temporary selection indicator */}
                                {isSelected && !isCurrentPage && (
                                    <motion.div
                                        layoutId='activeTab'
                                        className='absolute inset-0 w-full rounded-xl -z-10'
                                        initial={false}
                                        transition={{
                                            type: 'spring',
                                            stiffness: 300,
                                            damping: 30,
                                        }}
                                    >
                                        <div className='absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-primary/80 rounded-t-full'>
                                            <div className='absolute w-12 h-6 bg-primary/20 rounded-full blur-md -top-2 -left-2' />
                                            <div className='absolute w-8 h-6 bg-primary/20 rounded-full blur-md -top-1' />
                                            <div className='absolute w-4 h-4 bg-primary/20 rounded-full blur-sm top-0 left-2' />
                                        </div>
                                        <div className='absolute inset-0 bg-primary/5 rounded-xl backdrop-blur-sm' />
                                    </motion.div>
                                )}
                            </motion.div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
