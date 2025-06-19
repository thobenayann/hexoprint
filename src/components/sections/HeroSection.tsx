'use client';

import { LogoAura } from '@/components/ui/logo-aura';
import { ScrollIndicator } from '@/components/ui/scroll-indicator';
import { SplineScene } from '@/components/ui/spline';
import { Spotlight } from '@/components/ui/spotlight';
import { StarBorder } from '@/components/ui/star-border';
import { motion } from 'framer-motion';
import Link from 'next/link';

export function HeroSection() {
    return (
        <section className='relative min-h-screen bg-background overflow-hidden pt-16 pb-20 md:pt-0 md:pb-0'>
            {/* Spotlight Background Effect */}
            <Spotlight
                className='-top-40 left-0 md:left-60 md:-top-20 z-50'
                size={300}
            />

            {/* Logo Background Effect */}
            <motion.div
                initial={{ opacity: 0, scale: 1.2 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 2, delay: 0.2 }}
                className='absolute top-20 md:top-24 left-1/2 transform -translate-x-1/2 z-[60] flex flex-col items-center pointer-events-none sm:hidden 2xl:block'
            >
                {/* Aura Effect */}
                <LogoAura
                    className='-top-4 -left-4 md:-top-8 md:-left-8'
                    fill='#FAFAFA'
                />

                {/* Logo SVG */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.5, delay: 0.4 }}
                    className='w-[120px] h-[120px] md:w-[250px] md:h-[250px] lg:w-[300px] lg:h-[300px] opacity-[0.4] bg-contain bg-center bg-no-repeat mb-2 md:mb-4'
                    style={{
                        backgroundImage:
                            "url('/logos/logo-hexoprint-svg-sans-texte.svg')",
                    }}
                />

                {/* Custom Text */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.5, delay: 0.6 }}
                    className='text-center opacity-[0.35]'
                >
                    <div className='font-mono font-semibold text-lg md:text-3xl lg:text-4xl text-primary mb-1 md:mb-2 tracking-wider'>
                        HEXO&apos;PRINT
                    </div>
                    <div className='font-mono font-normal text-xs md:text-base lg:text-lg text-muted-foreground tracking-widest'>
                        IMPRESSION 3D
                    </div>
                </motion.div>
            </motion.div>

            <div className='flex flex-col lg:flex-row h-screen relative'>
                {/* Right content - 3D Animation */}
                <div className='absolute max-md:top-[55%] max-md:left-2 md:inset-0 lg:relative lg:flex-1 lg:order-last h-full'>
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className='w-full h-full'
                    >
                        <SplineScene
                            scene='https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode'
                            className='w-full h-full'
                        />
                    </motion.div>
                </div>

                {/* Left content */}
                <div className='flex-1 p-6 md:p-8 lg:p-16 lg:mt-[10%] xl:p-24 relative z-20 flex flex-col justify-end pb-32 md:justify-center lg:justify-center items-center lg:items-start text-center lg:text-left'>
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className='max-w-2xl lg:max-w-3xl mx-auto lg:mx-0 lg:mr-auto lg:ml-0'
                    >
                        {/* Main Heading */}
                        <motion.h1
                            className='text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold mb-4 md:mb-6 leading-tight text-foreground'
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                        >
                            Donnez vie à vos projets avec{' '}
                            <span className='text-primary'>
                                l&apos;impression 3D
                            </span>
                        </motion.h1>

                        {/* Subtitle */}
                        <motion.p
                            className='text-base md:text-lg lg:text-xl leading-relaxed text-muted-foreground mb-6 md:mb-8 max-w-2xl mx-auto lg:mx-0'
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.6 }}
                        >
                            Chez Hexoprint, chaque pièce imprimée raconte une
                            histoire, la vôtre. Prototypage rapide, réparations
                            industrielles ou créations personnalisées.
                        </motion.p>

                        {/* CTA Button */}
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.8 }}
                            className='mb-6'
                        >
                            <Link href='/devis'>
                                <StarBorder
                                    color='#96CFE7'
                                    speed='4s'
                                    className='text-lg font-semibold'
                                >
                                    Demandez votre devis
                                </StarBorder>
                            </Link>
                        </motion.div>

                        {/* Location Badge */}
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 1.0 }}
                        >
                            <span className='inline-block bg-muted/50 backdrop-blur-sm border border-border rounded-full px-4 md:px-6 py-2 text-xs md:text-sm text-muted-foreground'>
                                <span className='hidden sm:inline'>
                                    📍 Seysses, Haute-Garonne (31) • Livraison
                                    dans toute la France
                                </span>
                                <span className='sm:hidden'>
                                    📍 Seysses (31) • France
                                </span>
                            </span>
                        </motion.div>
                    </motion.div>
                </div>
            </div>

            {/* Scroll Indicator */}
            <ScrollIndicator />
        </section>
    );
}
