'use client';

import { GlareCard } from '@/components/ui/glare-card';
import { motion } from 'framer-motion';
import { Clock, Target, Truck, Users } from 'lucide-react';

const values = [
    {
        icon: Users,
        title: 'Accompagnement personnalisé',
        description:
            "Nous prenons le temps de comprendre vos besoins et vous accompagnons de A à Z dans vos projets d'impression 3D.",
    },
    {
        icon: Target,
        title: 'Impressions de précision',
        description:
            'Maîtrise technique avancée pour des pièces parfaitement ajustées, quelle que soit la complexité de votre projet.',
    },
    {
        icon: Clock,
        title: 'Rapidité et disponibilité',
        description:
            'Devis rapide, production efficace et écoute permanente pour répondre à vos urgences et demandes spécifiques.',
    },
    {
        icon: Truck,
        title: 'Livraison dans toute la France',
        description:
            'Service de livraison sécurisé pour recevoir vos pièces imprimées où que vous soyez en France métropolitaine.',
    },
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
        },
    },
};

const cardVariants = {
    hidden: { opacity: 0, y: 60, scale: 0.8 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            duration: 0.7,
            ease: [0.25, 0.46, 0.45, 0.94],
        },
    },
};

export function WhyHexoprint() {
    return (
        <section className='relative py-24 overflow-hidden bg-gradient-to-br from-hexo-black via-hexo-blue-dark to-hexo-black'>
            {/* Pattern overlay */}
            <div className='absolute inset-0 bg-[url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZGVmcz4KICAgIDxwYXR0ZXJuIGlkPSJkb3RzIiB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPgogICAgICA8Y2lyY2xlIGN4PSIxMCIgY3k9IjEwIiByPSIxLjUiIGZpbGw9InJnYmEoMjUwLDI1MCwyNTAsMC4xKSIvPgogICAgPC9wYXR0ZXJuPgogIDwvZGVmcz4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2RvdHMpIi8+Cjwvc3ZnPg==")] opacity-30'></div>

            <div className='container mx-auto px-4 relative z-10'>
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    viewport={{ once: true, margin: '-100px' }}
                    className='text-center mb-20'
                >
                    <h2 className='text-4xl md:text-5xl lg:text-6xl font-bold mb-8 text-hexo-white'>
                        Pourquoi choisir{' '}
                        <span className='text-hexo-blue-light'>Hexoprint</span>?
                    </h2>
                    <p className='text-xl md:text-2xl text-hexo-gray max-w-4xl mx-auto leading-relaxed'>
                        Notre promesse : un résultat qui répond précisément à
                        vos attentes, quelle que soit la complexité ou la taille
                        de votre projet.
                    </p>
                </motion.div>

                <motion.div
                    variants={containerVariants}
                    initial='hidden'
                    whileInView='visible'
                    viewport={{ once: true, margin: '-100px' }}
                    className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6'
                >
                    {values.map((value, index) => {
                        const IconComponent = value.icon;
                        return (
                            <motion.div key={index} variants={cardVariants}>
                                <GlareCard className='h-full min-h-[320px] p-8 flex flex-col items-center justify-center text-center group'>
                                    {/* Glass morphism background */}
                                    <div className='absolute inset-0 bg-gradient-to-br from-hexo-white/10 via-hexo-white/5 to-hexo-white/10 backdrop-blur-xl border border-hexo-white/20 rounded-[var(--radius)] group-hover:from-hexo-white/20 group-hover:via-hexo-white/10 group-hover:to-hexo-white/20 transition-all duration-500'></div>

                                    {/* Content */}
                                    <div className='relative z-10 flex flex-col items-center justify-center h-full'>
                                        {/* Icon with colorful gradient background */}
                                        <div className='mb-6 p-4 bg-gradient-to-br from-hexo-blue-light/20 to-hexo-blue-dark/20 rounded-2xl backdrop-blur-sm border border-hexo-white/20 group-hover:scale-110 group-hover:from-hexo-blue-light/30 group-hover:to-hexo-blue-dark/30 transition-all duration-300'>
                                            <div className='p-3 bg-gradient-to-br from-hexo-blue-light to-hexo-blue-dark rounded-xl shadow-lg shadow-hexo-blue-dark/30'>
                                                <IconComponent className='w-8 h-8 text-hexo-white' />
                                            </div>
                                        </div>

                                        {/* Title */}
                                        <h3 className='text-xl font-bold text-hexo-white mb-4 leading-tight group-hover:text-hexo-blue-light transition-colors duration-300'>
                                            {value.title}
                                        </h3>

                                        {/* Description */}
                                        <p className='text-hexo-gray leading-relaxed text-sm group-hover:text-hexo-white transition-colors duration-300'>
                                            {value.description}
                                        </p>
                                    </div>

                                    {/* Subtle glow effect */}
                                    <div className='absolute inset-0 rounded-[var(--radius)] bg-gradient-to-br from-hexo-blue-light/5 to-hexo-blue-dark/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500'></div>
                                </GlareCard>
                            </motion.div>
                        );
                    })}
                </motion.div>

                {/* Additional Content Section with colorful glassmorphism */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    viewport={{ once: true, margin: '-100px' }}
                    className='mt-20'
                >
                    <div className='relative'>
                        {/* Glass morphism background with subtle colors */}
                        <div className='absolute inset-0 bg-gradient-to-br from-hexo-white/10 via-hexo-blue-light/5 to-hexo-white/10 backdrop-blur-xl border border-hexo-white/20 rounded-3xl'></div>

                        {/* Content */}
                        <div className='relative z-10 p-8 md:p-12 text-center'>
                            <h3 className='text-3xl md:text-4xl font-bold text-hexo-white mb-6'>
                                Une expertise technique au service de vos{' '}
                                <span className='text-hexo-blue-light'>
                                    idées
                                </span>
                            </h3>
                            <p className='text-lg md:text-xl text-hexo-gray max-w-4xl mx-auto leading-relaxed'>
                                Fondée par Yann, un technicien passionné par
                                l&apos;impression 3D, Hexoprint mêle
                                savoir-faire artisanal et rigueur technique. De
                                la création des plans jusqu&apos;au produit
                                final, chaque étape est maîtrisée avec minutie.
                            </p>

                            {/* Decorative elements with brand colors */}
                            <div className='mt-8 flex justify-center space-x-2'>
                                <div className='w-2 h-2 bg-hexo-blue-light rounded-full animate-pulse'></div>
                                <div className='w-2 h-2 bg-hexo-blue-dark rounded-full animate-pulse delay-75'></div>
                                <div className='w-2 h-2 bg-hexo-blue-light rounded-full animate-pulse delay-150'></div>
                            </div>
                        </div>

                        {/* Subtle colorful glow for the box */}
                        <div className='absolute inset-0 rounded-3xl bg-gradient-to-br from-hexo-blue-light/5 to-hexo-blue-dark/5 blur-xl'></div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
