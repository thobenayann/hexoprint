type AboutHeroProps = {
    title: string;
    subtitle: string;
    description: string;
};

export function AboutHero(props: AboutHeroProps) {
    return (
        <section className='relative min-h-[70vh] flex items-center justify-center overflow-hidden'>
            {/* Vidéo Background */}
            <div className='absolute inset-0 z-0'>
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className='w-full h-full object-cover lg:object-bottom'
                >
                    <source
                        src='/videos/3D_printing_video_1920_1080_25fps.mp4'
                        type='video/mp4'
                    />
                </video>
                {/* Overlay pour améliorer la lisibilité */}
                <div className='absolute inset-0 bg-black/50' />
            </div>

            {/* Contenu */}
            <div className='relative z-10 container mx-auto px-4 text-center'>
                <div className='max-w-4xl mx-auto'>
                    <h1 className='text-white mb-6 fade-in'>{props.title}</h1>
                    <p className='text-white/90 text-lg md:text-xl lg:text-2xl font-medium mb-8 fade-in-subtitle'>
                        {props.subtitle}
                    </p>
                    <p className='text-white/80 text-base md:text-lg max-w-3xl mx-auto leading-relaxed fade-in-subtitle'>
                        {props.description}
                    </p>
                </div>
            </div>
        </section>
    );
}
