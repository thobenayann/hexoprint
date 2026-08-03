'use client';

import { InteractiveHoverButton } from '@/components/magicui/interactive-hover-button';
import { trackClientEvent } from '@/lib/analytics-client';
import { cn } from '@/lib/utils';
import Link from 'next/link';

type DevisButtonProps = {
    className?: string;
    source?: 'desktop_navigation' | 'mobile_navigation';
};

export function DevisButton({
    className,
    source = 'desktop_navigation',
}: DevisButtonProps) {
    return (
        <Link
            href='/contact'
            onClick={() => trackClientEvent('quote_cta_clicked', { source })}
        >
            <InteractiveHoverButton
                className={cn(
                    'bg-primary border-primary text-primary-primary shadow-md hover:shadow-lg hover:scale-105',
                    className
                )}
            >
                Contactez-nous
            </InteractiveHoverButton>
        </Link>
    );
}
