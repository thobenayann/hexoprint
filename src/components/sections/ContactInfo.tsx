import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
    CheckCircleIcon,
    ClockIcon,
    MailIcon,
    MapPinIcon,
    MessageSquareIcon,
    PhoneIcon,
    StarIcon,
} from 'lucide-react';

const contactInfo = [
    {
        icon: MapPinIcon,
        title: 'Adresse',
        content: 'Seysses, Haute-Garonne (31)',
        description: 'Déplacements possibles dans un rayon de 50km',
        color: 'text-primary',
    },
    {
        icon: PhoneIcon,
        title: 'Téléphone',
        content: '06 XX XX XX XX',
        description: 'Disponible du lundi au vendredi',
        color: 'text-primary',
    },
    {
        icon: MailIcon,
        title: 'Email',
        content: 'contact@hexoprint.fr',
        description: 'Réponse sous 24h ouvrées',
        color: 'text-primary',
    },
];

const advantages = [
    {
        icon: CheckCircleIcon,
        title: 'Expertise technique',
        description: 'Conseils personnalisés pour optimiser votre projet',
    },
    {
        icon: StarIcon,
        title: 'Qualité artisanale',
        description: 'Chaque pièce est contrôlée et finalisée avec soin',
    },
    {
        icon: MessageSquareIcon,
        title: 'Accompagnement complet',
        description: 'De la conception à la livraison, nous vous guidons',
    },
];

export function ContactInfo() {
    return (
        <section className='py-20 md:py-32 bg-gradient-to-b from-muted/20 to-background'>
            <div className='container mx-auto px-4 max-w-6xl'>
                <div className='text-center mb-16'>
                    <Badge
                        variant='outline'
                        className='px-4 py-2 text-sm font-medium border-primary/20 bg-primary/5 mb-4'
                    >
                        <PhoneIcon className='w-4 h-4 mr-2 text-primary' />
                        Nos Coordonnées
                    </Badge>
                    <h2 className='text-3xl md:text-4xl font-bold mb-4'>
                        Parlons de votre projet d&apos;impression 3D
                    </h2>
                    <p className='text-lg text-muted-foreground max-w-2xl mx-auto'>
                        Notre atelier est situé à Seysses, au cœur de la
                        Haute-Garonne. Contactez-nous pour discuter de vos
                        besoins et obtenir des conseils d&apos;expert.
                    </p>
                </div>

                <div className='grid lg:grid-cols-2 gap-12 items-start'>
                    {/* Informations de contact */}
                    <div className='space-y-8'>
                        <div>
                            <h3 className='text-2xl font-semibold mb-6'>
                                Comment nous contacter
                            </h3>
                            <div className='space-y-6'>
                                {contactInfo.map((info, index) => (
                                    <Card
                                        key={index}
                                        className='border-border/50 hover:shadow-md transition-shadow'
                                    >
                                        <CardContent className='p-6'>
                                            <div className='flex items-start space-x-4'>
                                                <div
                                                    className={`w-12 h-12 rounded-full bg-gradient-to-br from-${
                                                        info.color.split('-')[1]
                                                    }/10 to-${
                                                        info.color.split('-')[1]
                                                    }/20 flex items-center justify-center`}
                                                >
                                                    <info.icon
                                                        className={`w-6 h-6 ${info.color}`}
                                                    />
                                                </div>
                                                <div className='flex-1'>
                                                    <h4 className='font-semibold text-lg mb-1'>
                                                        {info.title}
                                                    </h4>
                                                    <p className='text-lg font-medium mb-1'>
                                                        {info.content}
                                                    </p>
                                                    <p className='text-sm text-muted-foreground'>
                                                        {info.description}
                                                    </p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>

                        {/* Horaires */}
                        <Card className='border-border/50'>
                            <CardContent className='p-6'>
                                <div className='flex items-start space-x-4'>
                                    <div
                                        className={`w-12 h-12 rounded-full bg-gradient-to-br from-primary/10 to-primary/20 flex items-center justify-center`}
                                    >
                                        <ClockIcon className='w-6 h-6 text-primary' />
                                    </div>
                                    <div className='flex-1'>
                                        <h4 className='font-semibold text-lg mb-3'>
                                            Horaires d&apos;ouverture
                                        </h4>
                                        <div className='space-y-2 text-sm'>
                                            <div className='flex justify-between'>
                                                <span>Lundi - Vendredi</span>
                                                <span className='font-medium'>
                                                    9h00 - 18h00
                                                </span>
                                            </div>
                                            <div className='flex justify-between'>
                                                <span>Samedi</span>
                                                <span className='font-medium'>
                                                    9h00 - 12h00
                                                </span>
                                            </div>
                                            <div className='flex justify-between'>
                                                <span>Dimanche</span>
                                                <span className='text-muted-foreground'>
                                                    Fermé
                                                </span>
                                            </div>
                                        </div>
                                        <p className='text-xs text-muted-foreground mt-3'>
                                            * Rendez-vous possibles en dehors
                                            des horaires sur demande
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Avantages */}
                    <div className='space-y-8'>
                        <div>
                            <h3 className='text-2xl font-semibold mb-6'>
                                Pourquoi choisir Hexo&apos;print ?
                            </h3>
                            <div className='space-y-6'>
                                {advantages.map((advantage, index) => (
                                    <div
                                        key={index}
                                        className='flex items-start space-x-4'
                                    >
                                        <div className='w-10 h-10 rounded-full bg-gradient-to-br from-primary/10 to-primary/20 flex items-center justify-center flex-shrink-0'>
                                            <advantage.icon className='w-5 h-5 text-primary' />
                                        </div>
                                        <div>
                                            <h4 className='font-semibold mb-2'>
                                                {advantage.title}
                                            </h4>
                                            <p className='text-muted-foreground text-sm leading-relaxed'>
                                                {advantage.description}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Zone de service */}
                        <Card className='border-border/50 bg-gradient-to-br from-accent/5 to-primary/5'>
                            <CardContent className='p-6'>
                                <h4 className='font-semibold text-lg mb-3'>
                                    Zone d&apos;intervention
                                </h4>
                                <div className='space-y-3'>
                                    <div className='flex items-center space-x-2'>
                                        <CheckCircleIcon className='w-4 h-4 text-green-500' />
                                        <span className='text-sm'>
                                            Haute-Garonne (31) - Livraison
                                            gratuite
                                        </span>
                                    </div>
                                    <div className='flex items-center space-x-2'>
                                        <CheckCircleIcon className='w-4 h-4 text-green-500' />
                                        <span className='text-sm'>
                                            Toulouse et agglomération
                                        </span>
                                    </div>
                                    <div className='flex items-center space-x-2'>
                                        <CheckCircleIcon className='w-4 h-4 text-green-500' />
                                        <span className='text-sm'>
                                            Envoi postal partout en France
                                        </span>
                                    </div>
                                </div>
                                <p className='text-xs text-muted-foreground mt-4'>
                                    Frais de port calculés selon la taille et le
                                    poids de votre commande
                                </p>
                            </CardContent>
                        </Card>

                        {/* Call to action supplémentaire */}
                        <div className='p-6 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg border border-primary/20'>
                            <h4 className='font-semibold text-lg mb-2'>
                                Une question technique ?
                            </h4>
                            <p className='text-sm text-muted-foreground mb-4'>
                                Nos conseils d&apos;expert sont gratuits.
                                N&apos;hésitez pas à nous appeler pour discuter
                                de la faisabilité de votre projet.
                            </p>
                            <div className='flex items-center space-x-2 text-sm font-medium text-primary'>
                                <PhoneIcon className='w-4 h-4' />
                                <span>06 XX XX XX XX</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
