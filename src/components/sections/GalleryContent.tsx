'use client';

import { Card, CardContent } from '@/components/ui/card';
import { useGalleryFilters } from '@/hooks/use-gallery-filters';
import { filterGalleryItems } from '@/lib/gallery-filter-utils';
import { getMaterialDisplayName } from '@/lib/gallery-utils';
import { urlFor } from '@/sanity/lib/image';
import {
    getCategoryLabel,
    isForProfessionals,
    type GalleryItemType,
} from '@/types/gallery';
import { motion } from 'framer-motion';
import { Clock, Eye, Package, Zap } from 'lucide-react';
import Image from 'next/image';
import { useMemo } from 'react';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.05,
            delayChildren: 0.1,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.4,
            ease: [0.25, 0.46, 0.45, 0.94],
        },
    },
};

type GalleryContentProps = {
    items: GalleryItemType[];
};

export function GalleryContent({ items }: GalleryContentProps) {
    const { category, material, view } = useGalleryFilters();

    // Filtrer les éléments en utilisant la nouvelle fonction utilitaire
    const filteredItems = useMemo(() => {
        return filterGalleryItems(items, category, material);
    }, [items, category, material]);

    if (!filteredItems.length) {
        return (
            <section className="py-16 bg-gradient-to-br from-background to-muted/20">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center py-16"
                    >
                        <div className="max-w-md mx-auto">
                            <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
                                <Package className="w-8 h-8 text-muted-foreground" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">
                                Aucune réalisation trouvée
                            </h3>
                            <p className="text-muted-foreground">
                                Aucun projet ne correspond aux filtres
                                sélectionnés.
                            </p>
                        </div>
                    </motion.div>
                </div>
            </section>
        );
    }

    return (
        <section className="py-12 bg-gradient-to-br from-background to-muted/20">
            <div className="container mx-auto px-4">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className={`${
                        view === 'grid'
                            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                            : 'space-y-6 max-w-5xl mx-auto'
                    }`}
                >
                    {filteredItems.map((item, index) => (
                        <motion.div
                            key={item._id}
                            variants={itemVariants}
                            className="group relative overflow-hidden"
                        >
                            {view === 'list' ? (
                                // Mode liste - horizontal responsive
                                <div className="flex gap-3 md:gap-6 items-center p-3 md:p-4 rounded-xl bg-card/50 backdrop-blur-sm hover:bg-card/70 transition-all duration-300">
                                    <div className="flex-shrink-0 w-24 h-18 md:w-48 md:h-36 relative overflow-hidden rounded-lg">
                                        <Image
                                            src={urlFor(item.image)
                                                .width(300)
                                                .height(225)
                                                .url()}
                                            alt={item.title}
                                            fill
                                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                                            sizes="(max-width: 768px) 96px, 192px"
                                            loading={
                                                index < 6 ? 'eager' : 'lazy'
                                            }
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    </div>

                                    <div className="flex-1 space-y-1 md:space-y-2 min-w-0">
                                        <h3 className="text-base md:text-lg font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                                            {item.title}
                                        </h3>
                                        <p className="text-xs md:text-sm text-muted-foreground line-clamp-2">
                                            {item.description}
                                        </p>
                                        <div className="flex flex-wrap items-center gap-2 md:gap-4 text-xs text-muted-foreground">
                                            <span className="truncate">
                                                {getCategoryLabel(item.category)}
                                            </span>
                                            <span className="truncate">
                                                {getMaterialDisplayName(
                                                    item.material
                                                )}
                                            </span>
                                            {item.printTime && (
                                                <span>{item.printTime}</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                // Mode grille - réutilise le style de GalleryPreview
                                <Card className="h-full border-0 bg-card/50 backdrop-blur-sm hover:bg-card/70 transition-all duration-500 group-hover:scale-[1.02] group-hover:shadow-xl">
                                    <div className="relative aspect-square overflow-hidden">
                                        <Image
                                            src={urlFor(item.image)
                                                .width(400)
                                                .height(400)
                                                .url()}
                                            alt={item.title}
                                            fill
                                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                                            loading={
                                                index < 8 ? 'eager' : 'lazy'
                                            }
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
                                                {getCategoryLabel(item.category)}
                                            </span>
                                        </div>

                                        {/* Badges techniques */}
                                        <div className="absolute top-4 right-4 flex flex-col gap-2">
                                            <div className="bg-black/60 backdrop-blur-sm rounded-lg px-2 py-1 flex items-center gap-1">
                                                <Zap className="w-3 h-3 text-yellow-400" />
                                                <span className="text-xs text-white font-medium">
                                                    {getMaterialDisplayName(
                                                        item.material
                                                    )}
                                                </span>
                                            </div>

                                            {item.printTime && (
                                                <div className="bg-black/60 backdrop-blur-sm rounded-lg px-2 py-1 flex items-center gap-1">
                                                    <Clock className="w-3 h-3 text-blue-400" />
                                                    <span className="text-xs text-white font-medium">
                                                        {item.printTime}
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
                                        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
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
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </CardContent>

                                    {/* Floating accent */}
                                    <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-hexo-blue-light/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                                </Card>
                            )}
                        </motion.div>
                    ))}
                </motion.div>

                {/* Results count */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-center mt-8"
                >
                    <p className="text-sm text-muted-foreground">
                        {filteredItems.length} réalisation
                        {filteredItems.length > 1 ? 's' : ''} affichée
                        {filteredItems.length > 1 ? 's' : ''}
                        {(category !== 'all' || material !== 'all') && (
                            <span> · Filtres appliqués</span>
                        )}
                    </p>
                </motion.div>
            </div>
        </section>
    );
}
