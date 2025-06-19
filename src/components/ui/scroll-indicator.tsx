'use client';

import { motion } from 'framer-motion';

type ScrollIndicatorProps = {
    text?: string;
    className?: string;
    onClick?: () => void;
};

export function ScrollIndicator({
    text = 'Découvrez nos services',
    className = '',
    onClick,
}: ScrollIndicatorProps) {
    const handleClick = () => {
        if (onClick) {
            onClick();
        } else {
            // Comportement par défaut : scroll vers la section suivante
            const nextSection = document.querySelector(
                'main > section:nth-child(2)'
            );
            nextSection?.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
            });
        }
    };

    return (
        <motion.div
            className={`absolute bottom-24 md:bottom-8 left-1/2 transform -translate-x-1/2 z-[100] ${className}`}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.5 }}
        >
            <button
                onClick={handleClick}
                className='flex flex-col items-center text-muted-foreground cursor-pointer hover:text-primary transition-colors duration-300 focus:outline-none focus:text-primary p-4'
                aria-label='Défiler vers la section suivante'
            >
                <span className='text-sm mb-2'>{text}</span>
                <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatType: 'reverse',
                    }}
                    className='w-6 h-10 border-2 border-border rounded-full flex justify-center motion-reduce:animate-none'
                    role='img'
                    aria-label='Indicateur de défilement'
                >
                    <motion.div
                        animate={{ y: [0, 12, 0] }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            repeatType: 'reverse',
                        }}
                        className='w-1 h-3 bg-muted-foreground rounded-full mt-2'
                    />
                </motion.div>
            </button>
        </motion.div>
    );
}
