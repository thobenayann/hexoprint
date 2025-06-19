'use client';

import { Card, CardContent } from '@/components/ui/card';
import { PrimaryButton } from '@/components/ui/primary-button';
import { Crosshair, Eye, Layers, Timer } from 'lucide-react';
import Image from 'next/image';

const galleryItems = [
    {
        src: '/gallerie/petit-bonhomme-no-bg.png',
        alt: 'Figurine personnalisée imprimée en 3D',
        title: 'Figurine personnalisée',
        description: 'Modélisme de précision',
        category: 'Particuliers',
    },
    {
        src: '/gallerie/IMG_20210805_182151-removebg-preview.png',
        alt: 'Pièce technique imprimée en 3D',
        title: 'Pièce industrielle',
        description: 'Prototypage fonctionnel',
        category: 'Professionnels',
    },
    {
        src: '/gallerie/ball-gccf2f1951_1920.jpg',
        alt: 'Objet décoratif en impression 3D',
        title: 'Objet décoratif',
        description: 'Création artistique',
        category: 'Particuliers',
    },
    {
        src: '/gallerie/IMG_20210712_151205-removebg-preview.png',
        alt: 'Pièce de réparation imprimée en 3D',
        title: 'Pièce de réparation',
        description: 'Remplacement sur-mesure',
        category: 'Professionnels',
    },
];

const stats = [
    {
        icon: Layers,
        value: '500+',
        label: 'Projets réalisés',
        color: 'primary',
    },
    {
        icon: Crosshair,
        value: '99%',
        label: 'Clients satisfaits',
        color: 'hexo-blue-light',
    },
    {
        icon: Timer,
        value: '48h',
        label: 'Délai moyen',
        color: 'primary',
    },
];

export function GalleryPreview() {
    return (
        <section className='relative py-24 overflow-hidden bg-gradient-to-br from-muted/20 via-background to-muted/30'>
            {/* Animated background pattern */}
            <div className='absolute inset-0 bg-[url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZGVmcz4KICAgIDxwYXR0ZXJuIGlkPSJoZXgiIHdpZHRoPSI1MCIgaGVpZ2h0PSI1MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CiAgICAgIDxwb2x5Z29uIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzI0NTU2QSIgc3Ryb2tlLXdpZHRoPSIwLjUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHBvaW50cz0iMjUsMSA0OCwyNSAyNSw0OSAyLDI1Ii8+CiAgICA8L3BhdHRlcm4+CiAgPC9kZWZzPgogIDxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjaGV4KSIvPgo8L3N2Zz4K")] opacity-30'></div>

            <div className='container mx-auto px-4 relative z-10'>
                {/* Header */}
                <div className='text-center mb-20'>
                    <h2 className='text-2xl md:text-3xl lg:text-4xl font-bold mb-6 md:mb-8 text-foreground'>
                        Notre <span className='text-primary'>galerie</span>
                    </h2>
                    <p className='text-base md:text-lg lg:text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed'>
                        Découvrez nos réalisations : chaque création reflète
                        notre passion du détail et l&apos;étendue de nos compétences
                        techniques.
                    </p>
                </div>

                {/* Gallery Grid with Bento Box Layout */}
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16'>
                    {galleryItems.map((item, index) => (
                        <div
                            key={index}
                            className='group relative overflow-hidden'
                        >
                            {/* Adaptive card sizing for visual hierarchy */}
                            <Card
                                className={`h-full border-0 bg-card/50 backdrop-blur-sm hover:bg-card/70 transition-all duration-500 group-hover:scale-105 group-hover:shadow-2xl ${
                                    index === 0 || index === 3
                                        ? 'md:row-span-2'
                                        : ''
                                }`}
                            >
                                {/* Image container with overlay */}
                                <div className='relative aspect-square overflow-hidden'>
                                    <Image
                                        src={item.src}
                                        alt={item.alt}
                                        fill
                                        className='object-cover transition-transform duration-700 group-hover:scale-110'
                                        sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw'
                                    />

                                    {/* Category badge */}
                                    <div className='absolute top-4 left-4'>
                                        <span
                                            className={`px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm border ${
                                                item.category ===
                                                'Professionnels'
                                                    ? 'bg-primary/20 text-primary border-primary/30'
                                                    : 'bg-hexo-blue-light/20 text-hexo-blue-light border-hexo-blue-light/30'
                                            }`}
                                        >
                                            {item.category}
                                        </span>
                                    </div>

                                    {/* Hover overlay */}
                                    <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                                        <div className='absolute inset-0 flex items-center justify-center'>
                                            <div className='bg-white/90 backdrop-blur-sm rounded-full p-4 transform scale-0 group-hover:scale-100 transition-transform duration-300'>
                                                <Eye className='w-6 h-6 text-foreground' />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Content */}
                                <CardContent className='p-6'>
                                    <h3 className='text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors duration-300'>
                                        {item.title}
                                    </h3>
                                    <p className='text-sm text-muted-foreground leading-relaxed'>
                                        {item.description}
                                    </p>
                                </CardContent>

                                {/* Floating accent */}
                                <div className='absolute -inset-1 bg-gradient-to-r from-primary/20 to-hexo-blue-light/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10'></div>
                            </Card>
                        </div>
                    ))}
                </div>

                {/* CTA Button with special styling */}
                <div className='text-center mb-20'>
                    <PrimaryButton href='/galerie'>
                        Voir toute la galerie
                    </PrimaryButton>
                </div>

                {/* Stats Section with modern glassmorphism */}
                <div className='relative'>
                    {/* Glass morphism background */}
                    <div className='absolute inset-0 bg-gradient-to-br from-card/70 via-primary/5 to-card/70 backdrop-blur-xl border border-border rounded-3xl'></div>

                    {/* Content */}
                    <div className='relative z-10 p-8 md:p-12'>
                        <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
                            {stats.map((stat, index) => {
                                const IconComponent = stat.icon;

                                return (
                                    <div
                                        key={index}
                                        className='text-center group cursor-pointer'
                                    >
                                        {/* Icon with animated background */}
                                        <div className='mb-6 mx-auto'>
                                            <div className='relative inline-block'>
                                                <div className='p-4 bg-gradient-to-br from-primary/20 to-primary/30 rounded-2xl backdrop-blur-sm border border-border group-hover:scale-110 group-hover:rotate-6 transition-all duration-300'>
                                                    <div className='p-3 bg-primary rounded-xl shadow-lg shadow-primary/30'>
                                                        <IconComponent className='w-6 h-6 text-primary-foreground' />
                                                    </div>
                                                </div>
                                                {/* Floating glow */}
                                                <div className='absolute inset-0 bg-primary/20 rounded-2xl blur-xl scale-150 opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
                                            </div>
                                        </div>

                                        {/* Stats */}
                                        <div className='text-2xl md:text-3xl lg:text-4xl font-bold text-primary mb-2 group-hover:scale-110 transition-transform duration-300'>
                                            {stat.value}
                                        </div>
                                        <div className='text-base md:text-lg text-muted-foreground group-hover:text-foreground transition-colors duration-300'>
                                            {stat.label}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Bottom message */}
                        <div className='mt-12 text-center border-t border-border pt-8'>
                            <p className='text-sm md:text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed'>
                                Chaque projet est une nouvelle opportunité de
                                repousser les limites de la créativité et de la
                                précision technique.
                            </p>
                        </div>
                    </div>

                    {/* Subtle background glow */}
                    <div className='absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/5 to-hexo-blue-light/5 blur-2xl'></div>
                </div>
            </div>
        </section>
    );
}
