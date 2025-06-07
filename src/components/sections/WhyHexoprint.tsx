'use client';

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
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
            staggerChildren: 0.2,
        },
    },
};

const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
            ease: 'easeOut',
        },
    },
};

export function WhyHexoprint() {
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
                        Pourquoi choisir{' '}
                        <span className='bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent'>
                            Hexoprint
                        </span>
                        ?
                    </h2>
                    <p className='text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed'>
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
                    className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'
                >
                    {values.map((value, index) => {
                        const IconComponent = value.icon;
                        return (
                            <motion.div key={index} variants={cardVariants}>
                                <Card className='h-full bg-white hover:shadow-lg transition-shadow duration-300 border-2 hover:border-blue-100'>
                                    <CardHeader className='text-center pb-4'>
                                        <div className='mx-auto mb-4 p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full w-16 h-16 flex items-center justify-center'>
                                            <IconComponent className='w-8 h-8 text-white' />
                                        </div>
                                        <CardTitle className='text-xl font-semibold text-gray-900 leading-tight'>
                                            {value.title}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className='pt-0'>
                                        <CardDescription className='text-gray-600 text-center leading-relaxed'>
                                            {value.description}
                                        </CardDescription>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        );
                    })}
                </motion.div>

                {/* Additional Content Section */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    viewport={{ once: true, margin: '-100px' }}
                    className='mt-16 text-center'
                >
                    <div className='bg-white rounded-2xl p-8 md:p-12 shadow-sm border-2 border-gray-100'>
                        <h3 className='text-2xl md:text-3xl font-bold text-gray-900 mb-4'>
                            Une expertise technique au service de vos idées
                        </h3>
                        <p className='text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed'>
                            Fondée par Yann, un technicien passionné par
                            l&apos;impression 3D, Hexoprint mêle savoir-faire
                            artisanal et rigueur technique. De la création des
                            plans jusqu&apos;au produit final, chaque étape est
                            maîtrisée avec minutie.
                        </p>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
