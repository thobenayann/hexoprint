'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Building2, Cpu, Heart, Home, Palette, Wrench } from 'lucide-react';

const audiences = [
    {
        id: 'professionals',
        title: 'Professionnels',
        subtitle: 'Solutions industrielles & techniques',
        description:
            'Prototypage rapide, réparation industrielle et fabrication de pièces spécifiques en petite série.',
        icon: Building2,
        gradient: 'from-primary/20 via-primary/10 to-primary/5',
        services: [
            {
                icon: Cpu,
                title: 'Prototypage fonctionnel',
                description:
                    'Validez vos concepts avec des prototypes précis et fonctionnels pour accélérer votre développement produit.',
                color: 'primary',
            },
            {
                icon: Wrench,
                title: 'Réparation & dépannage',
                description:
                    'Remplacez rapidement vos pièces défaillantes avec des impressions sur-mesure et retrouvez votre productivité.',
                color: 'primary',
            },
            {
                icon: Building2,
                title: 'Pièces industrielles',
                description:
                    'Production de pièces techniques en petite et moyenne série avec une précision industrielle.',
                color: 'primary',
            },
        ],
    },
    {
        id: 'individuals',
        title: 'Particuliers',
        subtitle: 'Créations sur-mesure & personnalisées',
        description:
            "Objets décoratifs, modélisme et créations personnalisées avec le même niveau d'exigence et de qualité.",
        icon: Home,
        gradient:
            'from-hexo-blue-light/20 via-hexo-blue-light/10 to-hexo-blue-light/5',
        services: [
            {
                icon: Heart,
                title: 'Objets personnalisés',
                description:
                    'Créations uniques et sur-mesure pour vos projets personnels, cadeaux ou événements spéciaux.',
                color: 'hexo-blue-light',
            },
            {
                icon: Palette,
                title: 'Modélisme & figurines',
                description:
                    'Pièces détaillées pour passionnés de modélisme, miniatures et collections avec finition soignée.',
                color: 'hexo-blue-light',
            },
            {
                icon: Home,
                title: 'Objets décoratifs',
                description:
                    'Embellissez votre intérieur avec des créations originales adaptées à votre style et vos goûts.',
                color: 'hexo-blue-light',
            },
        ],
    },
];

export function TargetAudience() {
    return (
        <section className='relative py-24 overflow-hidden bg-gradient-to-b from-background to-muted/30'>
            {/* Decorative background pattern */}
            <div className='absolute inset-0 bg-[url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KPGcgZmlsbD0iIzI0NTU2QSIgZmlsbC1vcGFjaXR5PSIwLjA1Ij4KPGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPgo8L2c+CjwvZz4KPC9zdmc+")] opacity-40'></div>

            <div className='container mx-auto px-4 relative z-10'>
                {/* Header */}
                <div className='text-center mb-20'>
                    <h2 className='text-2xl md:text-3xl lg:text-4xl font-bold mb-6 md:mb-8 text-foreground'>
                        Nos <span className='text-primary'>publics</span>
                    </h2>
                    <p className='text-base md:text-lg lg:text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed'>
                        Professionnels ou particuliers, nous accompagnons tous
                        vos projets avec la même passion du détail et la même
                        exigence de qualité.
                    </p>
                </div>

                {/* Main Content - Split Screen Design */}
                <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-7xl mx-auto'>
                    {audiences.map((audience, index) => {
                        const MainIcon = audience.icon;

                        return (
                            <div key={audience.id} className='relative group'>
                                {/* Main Card */}
                                <div className='relative'>
                                    {/* Glass morphism background */}
                                    <div
                                        className={`absolute inset-0 bg-gradient-to-br ${audience.gradient} backdrop-blur-xl border border-border rounded-3xl group-hover:shadow-2xl transition-all duration-500`}
                                    ></div>

                                    {/* Content */}
                                    <div className='relative z-10 p-8 md:p-12'>
                                        {/* Header with icon */}
                                        <div className='flex items-center gap-6 mb-8'>
                                            <div className='p-4 bg-gradient-to-br from-primary/20 to-primary/30 rounded-2xl backdrop-blur-sm border border-border group-hover:scale-110 transition-transform duration-300 cursor-pointer'>
                                                <div className='p-3 bg-primary rounded-xl shadow-lg shadow-primary/30'>
                                                    <MainIcon className='w-8 h-8 text-primary-foreground' />
                                                </div>
                                            </div>
                                            <div>
                                                <h3 className='text-lg md:text-xl lg:text-2xl font-bold text-foreground mb-2'>
                                                    {audience.title}
                                                </h3>
                                                <p className='text-sm md:text-base lg:text-lg text-muted-foreground'>
                                                    {audience.subtitle}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Description */}
                                        <p className='text-sm md:text-base lg:text-lg text-muted-foreground mb-6 md:mb-8 leading-relaxed'>
                                            {audience.description}
                                        </p>

                                        {/* Services Grid */}
                                        <div className='space-y-4'>
                                            {audience.services.map(
                                                (service, serviceIndex) => {
                                                    const ServiceIcon =
                                                        service.icon;

                                                    return (
                                                        <Card
                                                            key={serviceIndex}
                                                            className='border-0 bg-background/50 backdrop-blur-sm hover:bg-background/70 transition-all duration-300 group/service'
                                                        >
                                                            <CardContent className='p-6'>
                                                                <div className='flex items-start gap-4'>
                                                                    <div className='p-2 bg-primary/10 rounded-lg group-hover/service:bg-primary/20 transition-colors duration-300'>
                                                                        <ServiceIcon className='w-5 h-5 text-primary' />
                                                                    </div>
                                                                    <div className='flex-1'>
                                                                        <h4 className='text-sm md:text-base font-semibold text-foreground mb-2 group-hover/service:text-primary transition-colors duration-300'>
                                                                            {
                                                                                service.title
                                                                            }
                                                                        </h4>
                                                                        <p className='text-xs md:text-sm text-muted-foreground leading-relaxed'>
                                                                            {
                                                                                service.description
                                                                            }
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </CardContent>
                                                        </Card>
                                                    );
                                                }
                                            )}
                                        </div>
                                    </div>

                                    {/* Subtle glow effect */}
                                    <div className='absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/5 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500'></div>
                                </div>

                                {/* Floating accent */}
                                <div
                                    className={`absolute -top-4 -right-4 w-32 h-32 bg-gradient-to-br ${audience.gradient} rounded-full blur-2xl opacity-30 group-hover:opacity-50 transition-opacity duration-500`}
                                ></div>
                            </div>
                        );
                    })}
                </div>

                {/* Bottom CTA */}
                <div className='mt-20 text-center'>
                    <div className='relative inline-block'>
                        {/* Glass morphism background */}
                        <div className='absolute inset-0 bg-gradient-to-br from-card/50 via-primary/10 to-card/50 backdrop-blur-xl border border-border rounded-2xl'></div>

                        {/* Content */}
                        <div className='relative z-10 p-8 md:p-12'>
                            <h3 className='text-lg md:text-xl lg:text-2xl font-bold text-foreground mb-4'>
                                Un projet en tête ?
                            </h3>
                            <p className='text-sm md:text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed'>
                                Contactez-nous pour discuter de votre projet.
                                Chaque demande est unique et mérite une
                                attention particulière.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
