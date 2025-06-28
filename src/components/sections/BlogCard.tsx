import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { formatDate } from '@/lib/blog-utils';
import { cn } from '@/lib/utils';
import {
    ARTICLE_CATEGORIES,
    CATEGORY_COLORS,
    type ArticleCategory,
    type ArticleSummary,
} from '@/types/blog';
import { Calendar } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

type BlogCardProps = {
    article: ArticleSummary;
    priority?: boolean;
};

export function BlogCard({ article, priority = false }: BlogCardProps) {
    // Pour les articles résumés, on utilise la metaDescription du SEO comme extrait
    const excerpt = article.seo?.metaDescription || '';
    const formattedDate = formatDate(article.publishedAt);

    return (
        <Card className="group overflow-hidden border-0 bg-background/50 backdrop-blur-sm hover:bg-background/80 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            <Link href={`/blog/${article.slug.current}`} className="block">
                {/* Image */}
                <div className="relative aspect-video overflow-hidden">
                    <Image
                        src={article.mainImage.asset.url}
                        alt={article.mainImage.alt}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        priority={priority}
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />

                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Categories badges */}
                    <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                        {article.categories
                            .slice(0, 2)
                            .map((category: ArticleCategory) => (
                                <Badge
                                    key={category}
                                    className={cn(
                                        'text-xs font-medium backdrop-blur-sm border',
                                        CATEGORY_COLORS[
                                            category as ArticleCategory
                                        ]
                                    )}
                                >
                                    {
                                        ARTICLE_CATEGORIES[
                                            category as ArticleCategory
                                        ]
                                    }
                                </Badge>
                            ))}
                        {article.categories.length > 2 && (
                            <Badge className="text-xs font-medium bg-black/20 text-white border-white/20 backdrop-blur-sm">
                                +{article.categories.length - 2}
                            </Badge>
                        )}
                    </div>
                </div>

                <CardContent className="p-6">
                    {/* Meta information */}
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                        <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <time dateTime={article.publishedAt}>
                                {formattedDate}
                            </time>
                        </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg md:text-xl font-bold line-clamp-2 mb-3 text-foreground group-hover:text-primary transition-colors duration-200">
                        {article.title}
                    </h3>

                    {/* Excerpt */}
                    {excerpt && (
                        <p className="text-muted-foreground line-clamp-3 mb-4 leading-relaxed">
                            {excerpt}
                        </p>
                    )}

                    {/* Read more link */}
                    <div className="flex items-center justify-between">
                        <span className="text-primary font-medium text-sm group-hover:underline">
                            Lire l&apos;article
                        </span>
                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center transition-colors duration-200 group-hover:bg-primary/20">
                            <svg
                                className="w-3 h-3 text-primary transition-transform duration-200 group-hover:translate-x-0.5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 5l7 7-7 7"
                                />
                            </svg>
                        </div>
                    </div>
                </CardContent>
            </Link>
        </Card>
    );
}
