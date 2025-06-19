'use client';

import { GlareCard } from '@/components/ui/glare-card';
import { PrimaryButton } from '@/components/ui/primary-button';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Building2, Cpu, Heart, Home, Palette, Wrench } from 'lucide-react';

const prestations = [
    {
        title: 'Professionnels',
        icon: Building2,
        subtitle: 'Solutions industrielles',
        description:
            'Prototypage fonctionnel, réparation rapide, fabrication de pièces spécifiques en petite série. Grâce à notre maîtrise avancée des matériaux et notre capacité à fournir des conseils techniques précis.',
        features: [
            { icon: Cpu, text: 'Prototypage fonctionnel' },
            { icon: Wrench, text: 'Réparation industrielle' },
            { icon: Palette, text: 'Pièces sur-mesure' },
        ],
        buttonText: 'Demander un devis pro',
        buttonHref: '/contact',
        gradient: 'from-blue-500/20 to-indigo-500/20',
        iconBg: 'from-blue-500/30 to-indigo-500/30',
    },
    {
        title: 'Particuliers',
        icon: Home,
        subtitle: 'Créations personnalisées',
        description:
            'Objets décoratifs personnalisés, pièces de modélisme détaillées, projets créatifs sur-mesure. Nous accompagnons chaque client en prenant le temps de comprendre ses besoins.',
        features: [
            { icon: Heart, text: 'Objets personnalisés' },
            { icon: Cpu, text: 'Modélisme de précision' },
            { icon: Palette, text: 'Projets créatifs' },
        ],
        buttonText: 'Découvrir nos créations',
        buttonHref: '/galerie',
        gradient: 'from-emerald-500/20 to-teal-500/20',
        iconBg: 'from-emerald-500/30 to-teal-500/30',
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
    hidden: { opacity: 0, y: 60, scale: 0.9 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            duration: 0.8,
            ease: [0.25, 0.46, 0.45, 0.94],
        },
    },
};

const featureVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
        opacity: 1,
        x: 0,
        transition: {
            duration: 0.5,
            ease: 'easeOut',
        },
    },
};

const buttonVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
            ease: 'easeOut',
            delay: 0.3,
        },
    },
};

export function Prestations() {
    return (
        <section className='relative py-24 overflow-hidden bg-gradient-to-br from-background via-accent/20 to-background'>
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
                    <h2 className='text-2xl md:text-3xl lg:text-4xl font-bold mb-6 md:mb-8 text-foreground'>
                        Nos <span className='text-primary'>prestations</span>
                    </h2>
                    <p className='text-base md:text-lg lg:text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed'>
                        Que vous soyez une entreprise ou un particulier, nous
                        adaptons nos services à vos besoins spécifiques avec la
                        même exigence de qualité.
                    </p>
                </motion.div>

                <motion.div
                    variants={containerVariants}
                    initial='hidden'
                    whileInView='visible'
                    viewport={{ once: true, margin: '-100px' }}
                    className='grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto'
                >
                    {prestations.map((prestation, index) => {
                        const IconComponent = prestation.icon;
                        return (
                            <motion.div
                                key={index}
                                variants={cardVariants}
                                className='w-full flex flex-col'
                            >
                                {/* Card sans bouton */}
                                <GlareCard
                                    className={cn(
                                        'h-full min-h-[400px] p-6 md:p-8 flex flex-col group cursor-pointer mb-6'
                                    )}
                                >
                                    {/* Glass morphism background */}
                                    <div className='absolute inset-0 bg-gradient-to-br from-card/50 via-card/30 to-card/50 backdrop-blur-xl border border-border rounded-[var(--radius)] group-hover:from-card/70 group-hover:via-card/50 group-hover:to-card/70 transition-all duration-500'></div>

                                    {/* Content */}
                                    <div className='relative z-10 flex flex-col h-full'>
                                        {/* Header with icon */}
                                        <div className='flex items-center gap-4 mb-6'>
                                            <div
                                                className={cn(
                                                    'p-3 bg-gradient-to-br rounded-xl backdrop-blur-sm border border-border',
                                                    'group-hover:scale-110 transition-all duration-300',
                                                    prestation.iconBg
                                                )}
                                            >
                                                <div className='p-3 bg-primary rounded-lg shadow-lg shadow-primary/30'>
                                                    <IconComponent
                                                        className='w-6 h-6 text-primary-foreground'
                                                        aria-hidden='true'
                                                    />
                                                </div>
                                            </div>
                                            <div className='flex-1'>
                                                <h3 className='text-xl md:text-2xl font-bold text-foreground group-hover:text-primary transition-colors duration-300'>
                                                    {prestation.title}
                                                </h3>
                                                <p className='text-sm text-muted-foreground'>
                                                    {prestation.subtitle}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Description */}
                                        <p className='text-sm md:text-base text-muted-foreground leading-relaxed mb-6 group-hover:text-foreground transition-colors duration-300'>
                                            {prestation.description}
                                        </p>

                                        {/* Features */}
                                        <motion.div
                                            className='space-y-3 flex-grow'
                                            variants={containerVariants}
                                            initial='hidden'
                                            whileInView='visible'
                                            viewport={{ once: true }}
                                        >
                                            {prestation.features.map(
                                                (feature, featureIndex) => {
                                                    const FeatureIcon =
                                                        feature.icon;
                                                    return (
                                                        <motion.div
                                                            key={featureIndex}
                                                            variants={
                                                                featureVariants
                                                            }
                                                            className={cn(
                                                                'flex items-center gap-3 p-3 rounded-lg',
                                                                'bg-gradient-to-r from-background/50 to-transparent backdrop-blur-sm',
                                                                'border border-border/50 group-hover:border-border',
                                                                'transition-all duration-300'
                                                            )}
                                                        >
                                                            <div className='p-2 bg-primary/20 rounded-lg'>
                                                                <FeatureIcon
                                                                    className='w-4 h-4 text-primary'
                                                                    aria-hidden='true'
                                                                />
                                                            </div>
                                                            <span className='text-sm font-medium text-foreground'>
                                                                {feature.text}
                                                            </span>
                                                        </motion.div>
                                                    );
                                                }
                                            )}
                                        </motion.div>
                                    </div>

                                    {/* Subtle glow effect */}
                                    <div
                                        className={cn(
                                            'absolute inset-0 rounded-[var(--radius)] bg-gradient-to-br opacity-0',
                                            'group-hover:opacity-100 transition-opacity duration-500',
                                            prestation.gradient
                                        )}
                                    ></div>
                                </GlareCard>

                                {/* Bouton CTA en dehors de la carte */}
                                <motion.div
                                    variants={buttonVariants}
                                    className='flex justify-center mt-10'
                                >
                                    <PrimaryButton
                                        href={prestation.buttonHref}
                                        className='w-full max-w-xs hover:scale-105 transition-transform duration-300'
                                    >
                                        {prestation.buttonText}
                                    </PrimaryButton>
                                </motion.div>
                            </motion.div>
                        );
                    })}
                </motion.div>
            </div>
        </section>
    );
}
