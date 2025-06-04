import { Button } from '@/components/ui/button';

export function HexoThemeShowcase() {
    return (
        <div className='p-8 space-y-8'>
            <div className='space-y-4'>
                <h1 className='text-3xl font-bold text-foreground'>
                    Charte Graphique Hexo'print
                </h1>
                <p className='text-muted-foreground'>
                    Voici les 5 couleurs principales de votre identité visuelle
                    intégrées dans ShadcnUI + Tailwind v4
                </p>
            </div>

            {/* Palette de couleurs principales */}
            <div className='space-y-4'>
                <h2 className='text-xl font-semibold text-foreground'>
                    Couleurs principales
                </h2>
                <div className='grid grid-cols-2 md:grid-cols-5 gap-4'>
                    {/* Blanc */}
                    <div className='space-y-2'>
                        <div className='w-full h-20 bg-hexo-white border-2 border-border rounded-lg shadow-sm'></div>
                        <div className='text-center'>
                            <p className='font-medium text-sm'>Blanc</p>
                            <p className='text-xs text-muted-foreground'>
                                #FAFAFA
                            </p>
                            <code className='text-xs bg-muted px-1 rounded'>
                                bg-hexo-white
                            </code>
                        </div>
                    </div>

                    {/* Gris */}
                    <div className='space-y-2'>
                        <div className='w-full h-20 bg-hexo-gray border-2 border-border rounded-lg shadow-sm'></div>
                        <div className='text-center'>
                            <p className='font-medium text-sm'>Gris</p>
                            <p className='text-xs text-muted-foreground'>
                                #E9E9E9
                            </p>
                            <code className='text-xs bg-muted px-1 rounded'>
                                bg-hexo-gray
                            </code>
                        </div>
                    </div>

                    {/* Bleu clair */}
                    <div className='space-y-2'>
                        <div className='w-full h-20 bg-hexo-blue-light border-2 border-border rounded-lg shadow-sm'></div>
                        <div className='text-center'>
                            <p className='font-medium text-sm'>Bleu clair</p>
                            <p className='text-xs text-muted-foreground'>
                                #96CFE7
                            </p>
                            <code className='text-xs bg-muted px-1 rounded'>
                                bg-hexo-blue-light
                            </code>
                        </div>
                    </div>

                    {/* Bleu foncé */}
                    <div className='space-y-2'>
                        <div className='w-full h-20 bg-hexo-blue-dark border-2 border-border rounded-lg shadow-sm'></div>
                        <div className='text-center'>
                            <p className='font-medium text-sm text-hexo-white'>
                                Bleu foncé
                            </p>
                            <p className='text-xs text-hexo-blue-light'>
                                #24556A
                            </p>
                            <code className='text-xs bg-hexo-black text-hexo-white px-1 rounded'>
                                bg-hexo-blue-dark
                            </code>
                        </div>
                    </div>

                    {/* Noir */}
                    <div className='space-y-2'>
                        <div className='w-full h-20 bg-hexo-black border-2 border-border rounded-lg shadow-sm'></div>
                        <div className='text-center'>
                            <p className='font-medium text-sm text-hexo-white'>
                                Noir
                            </p>
                            <p className='text-xs text-hexo-blue-light'>
                                #293039
                            </p>
                            <code className='text-xs bg-hexo-black text-hexo-white px-1 rounded'>
                                bg-hexo-black
                            </code>
                        </div>
                    </div>
                </div>
            </div>

            {/* Composants ShadcnUI avec le thème */}
            <div className='space-y-4'>
                <h2 className='text-xl font-semibold text-foreground'>
                    Composants ShadcnUI
                </h2>
                <div className='flex flex-wrap gap-4'>
                    <Button variant='default'>Bouton Principal</Button>
                    <Button variant='secondary'>Bouton Secondaire</Button>
                    <Button variant='outline'>Bouton Outline</Button>
                    <Button variant='ghost'>Bouton Ghost</Button>
                    <Button variant='destructive'>Bouton Destructive</Button>
                </div>
            </div>

            {/* Cards de démonstration */}
            <div className='space-y-4'>
                <h2 className='text-xl font-semibold text-foreground'>
                    Cards & Containers
                </h2>
                <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                    {/* Card standard */}
                    <div className='bg-card border border-border rounded-lg p-6 shadow-sm'>
                        <h3 className='font-semibold text-card-foreground mb-2'>
                            Card Standard
                        </h3>
                        <p className='text-muted-foreground text-sm'>
                            Utilise les couleurs de base du thème avec bg-card
                            et text-card-foreground.
                        </p>
                    </div>

                    {/* Card avec accent */}
                    <div className='bg-accent border border-border rounded-lg p-6 shadow-sm'>
                        <h3 className='font-semibold text-accent-foreground mb-2'>
                            Card Accent
                        </h3>
                        <p className='text-accent-foreground/70 text-sm'>
                            Utilise la couleur accent (bleu clair Hexoprint)
                            pour des éléments mis en avant.
                        </p>
                    </div>

                    {/* Card avec couleur personnalisée */}
                    <div className='bg-hexo-blue-dark border border-hexo-blue-light rounded-lg p-6 shadow-sm'>
                        <h3 className='font-semibold text-hexo-white mb-2'>
                            Card Hexo'print
                        </h3>
                        <p className='text-hexo-blue-light text-sm'>
                            Utilise directement les couleurs personnalisées de
                            la charte graphique.
                        </p>
                    </div>
                </div>
            </div>

            {/* Texte avec différentes couleurs */}
            <div className='space-y-4'>
                <h2 className='text-xl font-semibold text-foreground'>
                    Typographie
                </h2>
                <div className='space-y-2'>
                    <p className='text-foreground'>
                        Texte principal (foreground)
                    </p>
                    <p className='text-muted-foreground'>
                        Texte secondaire (muted-foreground)
                    </p>
                    <p className='text-primary'>
                        Texte primaire (primary - bleu foncé)
                    </p>
                    <p className='text-accent'>
                        Texte accent (accent - bleu clair)
                    </p>
                    <p className='text-hexo-blue-dark'>
                        Texte bleu foncé Hexoprint
                    </p>
                    <p className='text-hexo-blue-light'>
                        Texte bleu clair Hexoprint
                    </p>
                </div>
            </div>
        </div>
    );
}
