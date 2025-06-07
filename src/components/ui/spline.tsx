'use client';

import { cn } from '@/lib/utils';
import { Suspense, lazy } from 'react';

// Lazy load Spline to improve initial page load
const Spline = lazy(() => import('@splinetool/react-spline'));

type SplineSceneProps = {
    scene: string;
    className?: string;
    fallback?: React.ReactNode;
};

const SplineSceneLoader = ({
    scene,
    className,
}: {
    scene: string;
    className?: string;
}) => {
    return <Spline scene={scene} className={cn('w-full h-full', className)} />;
};

export function SplineScene({ scene, className, fallback }: SplineSceneProps) {
    return (
        <div className={cn('relative w-full h-full', className)}>
            <Suspense
                fallback={
                    fallback || (
                        <div className='flex items-center justify-center w-full h-full bg-black/[0.96] text-white'>
                            <div className='text-center'>
                                <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4'></div>
                                <p className='text-sm text-gray-300'>
                                    Chargement de l&apos;animation 3D...
                                </p>
                            </div>
                        </div>
                    )
                }
            >
                <SplineSceneLoader scene={scene} className={className} />
            </Suspense>
        </div>
    );
}
