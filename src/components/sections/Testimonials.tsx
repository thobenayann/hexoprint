import { Card, CardContent } from '@/components/ui/card';
import { Award, Quote, Star, ThumbsUp, Users } from 'lucide-react';

const testimonials = [
    {
        id: 1,
        name: 'Marie Dubois',
        role: 'Ingénieure R&D',
        company: 'TechnoFab',
        content:
            'Hexoprint nous a sauvé sur un projet urgent. Leur réactivité et la qualité de leurs prototypes nous ont permis de respecter nos délais. Un partenaire de confiance !',
        rating: 5,
        category: 'Professionnel',
        avatar: '/avatars/marie-dubois.jpg',
    },
    {
        id: 2,
        name: 'Thomas Martin',
        role: 'Passionné de modélisme',
        company: 'Particulier',
        content:
            "Je recommande vivement ! Mes figurines de collection ont été imprimées avec une précision incroyable. Yann a pris le temps d'écouter mes besoins spécifiques.",
        rating: 5,
        category: 'Particulier',
        avatar: '/avatars/thomas-martin.jpg',
    },
    {
        id: 3,
        name: 'Sophie Leroy',
        role: 'Responsable production',
        company: 'MécanoPro',
        content:
            'Collaboration excellente pour le remplacement de pièces obsolètes. Hexoprint a su reproduire parfaitement nos spécifications techniques. Très professionnel.',
        rating: 5,
        category: 'Professionnel',
        avatar: '/avatars/sophie-leroy.jpg',
    },
    {
        id: 4,
        name: 'Lucas Bernard',
        role: 'Designer produit',
        company: 'Créatif indépendant',
        content:
            "Service au top ! J'ai pu concrétiser mes idées créatives grâce à leur expertise technique. Les conseils fournis ont vraiment amélioré mon projet final.",
        rating: 5,
        category: 'Particulier',
        avatar: '/avatars/lucas-bernard.jpg',
    },
];

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
        value: '200+',
        label: 'Avis positifs',
        description: 'depuis 3 ans',
    },
];

export function Testimonials() {
    return (
        <section className='relative py-24 overflow-hidden bg-gradient-to-b from-background via-primary/5 to-background'>
            {/* Background pattern */}
            <div className='absolute inset-0 bg-[url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZGVmcz4KICAgIDxwYXR0ZXJuIGlkPSJzdGFycyIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KICAgICAgPHBhdGggZD0ibTIwIDVsMyA5aDlsLTcgNSAzIDktOS01LTktNSAzLTktNy01aDl6IiBmaWxsPSIjMjQ1NTZBIiBmaWxsLW9wYWNpdHk9IjAuMDMiLz4KICAgIDwvcGF0dGVybj4KICA8L2RlZnM+CiAgPHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNzdGFycykiLz4KPC9zdmc+")] opacity-40'></div>

            <div className='container mx-auto px-4 relative z-10'>
                {/* Header */}
                <div className='text-center mb-20'>
                    <h2 className='text-2xl md:text-3xl lg:text-4xl font-bold mb-6 md:mb-8 text-foreground'>
                        Ils nous font{' '}
                        <span className='text-primary'>confiance</span>
                    </h2>
                    <p className='text-base md:text-lg lg:text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed'>
                        Découvrez l'expérience de nos clients et leur
                        satisfaction après avoir collaboré avec Hexoprint.
                    </p>
                </div>

                {/* Testimonials Grid */}
                <div className='grid grid-cols-1 md:grid-cols-2 gap-8 mb-20 max-w-6xl mx-auto'>
                    {testimonials.map((testimonial, index) => (
                        <div key={testimonial.id} className='group relative'>
                            {/* Glass morphism card */}
                            <Card className='relative border-0 bg-card/50 backdrop-blur-sm hover:bg-card/70 transition-all duration-500 group-hover:scale-105 group-hover:shadow-2xl overflow-hidden cursor-pointer'>
                                {/* Gradient border effect */}
                                <div className='absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-hexo-blue-light/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg'></div>

                                <CardContent className='p-8 relative z-10'>
                                    {/* Quote icon */}
                                    <div className='mb-6'>
                                        <div className='relative inline-block'>
                                            <div className='p-3 bg-gradient-to-br from-primary/20 to-primary/30 rounded-xl backdrop-blur-sm border border-border group-hover:scale-110 group-hover:rotate-12 transition-all duration-300'>
                                                <Quote className='w-6 h-6 text-primary' />
                                            </div>
                                            {/* Floating glow */}
                                            <div className='absolute inset-0 bg-primary/20 rounded-xl blur-lg scale-150 opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
                                        </div>
                                    </div>

                                    {/* Testimonial content */}
                                    <blockquote className='text-lg text-muted-foreground leading-relaxed mb-6 group-hover:text-foreground transition-colors duration-300'>
                                        "{testimonial.content}"
                                    </blockquote>

                                    {/* Rating */}
                                    <div className='flex items-center gap-1 mb-6'>
                                        {[...Array(testimonial.rating)].map(
                                            (_, i) => (
                                                <Star
                                                    key={i}
                                                    className='w-5 h-5 fill-yellow-400 text-yellow-400'
                                                />
                                            )
                                        )}
                                    </div>

                                    {/* Author info */}
                                    <div className='flex items-center gap-4'>
                                        {/* Avatar placeholder with gradient */}
                                        <div className='w-12 h-12 bg-gradient-to-br from-primary to-hexo-blue-light rounded-full flex items-center justify-center text-primary-foreground font-semibold text-lg'>
                                            {testimonial.name
                                                .split(' ')
                                                .map((n) => n[0])
                                                .join('')}
                                        </div>

                                        <div className='flex-1'>
                                            <div className='font-semibold text-foreground group-hover:text-primary transition-colors duration-300'>
                                                {testimonial.name}
                                            </div>
                                            <div className='text-sm text-muted-foreground'>
                                                {testimonial.role} •{' '}
                                                {testimonial.company}
                                            </div>
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

                            {/* Floating accent */}
                            <div
                                className={`absolute -inset-1 bg-gradient-to-r ${
                                    testimonial.category === 'Professionnel'
                                        ? 'from-primary/20 to-transparent'
                                        : 'from-hexo-blue-light/20 to-transparent'
                                } rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10`}
                            ></div>
                        </div>
                    ))}
                </div>

                {/* Highlights Section */}
                <div className='relative'>
                    {/* Glass morphism background */}
                    <div className='absolute inset-0 bg-gradient-to-br from-card/70 via-primary/10 to-card/70 backdrop-blur-xl border border-border rounded-3xl'></div>

                    {/* Content */}
                    <div className='relative z-10 p-8 md:p-12'>
                        <div className='text-center mb-12'>
                            <h3 className='text-lg md:text-xl lg:text-2xl font-bold text-foreground mb-4'>
                                Une satisfaction{' '}
                                <span className='text-primary'>unanime</span>
                            </h3>
                            <p className='text-sm md:text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed'>
                                La qualité de notre travail se reflète dans la
                                satisfaction de nos clients, qui nous font
                                confiance projet après projet.
                            </p>
                        </div>

                        {/* Stats */}
                        <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
                            {highlights.map((highlight, index) => {
                                const IconComponent = highlight.icon;

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
                                            {highlight.value}
                                        </div>
                                        <div className='text-base md:text-lg font-semibold text-foreground mb-1 group-hover:text-primary transition-colors duration-300'>
                                            {highlight.label}
                                        </div>
                                        <div className='text-xs md:text-sm text-muted-foreground'>
                                            {highlight.description}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Subtle background glow */}
                    <div className='absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/5 to-hexo-blue-light/5 blur-2xl'></div>
                </div>
            </div>
        </section>
    );
}
