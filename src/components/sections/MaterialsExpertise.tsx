'use client';

import { GlareCard } from '@/components/ui/glare-card';
import { motion } from 'framer-motion';
import { Shield, Sparkles, Wrench, Zap } from 'lucide-react';

const materials = [
    {
        id: 'pla',
        name: 'PLA',
        fullName: 'Acide Polylactique',
        icon: Sparkles,
        description:
            'Matériau écologique et facile à imprimer, idéal pour débuter et créer des objets décoratifs avec une excellente qualité de surface.',
        properties: [
            { label: 'Biodégradable', value: true },
            { label: 'Facile à imprimer', value: true },
            { label: 'Peu odorant', value: true },
            { label: 'Température basse', value: '190-220°C' },
        ],
        applications: ['Prototypage', 'Déco', 'Figurines', 'Éducation'],
        color: 'from-green-500/20 to-emerald-500/20',
        iconBg: 'from-green-500/30 to-emerald-500/30',
        borderColor: 'border-green-500/30',
    },
    {
        id: 'abs',
        name: 'ABS',
        fullName: 'Acrylonitrile Butadiène Styrène',
        icon: Shield,
        description:
            'Plastique technique robuste et résistant aux chocs, parfait pour les pièces fonctionnelles nécessitant durabilité et résistance mécanique.',
        properties: [
            { label: 'Résistant aux chocs', value: true },
            { label: 'Flexible', value: true },
            { label: 'Résistant chaleur', value: '80-100°C' },
            { label: 'Post-traitement', value: 'Ponçage, collage' },
        ],
        applications: [
            'Pièces auto',
            'Boîtiers',
            'Outils',
            'Pièces mécaniques',
        ],
        color: 'from-blue-500/20 to-cyan-500/20',
        iconBg: 'from-blue-500/30 to-cyan-500/30',
        borderColor: 'border-blue-500/30',
    },
    {
        id: 'petg',
        name: 'PETG',
        fullName: 'Polyéthylène Téréphtalate Glycol',
        icon: Zap,
        description:
            'Combine facilité d&apos;impression du PLA et résistance de l&apos;ABS. Transparent, résistant chimiquement, idéal pour applications alimentaires.',
        properties: [
            { label: 'Transparent', value: true },
            { label: 'Résistant chimique', value: true },
            { label: 'Alimentaire', value: 'Compatible' },
            { label: 'Recyclable', value: true },
        ],
        applications: [
            'Contenants',
            'Pièces transparentes',
            'Médical',
            'Alimentaire',
        ],
        color: 'from-orange-500/20 to-amber-500/20',
        iconBg: 'from-orange-500/30 to-amber-500/30',
        borderColor: 'border-orange-500/30',
    },
    {
        id: 'resin',
        name: 'Résine',
        fullName: 'Résine Photopolymère',
        icon: Wrench,
        description:
            'Impression haute précision pour détails fins et surfaces lisses. Idéale pour bijoux, miniatures et prototypes nécessitant une finition parfaite.',
        properties: [
            { label: 'Haute précision', value: '0.01mm' },
            { label: 'Surface lisse', value: true },
            { label: 'Détails fins', value: true },
            { label: 'Post-traitement', value: 'UV, ponçage' },
        ],
        applications: ['Bijoux', 'Miniatures', 'Dentaire', 'Art'],
        color: 'from-purple-500/20 to-pink-500/20',
        iconBg: 'from-purple-500/30 to-pink-500/30',
        borderColor: 'border-purple-500/30',
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

const listVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
        opacity: 1,
        x: 0,
        transition: {
            duration: 0.4,
            ease: 'easeOut',
        },
    },
};

export function MaterialsExpertise() {
    return (
        <section className='relative py-24 overflow-hidden bg-gradient-to-br from-background via-primary/20 to-background'>
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
                        Expertise{' '}
                        <span className='text-primary'>matériaux</span>
                    </h2>
                    <p className='text-base md:text-lg lg:text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed'>
                        Nous maîtrisons une large gamme de matériaux pour
                        répondre à tous vos besoins : du prototypage rapide aux
                        pièces fonctionnelles haute performance.
                    </p>
                </motion.div>

                <motion.div
                    variants={containerVariants}
                    initial='hidden'
                    whileInView='visible'
                    viewport={{ once: true, margin: '-100px' }}
                    className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6 justify-items-center'
                >
                    {materials.map((material) => {
                        const IconComponent = material.icon;
                        return (
                            <motion.div
                                key={material.id}
                                variants={cardVariants}
                                className='w-full max-w-sm md:max-w-none'
                            >
                                <GlareCard className='h-full min-h-[400px] p-6 flex flex-col group cursor-pointer'>
                                    {/* Glass morphism background */}
                                    <div className='absolute inset-0 bg-gradient-to-br from-card/50 via-card/30 to-card/50 backdrop-blur-xl border border-border rounded-[var(--radius)] group-hover:from-card/70 group-hover:via-card/50 group-hover:to-card/70 transition-all duration-500'></div>

                                    {/* Content */}
                                    <div className='relative z-10 flex flex-col h-full'>
                                        {/* Header with icon */}
                                        <div className='text-center mb-6'>
                                            <div
                                                className={`mx-auto mb-4 p-4 bg-gradient-to-br ${material.iconBg} rounded-2xl backdrop-blur-sm border border-border group-hover:scale-110 transition-all duration-300 w-fit`}
                                            >
                                                <div className='p-3 bg-primary rounded-xl shadow-lg shadow-primary/30'>
                                                    <IconComponent
                                                        className='w-8 h-8 text-primary-foreground'
                                                        aria-hidden='true'
                                                    />
                                                </div>
                                            </div>
                                            <h3 className='text-xl font-bold text-foreground mb-1 group-hover:text-primary transition-colors duration-300'>
                                                {material.name}
                                            </h3>
                                            <p className='text-xs text-muted-foreground'>
                                                {material.fullName}
                                            </p>
                                        </div>

                                        {/* Description */}
                                        <p className='text-sm text-muted-foreground leading-relaxed mb-6 group-hover:text-foreground transition-colors duration-300'>
                                            {material.description}
                                        </p>

                                        {/* Properties */}
                                        <div className='mb-4'>
                                            <h4 className='text-sm font-semibold text-foreground mb-3'>
                                                Propriétés
                                            </h4>
                                            <motion.ul
                                                className='space-y-2'
                                                variants={listVariants}
                                                initial='hidden'
                                                whileInView='visible'
                                                viewport={{ once: true }}
                                            >
                                                {material.properties.map(
                                                    (property, propIndex) => (
                                                        <motion.li
                                                            key={propIndex}
                                                            variants={
                                                                itemVariants
                                                            }
                                                            className='flex items-center text-xs text-muted-foreground'
                                                        >
                                                            <div className='w-2 h-2 bg-primary rounded-full mr-2 flex-shrink-0' />
                                                            {property.label}
                                                        </motion.li>
                                                    )
                                                )}
                                            </motion.ul>
                                        </div>

                                        {/* Applications */}
                                        <div className='mt-auto'>
                                            <h4 className='text-sm font-semibold text-foreground mb-3'>
                                                Applications
                                            </h4>
                                            <motion.div
                                                className='flex flex-wrap gap-2'
                                                variants={listVariants}
                                                initial='hidden'
                                                whileInView='visible'
                                                viewport={{ once: true }}
                                            >
                                                {material.applications.map(
                                                    (app, appIndex) => (
                                                        <motion.span
                                                            key={appIndex}
                                                            variants={
                                                                itemVariants
                                                            }
                                                            className='px-3 py-1 text-xs bg-primary/20 text-primary rounded-full border border-primary/30 backdrop-blur-sm'
                                                        >
                                                            {app}
                                                        </motion.span>
                                                    )
                                                )}
                                            </motion.div>
                                        </div>
                                    </div>

                                    {/* Subtle glow effect */}
                                    <div
                                        className={`absolute inset-0 rounded-[var(--radius)] bg-gradient-to-br ${material.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                                    ></div>
                                </GlareCard>
                            </motion.div>
                        );
                    })}
                </motion.div>

                {/* Additional Content Section */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    viewport={{ once: true, margin: '-100px' }}
                    className='mt-20'
                >
                    <div className='relative'>
                        {/* Glass morphism background */}
                        <div className='absolute inset-0 bg-gradient-to-br from-card/50 via-primary/10 to-card/50 backdrop-blur-xl border border-border rounded-3xl'></div>

                        {/* Content */}
                        <div className='relative z-10 p-8 md:p-12 text-center'>
                            <h3 className='text-lg md:text-xl lg:text-2xl font-bold text-foreground mb-4 md:mb-6'>
                                Conseils personnalisés pour le{' '}
                                <span className='text-primary'>bon choix</span>
                            </h3>
                            <p className='text-sm md:text-base lg:text-lg text-muted-foreground max-w-4xl mx-auto leading-relaxed'>
                                Pas sûr du matériau à choisir ? Notre expertise
                                technique vous guide vers la solution optimale
                                selon vos contraintes : résistance, précision,
                                budget et délais.
                            </p>

                            {/* Decorative elements */}
                            <div
                                className='mt-8 flex justify-center space-x-2'
                                role='img'
                                aria-label='Indicateurs de chargement décoratifs'
                            >
                                <div className='w-2 h-2 bg-primary rounded-full animate-pulse motion-reduce:animate-none'></div>
                                <div className='w-2 h-2 bg-primary/70 rounded-full animate-pulse delay-75 motion-reduce:animate-none'></div>
                                <div className='w-2 h-2 bg-primary rounded-full animate-pulse delay-150 motion-reduce:animate-none'></div>
                            </div>
                        </div>

                        {/* Subtle glow for the box */}
                        <div className='absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/5 to-primary/10 blur-xl'></div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
