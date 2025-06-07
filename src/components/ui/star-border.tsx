import { cn } from '@/lib/utils';
import { ComponentPropsWithoutRef, ElementType } from 'react';

interface StarBorderProps<T extends ElementType> {
    as?: T;
    color?: string;
    speed?: string;
    className?: string;
    children: React.ReactNode;
}

export function StarBorder<T extends ElementType = 'button'>({
    as,
    className,
    color,
    speed = '6s',
    children,
    ...props
}: StarBorderProps<T> &
    Omit<ComponentPropsWithoutRef<T>, keyof StarBorderProps<T>>) {
    const Component = as || 'button';
    const defaultColor = color || 'hsl(var(--foreground))';

    return (
        <Component
            className={cn(
                'relative inline-block py-[1px] overflow-hidden rounded-[20px]',
                className
            )}
            {...props}
        >
            <div
                className={cn(
                    'absolute w-[300%] h-[50%] bottom-[-11px] right-[-250%] rounded-full animate-star-movement-bottom z-0',
                    'opacity-20 dark:opacity-70'
                )}
                style={{
                    background: `radial-gradient(circle, ${defaultColor}, transparent 10%)`,
                    animationDuration: speed,
                }}
            />
            <div
                className={cn(
                    'absolute w-[300%] h-[50%] top-[-10px] left-[-250%] rounded-full animate-star-movement-top z-0',
                    'opacity-20 dark:opacity-70'
                )}
                style={{
                    background: `radial-gradient(circle, ${defaultColor}, transparent 10%)`,
                    animationDuration: speed,
                }}
            />
            <div
                className={cn(
                    'relative z-1 border text-center text-base py-4 px-8 rounded-[20px] cursor-pointer',
                    'bg-gradient-to-b from-hexo-blue-dark to-hexo-blue-dark/80 border-hexo-blue-light/50',
                    'text-white font-semibold shadow-lg backdrop-blur-sm',
                    'hover:from-hexo-blue-light hover:to-hexo-blue-dark hover:shadow-xl',
                    'hover:border-hexo-blue-light hover:text-hexo-black',
                    'transition-all duration-300 ease-out',
                    'active:scale-95'
                )}
            >
                {children}
            </div>
        </Component>
    );
}
