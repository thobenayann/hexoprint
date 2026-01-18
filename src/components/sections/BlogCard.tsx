'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { formatDate } from '@/lib/blog-client-utils';
import { cn } from '@/lib/utils';
import {
    CATEGORY_COLORS,
    getArticleCategoryLabel,
    type ArticleCategory,
    type ArticleSummary,
} from '@/types/blog';
import { motion } from 'framer-motion';
import { Calendar } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

type BlogCardProps = {
    article: ArticleSummary;
    priority?: boolean;
};

export function BlogCard({ article, priority = false }: BlogCardProps) {
    const router = useRouter();

    // Pour les articles résumés, on utilise la metaDescription du SEO comme extrait
    const excerpt = article.seo?.metaDescription || '';
    const formattedDate = formatDate(article.publishedAt);

    const handleNavigation = (e: React.MouseEvent) => {
        e.preventDefault();
        router.push(`/blog/${article.slug.current}`);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            whileHover={{ y: -8 }}
            whileTap={{ scale: 0.98 }}
        >
            <Card className="group relative overflow-hidden border-0 bg-card/40 backdrop-blur-sm hover:bg-card/60 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 cursor-pointer">
                <div onClick={handleNavigation} className="block">
                    {/* Image */}
                    <div className="relative aspect-video overflow-hidden">
                        <Image
                            src={article.mainImage.asset.url}
                            alt={article.mainImage.alt}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                            priority={priority}
                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />

                        {/* Gradient overlay moderne */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/5 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />

                        {/* Categories badges */}
                        <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                            {article.categories
                                .slice(0, 2)
                                .map((category: ArticleCategory) => (
                                    <Badge
                                        key={category}
                                        className={cn(
                                            'text-xs font-medium backdrop-blur-md border border-white/20 shadow-lg',
                                            CATEGORY_COLORS[category]
                                        )}
                                    >
                                        {getArticleCategoryLabel(category)}
                                    </Badge>
                                ))}
                            {article.categories.length > 2 && (
                                <Badge className="text-xs font-medium bg-black/30 text-white border-white/20 backdrop-blur-md shadow-lg">
                                    +{article.categories.length - 2}
                                </Badge>
                            )}
                        </div>

                        {/* Floating decorative element */}
                        <div className="absolute bottom-4 right-4 w-12 h-12 bg-gradient-to-br from-primary/20 to-hexo-blue-light/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    </div>

                    <CardContent className="p-6 relative">
                        {/* Glass morphism background */}
                        <div className="absolute inset-0 bg-gradient-to-br from-card/20 via-card/10 to-card/20 backdrop-blur-sm rounded-b-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                        <div className="relative z-10">
                            {/* Meta information */}
                            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-muted/20 backdrop-blur-sm border border-border">
                                    <Calendar className="w-3 h-3" />
                                    <time dateTime={article.publishedAt}>
                                        {formattedDate}
                                    </time>
                                </div>
                            </div>

                            {/* Title */}
                            <h3 className="text-lg md:text-xl font-bold line-clamp-2 mb-4 text-foreground group-hover:text-primary transition-colors duration-300 leading-tight">
                                {article.title}
                            </h3>

                            {/* Excerpt */}
                            {excerpt && (
                                <p className="text-muted-foreground line-clamp-3 mb-6 leading-relaxed text-sm">
                                    {excerpt}
                                </p>
                            )}

                            {/* Read more link avec design moderne */}
                            <div className="flex items-center justify-between">
                                <span className="text-primary font-semibold text-sm group-hover:text-primary/80 transition-colors duration-200">
                                    Lire l&apos;article
                                </span>
                                <div className="relative">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/10 to-primary/20 flex items-center justify-center transition-all duration-300 group-hover:from-primary/20 group-hover:to-primary/30 group-hover:scale-110 border border-primary/20">
                                        <svg
                                            className="w-4 h-4 text-primary transition-transform duration-300 group-hover:translate-x-1"
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
                                    {/* Floating glow */}
                                    <div className="absolute inset-0 bg-primary/20 rounded-full blur-lg scale-150 opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </div>
            </Card>
        </motion.div>
    );
}
