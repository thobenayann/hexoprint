import { Card, CardContent } from '@/components/ui/card';
import { PrimaryButton } from '@/components/ui/primary-button';
import { featuredGalleryQuery } from '@/lib/sanity-queries';
import { urlFor } from '@/sanity/lib/image';
import { sanityFetch } from '@/sanity/lib/live';
import type { GalleryItemType } from '@/types/gallery';
import { Clock, Eye, Layers, Target, Zap } from 'lucide-react';
import Image from 'next/image';

// Mappings pour les catégories et matériaux
const categoryLabels: Record<string, string> = {
    decoration: 'Décoration',
    modelisme: 'Modélisme',
    reparation: 'Réparation',
    prototype: 'Prototype',
    outillage: 'Outillage',
    art: 'Art & Design',
    fonctionnel: 'Fonctionnel',
    educatif: 'Éducatif',
};

// Mapping pour rétrocompatibilité avec les anciens codes matériaux
const legacyMaterialLabels: Record<string, string> = {
    pla: 'PLA',
    abs: 'ABS',
    petg: 'PETG',
    tpu: 'TPU',
    resin: 'Résine',
    wood: 'Bois',
};

/**
 * Retourne le label d'affichage pour un matériau
 * Compatible avec les anciens codes ET les nouveaux noms en texte libre
 */
const getMaterialDisplayName = (material: string): string => {
    // Si c'est un ancien code, utiliser le mapping
    if (legacyMaterialLabels[material.toLowerCase()]) {
        return legacyMaterialLabels[material.toLowerCase()];
    }
    // Sinon, retourner le nom tel quel (nouveau format texte libre)
    return material;
};

const isForProfessionals = (category: string): boolean => {
    return ['reparation', 'prototype', 'outillage'].includes(category);
};

const stats = [
    {
        icon: Target,
        value: '98%',
        label: 'Satisfaction',
        color: 'primary',
    },
    {
        icon: Layers,
        value: '200+',
        label: 'Projets réalisés',
        color: 'hexo-blue-light',
    },
    {
        icon: Clock,
        value: '48h',
        label: 'Délai moyen',
        color: 'primary',
    },
];

export async function GalleryPreview() {
    const { data: galleryItems } = await sanityFetch({
        query: featuredGalleryQuery,
    });

    // Typage et vérification sécurisée des données
    const typedGalleryItems = (galleryItems as GalleryItemType[] | null) ?? [];
    const displayItems = typedGalleryItems.slice(0, 4);

    return (
        <section className="relative py-24 overflow-hidden bg-gradient-to-br from-muted/20 via-background to-muted/30">
            {/* Animated background pattern */}
            <div className='absolute inset-0 bg-[url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZGVmcz4KICAgIDxwYXR0ZXJuIGlkPSJoZXgiIHdpZHRoPSI1MCIgaGVpZ2h0PSI1MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CiAgICAgIDxwb2x5Z29uIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzI0NTU2QSIgc3Ryb2tlLXdpZHRoPSIwLjUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHBvaW50cz0iMjUsMSA0OCwyNSAyNSw0OSAyLDI1Ii8+CiAgICA8L3BhdHRlcm4+CiAgPC9kZWZzPgogIDxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjaGV4KSIvPgo8L3N2Zz4K")] opacity-30'></div>

            <div className="container mx-auto px-4 relative z-10">
                {/* Header */}
                <div className="text-center mb-20">
                    <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-6 md:mb-8 text-foreground">
                        Notre <span className="text-primary">galerie</span>
                    </h2>
                    <p className="text-base md:text-lg lg:text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
                        Découvrez nos réalisations : chaque création reflète
                        notre passion du détail et l&apos;étendue de nos
                        compétences techniques.
                    </p>
                </div>

                {/* Gallery Grid avec les vraies données */}
                {displayItems.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                        {displayItems.map(
                            (item: GalleryItemType, index: number) => (
                                <div
                                    key={item._id}
                                    className="group relative overflow-hidden"
                                >
                                    {/* Adaptive card sizing pour hiérarchie visuelle */}
                                    <Card
                                        className={`h-full border-0 bg-card/50 backdrop-blur-sm hover:bg-card/70 transition-all duration-500 group-hover:scale-105 group-hover:shadow-2xl ${
                                            index === 0 || index === 3
                                                ? 'md:row-span-2'
                                                : ''
                                        }`}
                                    >
                                        {/* Image container avec overlay */}
                                        <div className="relative aspect-square overflow-hidden">
                                            <Image
                                                src={urlFor(item.image)
                                                    .width(400)
                                                    .height(400)
                                                    .url()}
                                                alt={item.image.alt}
                                                fill
                                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                                            />

                                            {/* Badge catégorie */}
                                            <div className="absolute top-4 left-4">
                                                <span
                                                    className={`px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm border ${
                                                        isForProfessionals(
                                                            item.category
                                                        )
                                                            ? 'bg-primary/20 text-primary border-primary/30'
                                                            : 'bg-hexo-blue-light/20 text-hexo-blue-light border-hexo-blue-light/30'
                                                    }`}
                                                >
                                                    {
                                                        categoryLabels[
                                                            item.category
                                                        ]
                                                    }
                                                </span>
                                            </div>

                                            {/* Nouveaux badges techniques */}
                                            <div className="absolute top-4 right-4 flex flex-col gap-2">
                                                {/* Badge matériau */}
                                                <div className="bg-black/60 backdrop-blur-sm rounded-lg px-2 py-1 flex items-center gap-1">
                                                    <Zap className="w-3 h-3 text-yellow-400" />
                                                    <span className="text-xs text-white font-medium">
                                                        {getMaterialDisplayName(
                                                            item.material
                                                        )}
                                                    </span>
                                                </div>

                                                {/* Badge temps d&apos;impression */}
                                                {item.printTime && (
                                                    <div className="bg-black/60 backdrop-blur-sm rounded-lg px-2 py-1 flex items-center gap-1">
                                                        <Clock className="w-3 h-3 text-blue-400" />
                                                        <span className="text-xs text-white font-medium">
                                                            {item.printTime}h
                                                        </span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Hover overlay */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <div className="bg-white/90 backdrop-blur-sm rounded-full p-4 transform scale-0 group-hover:scale-100 transition-transform duration-300">
                                                        <Eye className="w-6 h-6 text-foreground" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <CardContent className="p-6">
                                            <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
                                                {item.title}
                                            </h3>
                                            <p className="text-sm text-muted-foreground leading-relaxed">
                                                {item.description}
                                            </p>

                                            {/* Informations techniques en bas */}
                                            <div className="mt-4 pt-4 border-t border-border/50">
                                                <div className="flex items-center justify-between text-xs text-muted-foreground">
                                                    <div className="flex items-center gap-1">
                                                        <Zap className="w-3 h-3" />
                                                        <span>
                                                            {getMaterialDisplayName(
                                                                item.material
                                                            )}
                                                        </span>
                                                    </div>
                                                    {item.printTime && (
                                                        <div className="flex items-center gap-1">
                                                            <Clock className="w-3 h-3" />
                                                            <span>
                                                                {item.printTime}
                                                                h
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </CardContent>

                                        {/* Floating accent */}
                                        <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-hexo-blue-light/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                                    </Card>
                                </div>
                            )
                        )}
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <p className="text-lg text-muted-foreground">
                            Aucune réalisation mise en avant pour le moment.
                        </p>
                    </div>
                )}

                {/* CTA Button avec styling spécial */}
                <div className="text-center mb-20">
                    <PrimaryButton href="/galerie">
                        Voir toute la galerie
                    </PrimaryButton>
                </div>

                {/* Section Stats avec glassmorphism moderne */}
                <div className="relative">
                    {/* Glass morphism background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-card/70 via-primary/5 to-card/70 backdrop-blur-xl border border-border rounded-3xl"></div>

                    {/* Content */}
                    <div className="relative z-10 p-8 md:p-12">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {stats.map((stat, index) => {
                                const IconComponent = stat.icon;

                                return (
                                    <div
                                        key={index}
                                        className="text-center group cursor-pointer"
                                    >
                                        {/* Icon avec background animé */}
                                        <div className="mb-6 mx-auto">
                                            <div className="relative inline-block">
                                                <div className="p-4 bg-gradient-to-br from-primary/20 to-primary/30 rounded-2xl backdrop-blur-sm border border-border group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                                                    <div className="p-3 bg-primary rounded-xl shadow-lg shadow-primary/30">
                                                        <IconComponent className="w-6 h-6 text-primary-foreground" />
                                                    </div>
                                                </div>
                                                {/* Floating glow */}
                                                <div className="absolute inset-0 bg-primary/20 rounded-2xl blur-xl scale-150 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                            </div>
                                        </div>

                                        {/* Stats */}
                                        <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-primary mb-2 group-hover:scale-110 transition-transform duration-300">
                                            {stat.value}
                                        </div>
                                        <div className="text-base md:text-lg text-foreground font-medium mb-1">
                                            {stat.label}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Subtle background glow */}
                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/5 to-hexo-blue-light/5 opacity-60"></div>
                </div>
            </div>
        </section>
    );
}
