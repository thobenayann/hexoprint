'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { ArrowRight, Eye } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const galleryItems = [
    {
        src: '/gallerie/petit-bonhomme-no-bg.png',
        alt: 'Figurine personnalisée imprimée en 3D',
        title: 'Figurine personnalisée',
        description: 'Modélisme de précision',
    },
    {
        src: '/gallerie/IMG_20210805_182151-removebg-preview.png',
        alt: 'Pièce technique imprimée en 3D',
        title: 'Pièce industrielle',
        description: 'Prototypage fonctionnel',
    },
    {
        src: '/gallerie/ball-gccf2f1951_1920.jpg',
        alt: 'Objet décoratif en impression 3D',
        title: 'Objet décoratif',
        description: 'Création artistique',
    },
    {
        src: '/gallerie/IMG_20210712_151205-removebg-preview.png',
        alt: 'Pièce de réparation imprimée en 3D',
        title: 'Pièce de réparation',
        description: 'Remplacement sur-mesure',
    },
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
            ease: 'easeOut',
        },
    },
};

export function GalleryPreview() {
    return (
        <section className='py-20 bg-gray-50'>
            <div className='container mx-auto px-4'>
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true, margin: '-100px' }}
                    className='text-center mb-16'
                >
                    <h2 className='text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6'>
                        Exemples de{' '}
                        <span className='bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent'>
                            réalisations
                        </span>
                    </h2>
                    <p className='text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed'>
                        Découvrez notre galerie de réalisations : chaque objet
                        reflète notre passion du détail, notre engagement envers
                        la qualité, et l&apos;étendue de nos compétences
                        techniques.
                    </p>
                </motion.div>

                <motion.div
                    variants={containerVariants}
                    initial='hidden'
                    whileInView='visible'
                    viewport={{ once: true, margin: '-100px' }}
                    className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12'
                >
                    {galleryItems.map((item, index) => (
                        <motion.div key={index} variants={itemVariants}>
                            <Card className='group h-full bg-white hover:shadow-xl transition-all duration-300 border-2 hover:border-blue-100 overflow-hidden'>
                                <div className='relative aspect-square overflow-hidden'>
                                    <Image
                                        src={item.src}
                                        alt={item.alt}
                                        fill
                                        className='object-cover group-hover:scale-105 transition-transform duration-300'
                                        sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw'
                                    />
                                    <div className='absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center'>
                                        <div className='opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                                            <div className='bg-white/90 backdrop-blur-sm rounded-full p-3'>
                                                <Eye className='w-6 h-6 text-gray-900' />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <CardContent className='p-6'>
                                    <h3 className='text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300'>
                                        {item.title}
                                    </h3>
                                    <p className='text-sm text-gray-600'>
                                        {item.description}
                                    </p>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    viewport={{ once: true, margin: '-100px' }}
                    className='text-center'
                >
                    <Link href='/galerie'>
                        <Button
                            size='lg'
                            className='bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold px-8 py-4 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105'
                        >
                            Voir toute la galerie
                            <ArrowRight className='w-5 h-5 ml-2' />
                        </Button>
                    </Link>
                </motion.div>

                {/* Stats Section */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    viewport={{ once: true, margin: '-100px' }}
                    className='mt-20'
                >
                    <div className='bg-white rounded-2xl p-8 md:p-12 shadow-sm border-2 border-gray-100'>
                        <div className='grid grid-cols-1 md:grid-cols-3 gap-8 text-center'>
                            <div>
                                <div className='text-3xl md:text-4xl font-bold text-blue-600 mb-2'>
                                    500+
                                </div>
                                <div className='text-gray-600'>
                                    Projets réalisés
                                </div>
                            </div>
                            <div>
                                <div className='text-3xl md:text-4xl font-bold text-cyan-600 mb-2'>
                                    99%
                                </div>
                                <div className='text-gray-600'>
                                    Clients satisfaits
                                </div>
                            </div>
                            <div>
                                <div className='text-3xl md:text-4xl font-bold text-blue-600 mb-2'>
                                    48h
                                </div>
                                <div className='text-gray-600'>Délai moyen</div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
