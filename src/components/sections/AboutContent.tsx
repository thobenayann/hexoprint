import { Card } from '@/components/ui/card';

type AboutContentProps = {
    mainContent: string;
    mission: {
        title: string;
        description: string;
    };
    expertise: {
        title: string;
        description: string;
    };
};

export function AboutContent(props: AboutContentProps) {
    return (
        <section className='py-16 lg:py-24 bg-background'>
            <div className='container mx-auto px-4'>
                <div className='max-w-4xl mx-auto'>
                    {/* Contenu principal */}
                    <div className='prose prose-lg max-w-none mb-16'>
                        <p className='text-base md:text-lg lg:text-xl text-muted-foreground leading-relaxed'>
                            {props.mainContent}
                        </p>
                    </div>

                    {/* Cartes Mission et Expertise */}
                    <div className='grid md:grid-cols-2 gap-8'>
                        <Card className='p-8 hover:shadow-lg transition-shadow duration-300'>
                            <div className='space-y-4'>
                                <div className='w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6'>
                                    <svg
                                        className='w-6 h-6 text-primary'
                                        fill='none'
                                        stroke='currentColor'
                                        viewBox='0 0 24 24'
                                        aria-hidden='true'
                                    >
                                        <path
                                            strokeLinecap='round'
                                            strokeLinejoin='round'
                                            strokeWidth={2}
                                            d='M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z'
                                        />
                                    </svg>
                                </div>
                                <h2 className='text-xl md:text-2xl font-semibold text-card-foreground'>
                                    {props.mission.title}
                                </h2>
                                <p className='text-sm md:text-base text-muted-foreground leading-relaxed'>
                                    {props.mission.description}
                                </p>
                            </div>
                        </Card>

                        <Card className='p-8 hover:shadow-lg transition-shadow duration-300'>
                            <div className='space-y-4'>
                                <div className='w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6'>
                                    <svg
                                        className='w-6 h-6 text-primary'
                                        fill='none'
                                        stroke='currentColor'
                                        viewBox='0 0 24 24'
                                        aria-hidden='true'
                                    >
                                        <path
                                            strokeLinecap='round'
                                            strokeLinejoin='round'
                                            strokeWidth={2}
                                            d='M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z'
                                        />
                                    </svg>
                                </div>
                                <h2 className='text-xl md:text-2xl font-semibold text-card-foreground'>
                                    {props.expertise.title}
                                </h2>
                                <p className='text-sm md:text-base text-muted-foreground leading-relaxed'>
                                    {props.expertise.description}
                                </p>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </section>
    );
}
