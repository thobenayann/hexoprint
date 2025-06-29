import { getArticleSummaries } from '@/lib/blog-utils';
import { BlogGrid } from './BlogGrid';

export async function BlogContent() {
    // Charger les données côté serveur
    const articles = await getArticleSummaries();

    return (
        <div className="min-h-screen bg-background" data-blog-grid-section>
            {/* Passer les données au composant client */}
            <BlogGrid articles={articles} />
        </div>
    );
}
