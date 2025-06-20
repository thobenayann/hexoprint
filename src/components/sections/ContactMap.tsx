import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { MapPinIcon, ShieldCheckIcon, TruckIcon } from 'lucide-react';

export function ContactMap() {
    return (
        <section className='py-20 md:py-32 bg-gradient-to-b from-background to-muted/10'>
            <div className='container mx-auto px-4 max-w-6xl'>
                <div className='text-center mb-16'>
                    <Badge
                        variant='outline'
                        className='px-4 py-2 text-sm font-medium border-primary/20 bg-primary/5 mb-4'
                    >
                        <MapPinIcon className='w-4 h-4 mr-2 text-primary' />
                        Localisation & Livraison
                    </Badge>
                    <h2 className='text-3xl md:text-4xl font-bold mb-4'>
                        Proche de vous en Haute-Garonne
                    </h2>
                    <p className='text-lg text-muted-foreground max-w-2xl mx-auto'>
                        Basé à Seysses, notre atelier d&apos;impression 3D
                        dessert toute la région toulousaine avec des solutions
                        de livraison adaptées à vos besoins.
                    </p>
                </div>

                <div className='grid lg:grid-cols-3 gap-8'>
                    {/* Carte stylisée */}
                    <div className='lg:col-span-2'>
                        <Card className='border-border/50 overflow-hidden'>
                            <CardContent className='p-0'>
                                <div className='relative h-96 bg-gradient-to-br from-primary/10 via-background to-accent/10'>
                                    {/* Grille de fond */}
                                    <div className='absolute inset-0 opacity-20'>
                                        <div className='absolute inset-0 bg-[linear-gradient(45deg,theme(colors.border)_1px,transparent_1px),linear-gradient(-45deg,theme(colors.border)_1px,transparent_1px)] bg-[length:30px_30px]' />
                                    </div>

                                    {/* Cercles de zone de service */}
                                    <div className='absolute inset-0 flex items-center justify-center'>
                                        {/* Zone principale - 25km */}
                                        <div className='absolute w-48 h-48 rounded-full border-2 border-primary/30 bg-primary/5 animate-pulse' />
                                        {/* Zone étendue - 50km */}
                                        <div className='absolute w-64 h-64 rounded-full border-2 border-accent/20 bg-accent/3' />
                                        {/* Zone large - 100km */}
                                        <div className='absolute w-80 h-80 rounded-full border-2 border-muted-foreground/10' />
                                    </div>

                                    {/* Point central - Seysses */}
                                    <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
                                        <div className='w-4 h-4 bg-primary rounded-full animate-ping absolute' />
                                        <div className='w-4 h-4 bg-primary rounded-full' />
                                        <div className='absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-background px-2 py-1 rounded shadow-lg border border-border text-xs font-medium whitespace-nowrap'>
                                            Seysses (31)
                                        </div>
                                    </div>

                                    {/* Points de référence */}
                                    <div className='absolute top-1/3 right-1/3'>
                                        <div className='w-2 h-2 bg-accent rounded-full' />
                                        <div className='absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-background px-2 py-1 rounded shadow-lg border border-border text-xs whitespace-nowrap'>
                                            Toulouse
                                        </div>
                                    </div>

                                    <div className='absolute bottom-1/3 left-1/4'>
                                        <div className='w-2 h-2 bg-accent rounded-full' />
                                        <div className='absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-background px-2 py-1 rounded shadow-lg border border-border text-xs whitespace-nowrap'>
                                            Muret
                                        </div>
                                    </div>

                                    {/* Légende */}
                                    <div className='absolute bottom-4 left-4 bg-background/95 backdrop-blur-sm p-3 rounded-lg border border-border shadow-lg'>
                                        <div className='space-y-2'>
                                            <div className='flex items-center space-x-2 text-xs'>
                                                <div className='w-3 h-3 rounded-full bg-primary' />
                                                <span>
                                                    Atelier Hexo&apos;print
                                                </span>
                                            </div>
                                            <div className='flex items-center space-x-2 text-xs'>
                                                <div className='w-3 h-1 bg-primary/30' />
                                                <span>
                                                    Zone de livraison gratuite
                                                    (25km)
                                                </span>
                                            </div>
                                            <div className='flex items-center space-x-2 text-xs'>
                                                <div className='w-3 h-1 bg-accent/20' />
                                                <span>
                                                    Zone de service étendue
                                                    (50km)
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Informations de livraison */}
                    <div className='space-y-6'>
                        <Card className='border-border/50'>
                            <CardContent className='p-6'>
                                <div className='flex items-start space-x-3 mb-4'>
                                    <div className='w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center'>
                                        <TruckIcon className='w-5 h-5 text-primary' />
                                    </div>
                                    <div>
                                        <h3 className='font-semibold text-lg'>
                                            Livraison locale
                                        </h3>
                                        <p className='text-sm text-muted-foreground'>
                                            Gratuite dans un rayon de 25km
                                        </p>
                                    </div>
                                </div>
                                <ul className='space-y-2 text-sm'>
                                    <li className='flex items-center space-x-2'>
                                        <div className='w-1.5 h-1.5 bg-primary rounded-full' />
                                        <span>
                                            Seysses et communes limitrophes
                                        </span>
                                    </li>
                                    <li className='flex items-center space-x-2'>
                                        <div className='w-1.5 h-1.5 bg-primary rounded-full' />
                                        <span>Sud de Toulouse</span>
                                    </li>
                                    <li className='flex items-center space-x-2'>
                                        <div className='w-1.5 h-1.5 bg-primary rounded-full' />
                                        <span>Muret et environs</span>
                                    </li>
                                </ul>
                            </CardContent>
                        </Card>

                        <Card className='border-border/50'>
                            <CardContent className='p-6'>
                                <div className='flex items-start space-x-3 mb-4'>
                                    <div className='w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center'>
                                        <MapPinIcon className='w-5 h-5 text-primary' />
                                    </div>
                                    <div>
                                        <h3 className='font-semibold text-lg'>
                                            Zone étendue
                                        </h3>
                                        <p className='text-sm text-muted-foreground'>
                                            Livraison à tarif préférentiel
                                        </p>
                                    </div>
                                </div>
                                <ul className='space-y-2 text-sm'>
                                    <li className='flex items-center space-x-2'>
                                        <div className='w-1.5 h-1.5 bg-accent rounded-full' />
                                        <span>Toulouse métropole</span>
                                    </li>
                                    <li className='flex items-center space-x-2'>
                                        <div className='w-1.5 h-1.5 bg-accent rounded-full' />
                                        <span>Haute-Garonne (31)</span>
                                    </li>
                                    <li className='flex items-center space-x-2'>
                                        <div className='w-1.5 h-1.5 bg-accent rounded-full' />
                                        <span>Départements limitrophes</span>
                                    </li>
                                </ul>
                            </CardContent>
                        </Card>

                        <Card className='border-border/50 bg-gradient-to-br from-green-50/50 to-green-100/30 dark:from-green-950/20 dark:to-green-900/10'>
                            <CardContent className='p-6'>
                                <div className='flex items-start space-x-3 mb-4'>
                                    <div className='w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center'>
                                        <ShieldCheckIcon className='w-5 h-5 text-green-600 dark:text-green-400' />
                                    </div>
                                    <div>
                                        <h3 className='font-semibold text-lg'>
                                            Envoi postal
                                        </h3>
                                        <p className='text-sm text-muted-foreground'>
                                            Partout en France
                                        </p>
                                    </div>
                                </div>
                                <ul className='space-y-2 text-sm'>
                                    <li className='flex items-center space-x-2'>
                                        <div className='w-1.5 h-1.5 bg-green-500 rounded-full' />
                                        <span>Emballage sécurisé</span>
                                    </li>
                                    <li className='flex items-center space-x-2'>
                                        <div className='w-1.5 h-1.5 bg-green-500 rounded-full' />
                                        <span>Suivi de livraison</span>
                                    </li>
                                    <li className='flex items-center space-x-2'>
                                        <div className='w-1.5 h-1.5 bg-green-500 rounded-full' />
                                        <span>Assurance incluse</span>
                                    </li>
                                </ul>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Informations complémentaires */}
                <div className='mt-16 grid md:grid-cols-3 gap-6'>
                    <div className='text-center'>
                        <div className='w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4'>
                            <MapPinIcon className='w-8 h-8 text-primary' />
                        </div>
                        <h3 className='font-semibold text-lg mb-2'>
                            Position stratégique
                        </h3>
                        <p className='text-sm text-muted-foreground'>
                            Idéalement situé entre Toulouse et les coteaux,
                            accessible par A64 et A61
                        </p>
                    </div>

                    <div className='text-center'>
                        <div className='w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4'>
                            <TruckIcon className='w-8 h-8 text-primary' />
                        </div>
                        <h3 className='font-semibold text-lg mb-2'>
                            Livraison flexible
                        </h3>
                        <p className='text-sm text-muted-foreground'>
                            Options de livraison adaptées : main propre, point
                            relais ou envoi postal
                        </p>
                    </div>

                    <div className='text-center'>
                        <div className='w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4'>
                            <ShieldCheckIcon className='w-8 h-8 text-green-500' />
                        </div>
                        <h3 className='font-semibold text-lg mb-2'>
                            Service garanti
                        </h3>
                        <p className='text-sm text-muted-foreground'>
                            Emballage professionnel et garantie qualité sur
                            toutes nos réalisations
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
