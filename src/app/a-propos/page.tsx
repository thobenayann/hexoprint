export default function AboutPage() {
    return (
        <main className='min-h-screen pt-16'>
            <div className='container mx-auto px-4 py-16'>
                <div className='max-w-4xl mx-auto'>
                    <h1 className='text-2xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-primary mb-6 md:mb-8'>
                        À propos d'Hexo'print
                    </h1>

                    <div className='prose prose-lg max-w-none'>
                        <p className='text-base md:text-lg lg:text-xl text-muted-foreground mb-6'>
                            Hexoprint, c'est avant tout une passion devenue
                            métier. Fondée par Yann, un technicien passionné par
                            l'impression 3D, l'entreprise mêle savoir-faire
                            artisanal et rigueur technique.
                        </p>

                        <p className='mb-6'>
                            De la création des plans jusqu'au produit final,
                            chaque étape est maîtrisée et réalisée avec minutie.
                            Notre objectif est simple : vous proposer une
                            impression 3D de qualité, avec une vraie expertise
                            technique, une écoute attentive, et toujours avec le
                            sourire !
                        </p>

                        <div className='grid md:grid-cols-2 gap-8 mt-12'>
                            <div className='bg-card p-6 rounded-lg border'>
                                <h2 className='text-lg md:text-xl lg:text-2xl font-semibold text-card-foreground mb-4'>
                                    Notre Mission
                                </h2>
                                <p className='text-sm md:text-base text-muted-foreground'>
                                    Donner vie à vos projets grâce à
                                    l'impression 3D artisanale et sur-mesure, en
                                    accompagnant chaque client avec soin, écoute
                                    et précision.
                                </p>
                            </div>

                            <div className='bg-card p-6 rounded-lg border'>
                                <h2 className='text-lg md:text-xl lg:text-2xl font-semibold text-card-foreground mb-4'>
                                    Notre Expertise
                                </h2>
                                <p className='text-sm md:text-base text-muted-foreground'>
                                    Maîtrise avancée des matériaux (PLA, ABS,
                                    PETG, résine) et capacité à fournir des
                                    conseils techniques précis pour optimiser
                                    vos projets.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
