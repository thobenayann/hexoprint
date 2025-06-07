'use client';

import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Quote, Star } from 'lucide-react';
import { useEffect, useState } from 'react';

const testimonials = [
    {
        name: 'Marie Dubois',
        role: 'Architecte',
        rating: 5,
        text: 'Hexoprint a réalisé des maquettes parfaites pour nos présentations clients. La précision et la finition sont remarquables. Un service vraiment professionnel !',
        avatar: 'M.D',
    },
    {
        name: 'Pierre Legrand',
        role: 'Ingénieur',
        rating: 5,
        text: 'Excellent travail pour le prototypage de nos pièces industrielles. Yann comprend parfaitement nos besoins techniques et livre toujours dans les délais.',
        avatar: 'P.L',
    },
    {
        name: 'Sophie Martin',
        role: 'Particulier',
        rating: 5,
        text: "J'ai fait appel à Hexoprint pour créer des figurines personnalisées. Le résultat dépasse mes attentes ! Un accompagnement de qualité du début à la fin.",
        avatar: 'S.M',
    },
    {
        name: 'Thomas Rousseau',
        role: "Chef d'entreprise",
        rating: 5,
        text: 'Service rapide et efficace pour la réparation de nos pièces de machines. Hexoprint nous a fait gagner un temps précieux avec des solutions innovantes.',
        avatar: 'T.R',
    },
];

export function Testimonials() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);

    useEffect(() => {
        if (!isAutoPlaying) return;

        const interval = setInterval(() => {
            setCurrentIndex(
                (prevIndex) => (prevIndex + 1) % testimonials.length
            );
        }, 5000);

        return () => clearInterval(interval);
    }, [isAutoPlaying]);

    const nextTestimonial = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    };

    const prevTestimonial = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
        );
    };

    const goToTestimonial = (index: number) => {
        setCurrentIndex(index);
    };

    return (
        <section className='py-20 bg-white'>
            <div className='container mx-auto px-4'>
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true, margin: '-100px' }}
                    className='text-center mb-16'
                >
                    <h2 className='text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6'>
                        Témoignages{' '}
                        <span className='bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent'>
                            clients
                        </span>
                    </h2>
                    <p className='text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed'>
                        La satisfaction de nos clients est notre plus belle
                        récompense. Découvrez leurs retours d&apos;expérience
                        avec Hexoprint.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    viewport={{ once: true, margin: '-100px' }}
                    className='max-w-4xl mx-auto'
                    onMouseEnter={() => setIsAutoPlaying(false)}
                    onMouseLeave={() => setIsAutoPlaying(true)}
                >
                    {/* Main Testimonial Card */}
                    <div className='relative overflow-hidden'>
                        <motion.div
                            key={currentIndex}
                            initial={{ opacity: 0, x: 300 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -300 }}
                            transition={{ duration: 0.5, ease: 'easeInOut' }}
                        >
                            <Card className='bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-100 shadow-lg'>
                                <CardContent className='p-8 md:p-12 text-center'>
                                    <Quote className='w-12 h-12 text-blue-500 mx-auto mb-6' />

                                    {/* Stars */}
                                    <div className='flex justify-center mb-6'>
                                        {[
                                            ...Array(
                                                testimonials[currentIndex]
                                                    .rating
                                            ),
                                        ].map((_, i) => (
                                            <Star
                                                key={i}
                                                className='w-5 h-5 fill-yellow-400 text-yellow-400'
                                            />
                                        ))}
                                    </div>

                                    {/* Testimonial Text */}
                                    <blockquote className='text-lg md:text-xl text-gray-700 mb-8 leading-relaxed font-medium'>
                                        &ldquo;{testimonials[currentIndex].text}
                                        &rdquo;
                                    </blockquote>

                                    {/* Author Info */}
                                    <div className='flex items-center justify-center'>
                                        <div className='w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-semibold mr-4'>
                                            {testimonials[currentIndex].avatar}
                                        </div>
                                        <div className='text-left'>
                                            <div className='font-semibold text-gray-900'>
                                                {
                                                    testimonials[currentIndex]
                                                        .name
                                                }
                                            </div>
                                            <div className='text-gray-600 text-sm'>
                                                {
                                                    testimonials[currentIndex]
                                                        .role
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>

                    {/* Navigation */}
                    <div className='flex justify-center items-center mt-8 space-x-4'>
                        {/* Previous Button */}
                        <button
                            onClick={prevTestimonial}
                            className='p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors duration-200'
                            aria-label='Témoignage précédent'
                        >
                            <svg
                                className='w-5 h-5 text-gray-600'
                                fill='none'
                                stroke='currentColor'
                                viewBox='0 0 24 24'
                            >
                                <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth={2}
                                    d='M15 19l-7-7 7-7'
                                />
                            </svg>
                        </button>

                        {/* Dots Indicators */}
                        <div className='flex space-x-2'>
                            {testimonials.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => goToTestimonial(index)}
                                    className={`w-3 h-3 rounded-full transition-all duration-200 ${
                                        index === currentIndex
                                            ? 'bg-blue-500 w-8'
                                            : 'bg-gray-300 hover:bg-gray-400'
                                    }`}
                                    aria-label={`Aller au témoignage ${
                                        index + 1
                                    }`}
                                />
                            ))}
                        </div>

                        {/* Next Button */}
                        <button
                            onClick={nextTestimonial}
                            className='p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors duration-200'
                            aria-label='Témoignage suivant'
                        >
                            <svg
                                className='w-5 h-5 text-gray-600'
                                fill='none'
                                stroke='currentColor'
                                viewBox='0 0 24 24'
                            >
                                <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth={2}
                                    d='M9 5l7 7-7 7'
                                />
                            </svg>
                        </button>
                    </div>

                    {/* Google Reviews Badge */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        viewport={{ once: true, margin: '-100px' }}
                        className='mt-12 text-center'
                    >
                        <div className='inline-flex items-center bg-white border-2 border-gray-100 rounded-full px-6 py-3 shadow-sm'>
                            <div className='flex items-center mr-3'>
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className='w-4 h-4 fill-yellow-400 text-yellow-400'
                                    />
                                ))}
                            </div>
                            <span className='text-sm text-gray-600'>
                                Note moyenne 4.9/5 basée sur 47 avis Google
                            </span>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}
