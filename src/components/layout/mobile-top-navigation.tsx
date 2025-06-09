'use client';

import Image from 'next/image';
import Link from 'next/link';

/**
 * Mobile top navigation component
 * Displays logo on the left and contact button on the right
 */
export function MobileTopNavigation() {
    return (
        <header className='fixed top-0 left-0 right-0 z-[9999] md:hidden'>
            <nav className='flex items-center justify-between px-4 py-2 bg-background/95 backdrop-blur-md border-b border-border'>
                {/* Logo */}
                <Link href='/' className='flex-shrink-0'>
                    <Image
                        src='/logos/logo-hexoprint-svg-sans-texte.svg'
                        alt="Hexo'print"
                        width={120}
                        height={40}
                        priority
                        className='h-8 w-auto'
                    />
                </Link>

                {/* Contact Button */}
                <Link
                    href='/contact'
                    className='px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-xs font-medium hover:bg-primary/90 transition-colors'
                >
                    Contactez-nous
                </Link>
            </nav>
        </header>
    );
}
