'use client';

import { SplineScene } from '@/components/ui/spline';
import { Spotlight } from '@/components/ui/spotlight';
import { StarBorder } from '@/components/ui/star-border';
import { motion } from 'framer-motion';
import Link from 'next/link';

export function HeroSection() {
    return (
        <section className='relative min-h-screen bg-background overflow-hidden'>
            {/* Spotlight Background Effect */}
            <Spotlight
                className='-top-40 left-0 md:left-60 md:-top-20 z-50'
                size={300}
            />

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
                <div className='flex-1 p-8 lg:p-16 xl:p-24 relative z-20 flex flex-col justify-start md:justify-center items-center lg:items-start text-center lg:text-left'>
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className='max-w-3xl mx-auto lg:mx-0'
                    >
                        {/* Main Heading */}
                        <motion.h1
                            className='text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-6 leading-tight text-foreground'
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
                            className='text-base md:text-lg lg:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed'
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
                            <span className='inline-block bg-muted/50 backdrop-blur-sm border border-border rounded-full px-6 py-2 text-sm text-muted-foreground'>
                                📍 Seysses, Haute-Garonne (31) • Livraison dans
                                toute la France
                            </span>
                        </motion.div>
                    </motion.div>
                </div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                className='absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10'
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.5 }}
            >
                <div className='flex flex-col items-center text-muted-foreground'>
                    <span className='text-sm mb-2'>Découvrez nos services</span>
                    <motion.div
                        animate={{ y: [0, 10, 0] }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            repeatType: 'reverse',
                        }}
                        className='w-6 h-10 border-2 border-border rounded-full flex justify-center motion-reduce:animate-none'
                        role='img'
                        aria-label='Indicateur de défilement'
                    >
                        <motion.div
                            animate={{ y: [0, 12, 0] }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                repeatType: 'reverse',
                            }}
                            className='w-1 h-3 bg-muted-foreground rounded-full mt-2'
                        />
                    </motion.div>
                </div>
            </motion.div>
        </section>
    );
}
