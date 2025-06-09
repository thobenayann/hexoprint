import { StarBorder } from '@/components/ui/star-border';
import { ArrowRight, LucideIcon } from 'lucide-react';
import Link from 'next/link';

type PrimaryButtonProps = {
    href: string;
    children: React.ReactNode;
    icon?: LucideIcon;
    className?: string;
    external?: boolean;
};

export function PrimaryButton({
    href,
    children,
    icon: Icon,
    className = '',
    external = false,
}: PrimaryButtonProps) {
    const content = (
        <StarBorder
            color='#96CFE7'
            speed='4s'
            className={`text-lg font-semibold cursor-pointer ${className}`}
        >
            <span className='flex items-center gap-2'>
                {children}
                {Icon && <Icon className='w-5 h-5' />}
                {!Icon && <ArrowRight className='w-5 h-5' />}
            </span>
        </StarBorder>
    );

    if (external) {
        return (
            <a
                href={href}
                target='_blank'
                rel='noopener noreferrer'
                className='inline-block'
            >
                {content}
            </a>
        );
    }

    return (
        <Link href={href} className='inline-block'>
            {content}
        </Link>
    );
}
