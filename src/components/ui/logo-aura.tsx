import { cn } from '@/lib/utils';

type LogoAuraProps = {
    className?: string;
    fill?: string;
};

export const LogoAura = ({ className, fill }: LogoAuraProps) => {
    return (
        <svg
            className={cn(
                'animate-logo-aura pointer-events-none absolute z-[1] h-[169%] w-[138%] lg:w-[100%] opacity-0',
                className
            )}
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 3787 2842'
            fill='none'
        >
            <g filter='url(#filter-aura)'>
                <ellipse
                    cx='1924.71'
                    cy='273.501'
                    rx='1924.71'
                    ry='273.501'
                    transform='matrix(-0.822377 -0.568943 -0.568943 0.822377 3631.88 2291.09)'
                    fill={fill || '#FAFAFA'}
                    fillOpacity='0.21'
                ></ellipse>
            </g>
            <defs>
                <filter
                    id='filter-aura'
                    x='0.860352'
                    y='0.838989'
                    width='3785.16'
                    height='2840.26'
                    filterUnits='userSpaceOnUse'
                    colorInterpolationFilters='sRGB'
                >
                    <feFlood
                        floodOpacity='0'
                        result='BackgroundImageFix'
                    ></feFlood>
                    <feBlend
                        mode='normal'
                        in='SourceGraphic'
                        in2='BackgroundImageFix'
                        result='shape'
                    ></feBlend>
                    <feGaussianBlur
                        stdDeviation='151'
                        result='effect1_foregroundBlur_1065_8'
                    ></feGaussianBlur>
                </filter>
            </defs>
        </svg>
    );
};
