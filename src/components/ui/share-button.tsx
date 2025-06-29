'use client';

import { Check, Share2 } from 'lucide-react';
import { useState } from 'react';

type ShareButtonProps = {
    title: string;
    url: string;
};

export function ShareButton({ title, url }: ShareButtonProps) {
    const [copied, setCopied] = useState(false);

    const handleShare = async () => {
        // Vérifier si la Web Share API est disponible
        if (navigator.share) {
            try {
                await navigator.share({
                    title,
                    url,
                    text: `Découvrez cet article sur l'impression 3D : ${title}`,
                });
            } catch (error) {
                console.log('Partage annulé:', error);
            }
        } else {
            // Fallback : copier l'URL dans le presse-papier
            try {
                await navigator.clipboard.writeText(url);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            } catch (error) {
                console.error('Erreur copie:', error);
                // Fallback ultime : sélectionner le texte pour copie manuelle
                const textArea = document.createElement('textarea');
                textArea.value = url;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            }
        }
    };

    return (
        <button
            onClick={handleShare}
            className="p-2 rounded-xl bg-card/50 hover:bg-card border border-border hover:border-primary/20 text-muted-foreground hover:text-primary transition-all duration-300 relative cursor-pointer"
            title={copied ? 'Lien copié !' : "Partager l'article"}
        >
            {copied ? (
                <Check className="w-4 h-4 text-green-500" />
            ) : (
                <Share2 className="w-4 h-4" />
            )}
            {copied && (
                <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-xs bg-green-500 text-white px-2 py-1 rounded whitespace-nowrap">
                    Copié !
                </span>
            )}
        </button>
    );
}
