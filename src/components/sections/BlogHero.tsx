import { getBlogStats } from '@/lib/blog-utils';
import { BlogHeroClient } from './BlogHeroClient';

// Types pour les identifiants d'icônes
export type IconId = 'FileText' | 'Grid3X3' | 'Lightbulb' | 'BookOpen';

// Type pour les statistiques sérialisables
export type SerializableHeroStat = {
    iconId: IconId;
    value: string;
    label: string;
    description: string;
};

// Server Component : BlogHero récupère les données et les passe au composant client
export async function BlogHero() {
    // Récupérer les statistiques depuis Sanity
    const blogStats = await getBlogStats();

    // Construire les statistiques avec identifiants d'icônes (sérialisables)
    const heroStats: SerializableHeroStat[] = [
        {
            iconId: 'FileText',
            value: blogStats.totalArticles.toString(),
            label: blogStats.totalArticles > 1 ? 'Articles' : 'Article',
            description: "Guides d'expertise",
        },
        {
            iconId: 'Grid3X3',
            value: blogStats.totalCategories.toString(),
            label: blogStats.totalCategories > 1 ? 'Catégories' : 'Catégorie',
            description: 'Domaines couverts',
        },
        {
            iconId: 'Lightbulb',
            value: '100%',
            label: 'Expertise',
            description: 'Savoir-faire',
        },
        {
            iconId: 'BookOpen',
            value: '∞',
            label: 'Inspiration',
            description: 'Idées créatives',
        },
    ];

    // Passer les données sérialisables au composant client
    return <BlogHeroClient stats={heroStats} />;
}
