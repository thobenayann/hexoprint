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
import { cn } from '@/lib/utils';
import { useScroll } from 'framer-motion';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export function DesktopNavigation() {
    const { scrollY } = useScroll();
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        return scrollY.on('change', (latest: number) => {
            setIsScrolled(latest > 10);
        });
    }, [scrollY]);

    return (
        <header
            className={cn(
                'fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out',
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
                <NavigationMenu className='hidden md:flex'>
                    <NavigationMenuList
                        className={!isScrolled ? 'text-white' : ''}
                    >
                        <NavigationMenuItem>
                            <NavigationMenuLink asChild>
                                <Link
                                    href='/'
                                    className={cn(
                                        'px-4 py-2 text-sm font-medium transition-colors hover:text-primary',
                                        !isScrolled
                                            ? 'text-white hover:text-blue-300'
                                            : ''
                                    )}
                                >
                                    Accueil
                                </Link>
                            </NavigationMenuLink>
                        </NavigationMenuItem>

                        <NavigationMenuItem>
                            <NavigationMenuLink asChild>
                                <Link
                                    href='/a-propos'
                                    className={cn(
                                        'px-4 py-2 text-sm font-medium transition-colors hover:text-primary',
                                        !isScrolled
                                            ? 'text-white hover:text-blue-300'
                                            : ''
                                    )}
                                >
                                    À propos
                                </Link>
                            </NavigationMenuLink>
                        </NavigationMenuItem>

                        <NavigationMenuItem>
                            <NavigationMenuTrigger
                                className={cn(
                                    'px-4 py-2 text-sm font-medium transition-colors hover:text-primary bg-transparent border-none shadow-none',
                                    !isScrolled
                                        ? 'text-white hover:text-blue-300'
                                        : ''
                                )}
                            >
                                Prestations
                            </NavigationMenuTrigger>
                            <NavigationMenuContent>
                                <ul className='grid w-[400px] gap-3 p-4'>
                                    <li>
                                        <NavigationMenuLink asChild>
                                            <Link
                                                href='/prestations/professionnels'
                                                className='block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground'
                                            >
                                                <div className='text-sm font-medium leading-none'>
                                                    Professionnels
                                                </div>
                                                <p className='line-clamp-2 text-sm leading-snug text-muted-foreground'>
                                                    Prototypage rapide,
                                                    réparation industrielle et
                                                    pièces sur-mesure
                                                </p>
                                            </Link>
                                        </NavigationMenuLink>
                                    </li>
                                    <li>
                                        <NavigationMenuLink asChild>
                                            <Link
                                                href='/prestations/particuliers'
                                                className='block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground'
                                            >
                                                <div className='text-sm font-medium leading-none'>
                                                    Particuliers
                                                </div>
                                                <p className='line-clamp-2 text-sm leading-snug text-muted-foreground'>
                                                    Modélisme, déco, bricolage
                                                    et créations personnalisées
                                                </p>
                                            </Link>
                                        </NavigationMenuLink>
                                    </li>
                                </ul>
                            </NavigationMenuContent>
                        </NavigationMenuItem>

                        <NavigationMenuItem>
                            <NavigationMenuLink asChild>
                                <Link
                                    href='/galerie'
                                    className={cn(
                                        'px-4 py-2 text-sm font-medium transition-colors hover:text-primary',
                                        !isScrolled
                                            ? 'text-white hover:text-blue-300'
                                            : ''
                                    )}
                                >
                                    Galerie
                                </Link>
                            </NavigationMenuLink>
                        </NavigationMenuItem>

                        <NavigationMenuItem>
                            <NavigationMenuLink asChild>
                                <Link
                                    href='/blog'
                                    className={cn(
                                        'px-4 py-2 text-sm font-medium transition-colors hover:text-primary',
                                        !isScrolled
                                            ? 'text-white hover:text-blue-300'
                                            : ''
                                    )}
                                >
                                    Blog
                                </Link>
                            </NavigationMenuLink>
                        </NavigationMenuItem>

                        <NavigationMenuItem>
                            <NavigationMenuLink asChild>
                                <Link
                                    href='/contact'
                                    className={cn(
                                        'px-4 py-2 text-sm font-medium transition-colors hover:text-primary',
                                        !isScrolled
                                            ? 'text-white hover:text-blue-300'
                                            : ''
                                    )}
                                >
                                    Contact
                                </Link>
                            </NavigationMenuLink>
                        </NavigationMenuItem>
                    </NavigationMenuList>
                </NavigationMenu>

                {/* Bouton devis à droite */}
                <DevisButton />
            </nav>
        </header>
    );
}
