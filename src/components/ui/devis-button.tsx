import { InteractiveHoverButton } from '@/components/magicui/interactive-hover-button';
import { cn } from '@/lib/utils';
import Link from 'next/link';

type DevisButtonProps = {
    className?: string;
};

export function DevisButton(props: DevisButtonProps) {
    return (
        <Link href='/contact'>
            <InteractiveHoverButton
                className={cn(
                    'bg-primary border-primary text-primary-primary shadow-md hover:shadow-lg hover:scale-105',
                    props.className
                )}
            >
                Contactez-nous
            </InteractiveHoverButton>
        </Link>
    );
}
