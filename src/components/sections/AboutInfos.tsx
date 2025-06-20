import { Badge } from '@/components/ui/badge';

type AboutInfosProps = {
    values: ReadonlyArray<{
        readonly title: string;
        readonly description: string;
    }>;
    materials: ReadonlyArray<string>;
    location: {
        readonly city: string;
        readonly department: string;
    };
};

export function AboutInfos(props: AboutInfosProps) {
    return (
        <section className='py-16 lg:py-24 bg-muted/30'>
            <div className='container mx-auto px-4'>
                <div className='max-w-6xl mx-auto'>
                    <div className='grid lg:grid-cols-2 gap-12 lg:gap-16'>
                        {/* Nos valeurs */}
                        <div>
                            <h2 className='text-2xl md:text-3xl font-bold text-foreground mb-8'>
                                Nos Valeurs
                            </h2>
                            <div className='space-y-8'>
                                {props.values.map((value, index) => (
                                    <div key={index} className='flex gap-4'>
                                        <div className='flex-shrink-0 w-2 h-2 rounded-full bg-primary mt-3' />
                                        <div>
                                            <h3 className='text-lg font-semibold text-foreground mb-2'>
                                                {value.title}
                                            </h3>
                                            <p className='text-muted-foreground leading-relaxed'>
                                                {value.description}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Matériaux et localisation */}
                        <div className='space-y-12'>
                            {/* Matériaux */}
                            <div>
                                <h2 className='text-2xl md:text-3xl font-bold text-foreground mb-8'>
                                    Matériaux Maîtrisés
                                </h2>
                                <div className='flex flex-wrap gap-3'>
                                    {props.materials.map((material, index) => (
                                        <Badge
                                            key={index}
                                            variant='secondary'
                                            className='px-4 py-2 text-sm font-medium'
                                        >
                                            {material}
                                        </Badge>
                                    ))}
                                </div>
                                <p className='text-sm text-muted-foreground mt-4'>
                                    Et bien d&apos;autres matériaux selon vos
                                    besoins spécifiques
                                </p>
                            </div>

                            {/* Localisation */}
                            <div>
                                <h2 className='text-2xl md:text-3xl font-bold text-foreground mb-6'>
                                    Notre Atelier
                                </h2>
                                <div className='bg-card p-6 rounded-lg border'>
                                    <div className='flex items-start gap-4'>
                                        <div className='flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center'>
                                            <svg
                                                className='w-5 h-5 text-primary'
                                                fill='none'
                                                stroke='currentColor'
                                                viewBox='0 0 24 24'
                                                aria-hidden='true'
                                            >
                                                <path
                                                    strokeLinecap='round'
                                                    strokeLinejoin='round'
                                                    strokeWidth={2}
                                                    d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z'
                                                />
                                                <path
                                                    strokeLinecap='round'
                                                    strokeLinejoin='round'
                                                    strokeWidth={2}
                                                    d='M15 11a3 3 0 11-6 0 3 3 0 016 0z'
                                                />
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className='font-semibold text-card-foreground mb-2'>
                                                Situé à {props.location.city}
                                            </h3>
                                            <p className='text-muted-foreground text-sm'>
                                                {props.location.department} •
                                                Service sur toute la France
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
