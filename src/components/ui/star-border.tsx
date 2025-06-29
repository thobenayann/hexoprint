import { cn } from '@/lib/utils';
import { ButtonHTMLAttributes, forwardRef } from 'react';

interface StarBorderProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    color?: string;
    speed?: string;
    children: React.ReactNode;
    size?: 'sm' | 'md' | 'lg';
}

export const StarBorder = forwardRef<HTMLButtonElement, StarBorderProps>(
    (
        { className, color, speed = '6s', size = 'md', children, ...props },
        ref
    ) => {
        const defaultColor = color || 'hsl(var(--foreground))';

        // Size variants
        const sizeVariants = {
            sm: 'py-2 px-4 text-xs',
            md: 'py-4 px-8 text-base',
            lg: 'py-6 px-12 text-lg',
        };

        return (
            <button
                ref={ref}
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
                        // Base styles
                        'relative z-1 border text-center rounded-[20px] cursor-pointer',
                        'bg-gradient-to-b from-hexo-blue-dark to-hexo-blue-dark/80 border-hexo-blue-light/50',
                        'text-white font-semibold shadow-lg backdrop-blur-sm',
                        'hover:from-hexo-blue-light hover:to-hexo-blue-dark hover:shadow-xl',
                        'hover:border-hexo-blue-light hover:text-hexo-black',
                        'transition-all duration-300 ease-out',
                        'active:scale-95',
                        // Size variant
                        sizeVariants[size]
                    )}
                >
                    {children}
                </div>
            </button>
        );
    }
);

StarBorder.displayName = 'StarBorder';
