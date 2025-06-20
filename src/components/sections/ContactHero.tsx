import { Badge } from '@/components/ui/badge';
import { RubiksCube3D } from '@/components/ui/rubiks-cube-3d';
import { MailIcon, PhoneIcon, PlusIcon } from 'lucide-react';

export function ContactHero() {
    return (
        <section className='relative bg-gradient-to-br from-primary/5 via-background to-accent/10 py-20 md:py-32 overflow-hidden'>
            {/* Grille décorative */}
            <div className='absolute inset-0 opacity-30'>
                <div className='absolute inset-0 bg-[linear-gradient(45deg,theme(colors.border)_1px,transparent_1px),linear-gradient(-45deg,theme(colors.border)_1px,transparent_1px)] bg-[length:20px_20px]' />
            </div>

            <div className='container relative mx-auto px-4 max-w-7xl'>
                <div className='grid lg:grid-cols-2 gap-12 items-center'>
                    {/* Contenu textuel */}
                    <div className='space-y-8'>
                        <div className='space-y-4'>
                            <Badge
                                variant='outline'
                                className='px-4 py-2 text-sm font-medium border-primary/20 bg-primary/5'
                            >
                                <PlusIcon className='w-4 h-4 mr-2 text-primary' />
                                Contact & Devis Gratuit
                            </Badge>

                            <h1 className='text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight'>
                                Donnons vie à{' '}
                                <span className='text-primary'>
                                    votre projet
                                </span>{' '}
                                d&apos;impression 3D
                            </h1>
                        </div>

                        <div className='space-y-6'>
                            <p className='text-lg md:text-xl text-muted-foreground leading-relaxed'>
                                Chez Hexo&apos;print, chaque impression compte,
                                même la plus petite pièce. Obtenez un{' '}
                                <strong className='text-foreground'>
                                    devis personnalisé
                                </strong>{' '}
                                pour votre projet d&apos;impression 3D et
                                bénéficiez de notre expertise technique.
                            </p>

                            <div className='grid sm:grid-cols-2 gap-4'>
                                <div className='flex items-center space-x-3 p-4 rounded-lg bg-card border border-border'>
                                    <div className='w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center'>
                                        <MailIcon className='w-5 h-5 text-primary' />
                                    </div>
                                    <div>
                                        <p className='font-semibold text-sm'>
                                            Réponse rapide
                                        </p>
                                        <p className='text-xs text-muted-foreground'>
                                            Sous 24h ouvrées
                                        </p>
                                    </div>
                                </div>

                                <div className='flex items-center space-x-3 p-4 rounded-lg bg-card border border-border'>
                                    <div className='w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center'>
                                        <PhoneIcon className='w-5 h-5 text-primary' />
                                    </div>
                                    <div>
                                        <p className='font-semibold text-sm'>
                                            Conseil gratuit
                                        </p>
                                        <p className='text-xs text-muted-foreground'>
                                            Expertise technique
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Élément visuel 3D - Rubik's Cube */}
                    <div className='hidden lg:block relative'>
                        <div className='relative w-full h-96 rounded-2xl overflow-hidden bg-gradient-to-br from-primary/5 to-accent/10 border border-border/20'>
                            <RubiksCube3D />
                            {/* Overlay subtil pour l'intégration */}
                            <div className='absolute inset-0 bg-gradient-to-t from-background/10 via-transparent to-background/5 pointer-events-none' />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
