'use client';

import { Card, CardContent } from '@/components/ui/card';
import { useTestimonials } from '@/hooks/use-testimonials';
import {
    Award,
    Loader2,
    Quote,
    RefreshCw,
    Shield,
    Star,
    ThumbsUp,
    Users,
} from 'lucide-react';

const highlights = [
    {
        icon: Users,
        value: '100%',
        label: 'Clients recommandent',
        description: 'nos services',
    },
    {
        icon: Award,
        value: '5★',
        label: 'Note moyenne',
        description: 'sur tous les avis',
    },
    {
        icon: ThumbsUp,
        value: '3/3',
        label: 'Avis positifs',
        description: 'depuis 3 ans',
    },
];

export function Testimonials() {
    const { testimonials, isLoading, error, isGoogleSource, retry } =
        useTestimonials();

    if (error && testimonials.length === 0) {
        return (
            <section className="relative py-24 overflow-hidden bg-gradient-to-b from-background via-primary/5 to-background">
                <div className="container mx-auto px-4 relative z-10">
                    <div className="text-center">
                        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-6 text-foreground">
                            Erreur lors du chargement des avis
                        </h2>
                        <p className="text-muted-foreground mb-6">{error}</p>
                        <button
                            onClick={retry}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                        >
                            <RefreshCw className="w-4 h-4" />
                            Réessayer
                        </button>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="relative py-24 overflow-hidden bg-gradient-to-b from-background via-primary/5 to-background">
            {/* Background pattern */}
            <div className='absolute inset-0 bg-[url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZGVmcz4KICAgIDxwYXR0ZXJuIGlkPSJzdGFycyIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KICAgICAgPHBhdGggZD0ibTIwIDVsMyA5aDlsLTcgNSAzIDktOS01LTktNSAzLTktNy01aDl6IiBmaWxsPSIjMjQ1NTZBIiBmaWxsLW9wYWNpdHk9IjAuMDMiLz4KICAgIDwvcGF0dGVybj4KICA8L2RlZnM+CiAgPHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNzdGFycykiLz4KPC9zdmc+")] opacity-40'></div>

            <div className="container mx-auto px-4 relative z-10">
                {/* Header */}
                <div className="text-center mb-20">
                    <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-6 md:mb-8 text-foreground">
                        Ils nous font{' '}
                        <span className="text-primary">confiance</span>
                    </h2>
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <p className="text-base md:text-lg lg:text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
                            Découvrez l&apos;expérience de nos clients et leur
                            satisfaction après avoir collaboré avec Hexoprint.
                        </p>
                        {isGoogleSource && (
                            <div className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
                                <Shield className="w-3 h-3" />
                                Avis Google vérifiés
                            </div>
                        )}
                    </div>
                </div>

                {/* Loading State */}
                {isLoading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="flex items-center gap-3 text-muted-foreground">
                            <Loader2 className="w-6 h-6 animate-spin" />
                            <span className="text-lg">
                                Chargement des avis...
                            </span>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Testimonials Bento Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-8 gap-4 md:gap-6 mb-20 max-w-7xl mx-auto auto-rows-max items-start">
                            {testimonials.map((testimonial, index) => {
                                // Pattern Bento : alternance de tailles pour créer l'effet
                                const gridClasses = [
                                    'md:col-span-3 lg:col-span-4', // Large
                                    'md:col-span-3 lg:col-span-4', // Large
                                    'md:col-span-2 lg:col-span-3', // Medium
                                    'md:col-span-4 lg:col-span-5', // Extra Large
                                    'md:col-span-3 lg:col-span-4', // Large
                                    'md:col-span-3 lg:col-span-4', // Large
                                ];

                                const spanClass =
                                    gridClasses[index % gridClasses.length];

                                return (
                                    <div
                                        key={testimonial.id}
                                        className={`${spanClass}`}
                                    >
                                        {/* Glass morphism card */}
                                        <Card className="group relative border-0 bg-card/50 backdrop-blur-sm hover:bg-card/70 transition-all duration-300 hover:scale-[1.01] hover:shadow-2xl overflow-hidden cursor-pointer self-start flex flex-col">
                                            {/* Gradient border effect */}
                                            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-hexo-blue-light/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg h-fit"></div>

                                            <CardContent className="p-6 md:p-8 relative z-10 flex flex-col h-full">
                                                {/* Header avec indicateur Google */}
                                                <div className="flex items-start justify-between mb-6">
                                                    {/* Quote icon */}
                                                    <div className="relative inline-block">
                                                        <div className="p-3 bg-gradient-to-br from-primary/20 to-primary/30 rounded-xl backdrop-blur-sm border border-border group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                                                            <Quote className="w-6 h-6 text-primary" />
                                                        </div>
                                                        {/* Floating glow */}
                                                        <div className="absolute inset-0 bg-primary/20 rounded-xl blur-lg scale-150 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                                    </div>

                                                    {/* Google verified badge */}
                                                    {testimonial.isVerifiedGoogle && (
                                                        <div className="flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
                                                            <Shield className="w-3 h-3" />
                                                            Google
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Testimonial content */}
                                                <blockquote className="text-base md:text-lg text-muted-foreground leading-relaxed mb-6 group-hover:text-foreground transition-colors duration-300 flex-grow">
                                                    &ldquo;{testimonial.content}
                                                    &rdquo;
                                                </blockquote>

                                                {/* Rating */}
                                                <div className="flex items-center gap-1 mb-6 mt-auto">
                                                    {[
                                                        ...Array(
                                                            testimonial.rating
                                                        ),
                                                    ].map((_, i) => (
                                                        <Star
                                                            key={i}
                                                            className="w-4 h-4 md:w-5 md:h-5 fill-yellow-400 text-yellow-400"
                                                        />
                                                    ))}
                                                </div>

                                                {/* Author info */}
                                                <div className="flex items-center gap-4">
                                                    {/* Avatar */}
                                                    <div className="w-12 h-12 rounded-full flex items-center justify-center text-primary-foreground font-semibold text-lg overflow-hidden">
                                                        {testimonial.avatar ? (
                                                            /* eslint-disable-next-line @next/next/no-img-element */
                                                            <img
                                                                src={
                                                                    testimonial.avatar
                                                                }
                                                                alt={
                                                                    testimonial.name
                                                                }
                                                                className="w-full h-full object-cover"
                                                                onError={(
                                                                    e: React.SyntheticEvent<
                                                                        HTMLImageElement,
                                                                        Event
                                                                    >
                                                                ) => {
                                                                    // Fallback en cas d'erreur de chargement de l'image
                                                                    const target =
                                                                        e.target as HTMLImageElement;
                                                                    target.style.display =
                                                                        'none';
                                                                    target.parentElement!.innerHTML =
                                                                        testimonial.name
                                                                            .split(
                                                                                ' '
                                                                            )
                                                                            .map(
                                                                                (
                                                                                    n
                                                                                ) =>
                                                                                    n[0]
                                                                            )
                                                                            .join(
                                                                                ''
                                                                            );
                                                                    target.parentElement!.className +=
                                                                        ' bg-gradient-to-br from-primary to-hexo-blue-light';
                                                                }}
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full bg-gradient-to-br from-primary to-hexo-blue-light flex items-center justify-center">
                                                                {testimonial.name
                                                                    .split(' ')
                                                                    .map(
                                                                        (n) =>
                                                                            n[0]
                                                                    )
                                                                    .join('')}
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="flex-1">
                                                        <div className="font-semibold text-foreground group-hover:text-primary transition-colors duration-300">
                                                            {testimonial.name}
                                                        </div>
                                                        <div className="text-sm text-muted-foreground">
                                                            {testimonial.role} •{' '}
                                                            {
                                                                testimonial.company
                                                            }
                                                        </div>
                                                        {testimonial.date && (
                                                            <div className="text-xs text-muted-foreground/70 mt-1">
                                                                {
                                                                    testimonial.date
                                                                }
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Category badge */}
                                                    <div
                                                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                                                            testimonial.category ===
                                                            'Professionnel'
                                                                ? 'bg-primary/20 text-primary'
                                                                : 'bg-hexo-blue-light/20 text-hexo-blue-light'
                                                        }`}
                                                    >
                                                        {testimonial.category}
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>
                                );
                            })}
                        </div>
                    </>
                )}

                {/* Highlights Section */}
                <div className="relative">
                    {/* Glass morphism background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-card/70 via-primary/10 to-card/70 backdrop-blur-xl border border-border rounded-3xl"></div>

                    {/* Content */}
                    <div className="relative z-10 p-8 md:p-12">
                        <div className="text-center mb-12">
                            <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-foreground mb-4">
                                Une satisfaction{' '}
                                <span className="text-primary">unanime</span>
                            </h3>
                            <p className="text-sm md:text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                                La qualité de notre travail se reflète dans la
                                satisfaction de nos clients, qui nous font
                                confiance projet après projet.
                            </p>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {highlights.map((highlight, index) => {
                                const IconComponent = highlight.icon;

                                return (
                                    <div
                                        key={index}
                                        className="text-center group cursor-pointer"
                                    >
                                        {/* Icon with animated background */}
                                        <div className="mb-6 mx-auto">
                                            <div className="relative inline-block">
                                                <div className="p-4 bg-gradient-to-br from-primary/20 to-primary/30 rounded-2xl backdrop-blur-sm border border-border group-hover:scale-105 group-hover:rotate-3 transition-all duration-300">
                                                    <div className="p-3 bg-primary rounded-xl shadow-lg shadow-primary/30">
                                                        <IconComponent className="w-6 h-6 text-primary-foreground" />
                                                    </div>
                                                </div>
                                                {/* Floating glow */}
                                                <div className="absolute inset-0 bg-primary/20 rounded-2xl blur-xl scale-150 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                            </div>
                                        </div>

                                        {/* Stats */}
                                        <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-primary mb-2 group-hover:scale-105 transition-transform duration-300">
                                            {highlight.value}
                                        </div>
                                        <div className="text-base md:text-lg font-semibold text-foreground mb-1 group-hover:text-primary transition-colors duration-300">
                                            {highlight.label}
                                        </div>
                                        <div className="text-xs md:text-sm text-muted-foreground">
                                            {highlight.description}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Subtle background glow */}
                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/5 to-hexo-blue-light/5 blur-2xl"></div>
                </div>
            </div>
        </section>
    );
}
