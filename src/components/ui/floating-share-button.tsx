'use client';

import { Check, Share2 } from 'lucide-react';
import { useState } from 'react';

type FloatingShareButtonProps = {
    title: string;
    url: string;
};

export function FloatingShareButton(props: FloatingShareButtonProps) {
    const [isCopied, setIsCopied] = useState(false);

    const handleShare = async () => {
        // Vérifier si la Web Share API est disponible
        if (navigator.share && typeof navigator.share === 'function') {
            try {
                await navigator.share({
                    title: props.title,
                    url: props.url,
                    text: `Découvrez cet article sur l'impression 3D : ${props.title}`,
                });
                return; // Sortir si le partage a réussi
            } catch (error) {
                // Continuer vers le fallback si l'utilisateur annule ou en cas d'erreur
                console.log('Erreur Web Share API:', error);
            }
        }

        // Fallback : copier l'URL dans le presse-papier
        try {
            await navigator.clipboard.writeText(props.url);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        } catch (error) {
            console.log(
                'Clipboard API non disponible, utilisation du fallback moderne:',
                error
            );
            // Fallback moderne avec Selection API
            try {
                const textArea = document.createElement('textarea');
                textArea.value = props.url;
                textArea.style.position = 'fixed';
                textArea.style.left = '-999999px';
                textArea.style.top = '-999999px';
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();

                // Utiliser l'API Selection moderne
                const range = document.createRange();
                range.selectNodeContents(textArea);
                const selection = window.getSelection();
                selection?.removeAllRanges();
                selection?.addRange(range);

                document.body.removeChild(textArea);
                setIsCopied(true);
                setTimeout(() => setIsCopied(false), 2000);
            } catch (fallbackError) {
                console.warn('Impossible de copier le lien:', fallbackError);
            }
        }
    };

    return (
        <button
            onClick={handleShare}
            className="md:hidden fixed bottom-20 right-4 z-50 w-10 h-10 bg-gradient-to-br from-primary to-hexo-blue-light text-primary-foreground rounded-full shadow-2xl hover:shadow-primary/25 active:scale-95 transition-all duration-300 flex items-center justify-center group"
            title={isCopied ? 'Lien copié !' : "Partager l'article"}
        >
            {/* Effet de glow animé */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary to-hexo-blue-light rounded-full blur-lg opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>

            {/* Contenu du bouton */}
            <div className="relative z-10">
                {isCopied ? (
                    <Check className="w-4 h-4" />
                ) : (
                    <Share2 className="w-4 h-4" />
                )}
            </div>

            {/* Tooltip de confirmation */}
            {isCopied && (
                <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-green-500 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap shadow-lg animate-in fade-in-0 slide-in-from-bottom-2 duration-200">
                    Lien copié !
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-green-500"></div>
                </div>
            )}
        </button>
    );
}
