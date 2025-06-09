import { cn } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';
import React from 'react';

interface InteractiveHoverButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const InteractiveHoverButton = React.forwardRef<
    HTMLButtonElement,
    InteractiveHoverButtonProps
>(({ children, className, ...props }, ref) => {
    return (
        <button
            ref={ref}
            className={cn(
                'group relative w-auto cursor-pointer overflow-hidden rounded-full border transition-all duration-300 px-6 py-2 font-semibold',
                className
            )}
            {...props}
        >
            {/* État normal - texte centré */}
            <div className='flex items-center justify-center transition-all duration-300 group-hover:translate-x-6 group-hover:opacity-0'>
                <span>{children}</span>
            </div>

            {/* État hover - fond coloré avec flèche */}
            <div className='absolute inset-0 flex items-center justify-center gap-2 bg-foreground text-background opacity-0 transition-all duration-300 group-hover:opacity-100 rounded-full'>
                <span>{children}</span>
                <ArrowRight className='w-4 h-4' />
            </div>
        </button>
    );
});

InteractiveHoverButton.displayName = 'InteractiveHoverButton';
