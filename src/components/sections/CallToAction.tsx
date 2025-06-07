'use client';

import { Button } from '@/components/ui/button';
import { Spotlight } from '@/components/ui/spotlight';
import { motion } from 'framer-motion';
import { CheckCircle, Clock, FileText } from 'lucide-react';
import Link from 'next/link';

export function CallToAction() {
    return (
        <section className='relative py-20 bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 overflow-hidden'>
            {/* Background Effects */}
            <Spotlight
                className='top-40 left-0 md:left-60 md:-top-20 opacity-20'
                fill='cyan'
            />
            <Spotlight
                className='top-20 right-0 md:right-60 md:-top-10 opacity-15'
                fill='blue'
            />

            <div className='container mx-auto px-4 relative z-10'>
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true, margin: '-100px' }}
                    className='text-center max-w-4xl mx-auto'
                >
                    {/* Main Heading */}
                    <h2 className='text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6'>
                        Prêt à concrétiser{' '}
                        <span className='bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent'>
                            votre projet
                        </span>
                        ?
                    </h2>

                    {/* Subtitle */}
                    <p className='text-lg md:text-xl text-gray-300 mb-12 leading-relaxed'>
                        Obtenez un devis personnalisé, rapide et sans engagement
                        pour vos projets d&apos;impression 3D. Notre expertise
                        technique est à votre service pour transformer vos idées
                        en réalité.
                    </p>

                    {/* Features Grid */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        viewport={{ once: true, margin: '-100px' }}
                        className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-12'
                    >
                        <div className='flex flex-col items-center p-6 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10'>
                            <FileText className='w-8 h-8 text-cyan-400 mb-4' />
                            <h3 className='text-white font-semibold mb-2'>
                                Devis détaillé
                            </h3>
                            <p className='text-gray-400 text-sm text-center'>
                                Analyse précise de votre projet avec conseils
                                techniques personnalisés
                            </p>
                        </div>

                        <div className='flex flex-col items-center p-6 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10'>
                            <Clock className='w-8 h-8 text-blue-400 mb-4' />
                            <h3 className='text-white font-semibold mb-2'>
                                Réponse rapide
                            </h3>
                            <p className='text-gray-400 text-sm text-center'>
                                Retour sous 24h maximum pour tous vos projets
                                d&apos;impression 3D
                            </p>
                        </div>

                        <div className='flex flex-col items-center p-6 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10'>
                            <CheckCircle className='w-8 h-8 text-cyan-400 mb-4' />
                            <h3 className='text-white font-semibold mb-2'>
                                Sans engagement
                            </h3>
                            <p className='text-gray-400 text-sm text-center'>
                                Devis gratuit et sans obligation, pour explorer
                                toutes les possibilités
                            </p>
                        </div>
                    </motion.div>

                    {/* Main CTA Button */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        viewport={{ once: true, margin: '-100px' }}
                        className='mb-8'
                    >
                        <Link href='/devis'>
                            <Button
                                size='lg'
                                className='bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold px-12 py-6 text-xl shadow-2xl hover:shadow-cyan-500/25 transition-all duration-300 transform hover:scale-105 border-0'
                            >
                                Demander mon devis gratuit
                            </Button>
                        </Link>
                    </motion.div>

                    {/* Secondary Actions */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.6 }}
                        viewport={{ once: true, margin: '-100px' }}
                        className='flex flex-col sm:flex-row gap-4 justify-center items-center'
                    >
                        <Link href='/contact'>
                            <Button
                                variant='outline'
                                size='lg'
                                className='border-white/30 text-white hover:bg-white/10 hover:border-white/50 bg-transparent font-medium px-8 py-3'
                            >
                                Nous contacter
                            </Button>
                        </Link>

                        <Link href='/galerie'>
                            <Button
                                variant='ghost'
                                size='lg'
                                className='text-gray-300 hover:text-white hover:bg-white/5 font-medium px-8 py-3'
                            >
                                Voir nos réalisations
                            </Button>
                        </Link>
                    </motion.div>

                    {/* Trust Elements */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.8 }}
                        viewport={{ once: true, margin: '-100px' }}
                        className='mt-12 pt-8 border-t border-white/10'
                    >
                        <div className='flex flex-col sm:flex-row items-center justify-center gap-6 text-gray-400 text-sm'>
                            <div className='flex items-center'>
                                <CheckCircle className='w-4 h-4 text-green-400 mr-2' />
                                <span>Expertise technique garantie</span>
                            </div>
                            <div className='flex items-center'>
                                <CheckCircle className='w-4 h-4 text-green-400 mr-2' />
                                <span>Livraison dans toute la France</span>
                            </div>
                            <div className='flex items-center'>
                                <CheckCircle className='w-4 h-4 text-green-400 mr-2' />
                                <span>Accompagnement personnalisé</span>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}
