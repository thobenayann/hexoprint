import { cn } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';

type LogoProps = {
    className?: string;
    isScrolled?: boolean;
};

export function Logo(props: LogoProps) {
    return (
        <Link
            href='/'
            className={cn(
                'flex items-center gap-3 font-bold text-xl transition-colors hover:opacity-80',
                props.className
            )}
        >
            <Image
                src='/logos/logo-hexoprint-svg-sans-texte.svg'
                alt='Logo Hexoprint'
                width={32}
                height={32}
                className='w-8 h-8'
            />
            <span className={cn('text-foreground', props.className)}>
                Hexo
                <span className='text-hexo-blue-light'>&apos;print</span>
            </span>
        </Link>
    );
}
