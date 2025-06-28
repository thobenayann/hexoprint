import { BlogGrid } from './BlogGrid';

export function BlogContent() {
    return (
        <div className="min-h-screen bg-background" data-blog-grid-section>
            {/* Grille d'articles */}
            <BlogGrid />
        </div>
    );
}
