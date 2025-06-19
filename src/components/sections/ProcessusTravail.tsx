'use client';

import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import {
    CheckCircle,
    FileText,
    MessageCircle,
    Palette,
    Settings,
    Truck,
} from 'lucide-react';

const processSteps = [
    {
        id: 1,
        icon: MessageCircle,
        title: 'Échange & écoute',
        description:
            'Nous discutons ensemble de votre projet, vos besoins et vos contraintes pour bien comprendre vos attentes.',
        duration: '15 min',
    },
    {
        id: 2,
        icon: FileText,
        title: 'Analyse technique',
        description:
            'Étude de faisabilité, choix des matériaux et validation technique de votre fichier ou création du plan 3D.',
        duration: '24h',
    },
    {
        id: 3,
        icon: Palette,
        title: 'Devis personnalisé',
        description:
            'Proposition détaillée avec prix transparent, délais précis et conseils pour optimiser votre projet.',
        duration: '48h',
    },
    {
        id: 4,
        icon: Settings,
        title: 'Production',
        description:
            'Impression 3D avec surveillance continue, contrôle qualité et ajustements si nécessaire.',
        duration: '2-5 jours',
    },
    {
        id: 5,
        icon: CheckCircle,
        title: 'Contrôle qualité',
        description:
            'Vérification minutieuse des dimensions, finition et conformité avant validation finale.',
        duration: '1h',
    },
    {
        id: 6,
        icon: Truck,
        title: 'Livraison',
        description:
            'Conditionnement soigné et livraison sécurisée ou remise en main propre selon votre préférence.',
        duration: '24-48h',
    },
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
};

const stepVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: {
        opacity: 1,
        x: 0,
        transition: {
            duration: 0.6,
            ease: 'easeOut',
        },
    },
};

export function ProcessusTravail() {
    return (
        <section className='relative py-24 overflow-hidden bg-gradient-to-b from-background to-muted/30'>
            {/* Decorative background pattern */}
            <div className='absolute inset-0 bg-[url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KPGcgZmlsbD0iIzI0NTU2QSIgZmlsbC1vcGFjaXR5PSIwLjA1Ij4KPGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPgo8L2c+CjwvZz4KPC9zdmc+")] opacity-40'></div>

            <div className='container mx-auto px-4 relative z-10'>
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    viewport={{ once: true, margin: '-100px' }}
                    className='text-center mb-20'
                >
                    <h2 className='text-2xl md:text-3xl lg:text-4xl font-bold mb-6 md:mb-8 text-foreground'>
                        Notre <span className='text-primary'>processus</span> de
                        travail
                    </h2>
                    <p className='text-base md:text-lg lg:text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed'>
                        De votre première idée à la livraison finale, découvrez
                        les 6 étapes qui garantissent la réussite de votre
                        projet d&apos;impression 3D.
                    </p>
                </motion.div>

                {/* Process Steps */}
                <motion.div
                    variants={containerVariants}
                    initial='hidden'
                    whileInView='visible'
                    viewport={{ once: true, margin: '-100px' }}
                    className='max-w-4xl mx-auto'
                >
                    {processSteps.map((step, index) => {
                        const IconComponent = step.icon;
                        const isEven = index % 2 === 0;

                        return (
                            <motion.div
                                key={step.id}
                                variants={stepVariants}
                                className='relative'
                            >
                                {/* Connector line */}
                                {index < processSteps.length - 1 && (
                                    <div className='absolute left-6 top-20 w-0.5 h-16 bg-gradient-to-b from-primary/50 to-primary/20 hidden md:block' />
                                )}

                                <div
                                    className={`flex flex-col md:flex-row gap-6 mb-8 ${
                                        isEven ? '' : 'md:flex-row-reverse'
                                    }`}
                                >
                                    {/* Step Number & Icon */}
                                    <div className='flex-shrink-0'>
                                        <div className='relative'>
                                            <div className='flex items-center justify-center w-12 h-12 bg-primary rounded-full text-primary-foreground font-bold text-lg shadow-lg shadow-primary/30'>
                                                {step.id}
                                            </div>
                                            <div className='absolute -top-1 -right-1 p-2 bg-primary/10 rounded-full'>
                                                <IconComponent className='w-4 h-4 text-primary' />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className='flex-1'>
                                        <Card className='border-0 bg-background/50 backdrop-blur-sm hover:bg-background/70 transition-all duration-300 group'>
                                            <CardContent className='p-6'>
                                                <div
                                                    className={`flex flex-col gap-4 ${
                                                        isEven
                                                            ? ''
                                                            : 'md:items-end md:text-right'
                                                    }`}
                                                >
                                                    <div>
                                                        <div className='flex items-center gap-3 mb-2'>
                                                            {!isEven && (
                                                                <span className='text-xs text-primary font-medium bg-primary/10 px-2 py-1 rounded-full'>
                                                                    {
                                                                        step.duration
                                                                    }
                                                                </span>
                                                            )}
                                                            <h3 className='text-lg md:text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-300'>
                                                                {step.title}
                                                            </h3>
                                                            {isEven && (
                                                                <span className='text-xs text-primary font-medium bg-primary/10 px-2 py-1 rounded-full'>
                                                                    {
                                                                        step.duration
                                                                    }
                                                                </span>
                                                            )}
                                                        </div>
                                                        <p className='text-sm md:text-base text-muted-foreground leading-relaxed group-hover:text-foreground transition-colors duration-300'>
                                                            {step.description}
                                                        </p>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </motion.div>

                {/* Bottom CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    viewport={{ once: true, margin: '-100px' }}
                    className='mt-20 text-center'
                >
                    <div className='relative inline-block'>
                        {/* Glass morphism background */}
                        <div className='absolute inset-0 bg-gradient-to-br from-card/50 via-primary/10 to-card/50 backdrop-blur-xl border border-border rounded-2xl'></div>

                        {/* Content */}
                        <div className='relative z-10 p-8 md:p-12'>
                            <h3 className='text-lg md:text-xl lg:text-2xl font-bold text-foreground mb-4'>
                                Prêt à{' '}
                                <span className='text-primary'>commencer</span>{' '}
                                votre projet ?
                            </h3>
                            <p className='text-sm md:text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed'>
                                Contactez-nous dès aujourd&apos;hui pour
                                discuter de votre projet. La première
                                consultation est gratuite et sans engagement.
                            </p>

                            {/* Decorative elements */}
                            <div
                                className='mt-8 flex justify-center space-x-2'
                                role='img'
                                aria-label='Indicateurs de progression'
                            >
                                <div className='w-2 h-2 bg-primary rounded-full animate-pulse motion-reduce:animate-none'></div>
                                <div className='w-2 h-2 bg-primary/70 rounded-full animate-pulse delay-75 motion-reduce:animate-none'></div>
                                <div className='w-2 h-2 bg-primary rounded-full animate-pulse delay-150 motion-reduce:animate-none'></div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
