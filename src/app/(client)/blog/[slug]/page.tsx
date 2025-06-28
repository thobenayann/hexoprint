import { CallToAction } from '@/components/sections/CallToAction';
import { RelatedArticles } from '@/components/sections/RelatedArticles';
import { Badge } from '@/components/ui/badge';
import {
    calculateReadingTime,
    formatDate,
    getAllArticles,
    getArticleBySlug,
} from '@/lib/blog-utils';
import { COMPANY_INFO } from '@/lib/company-info';
import { cn } from '@/lib/utils';
import {
    ARTICLE_CATEGORIES,
    CATEGORY_COLORS,
    type ArticleCategory,
} from '@/types/blog';
import { ArrowLeft, Calendar, Clock, User } from 'lucide-react';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

type ArticlePageProps = {
    params: Promise<{ slug: string }>;
};

// Génération des métadonnées dynamiques
export async function generateMetadata({
    params,
}: ArticlePageProps): Promise<Metadata> {
    const { slug } = await params;
    const article = await getArticleBySlug(slug);

    if (!article) {
        return {
            title: "Article non trouvé - Hexo'print",
        };
    }

    const seoTitle = article.seo?.metaTitle || article.title;
    const seoDescription = article.seo?.metaDescription || '';

    return {
        title: `${seoTitle} - Blog Hexo'print`,
        description: seoDescription,
        keywords: [
            ...article.categories.map(
                (cat) => ARTICLE_CATEGORIES[cat as ArticleCategory]
            ),
            'impression 3D',
            'guide',
            'conseil',
            'tutoriel',
            'expertise',
            'Hexoprint',
            'Haute-Garonne',
        ],
        openGraph: {
            title: seoTitle,
            description: seoDescription,
            type: 'article',
            locale: 'fr_FR',
            siteName: "Hexo'print",
            url: `${COMPANY_INFO.website.url}/blog/${slug}`,
            images: [
                {
                    url: article.mainImage.asset.url,
                    width: 1200,
                    height: 630,
                    alt: article.mainImage.alt,
                },
            ],
            publishedTime: article.publishedAt,
        },
        twitter: {
            card: 'summary_large_image',
            title: seoTitle,
            description: seoDescription,
            images: [article.mainImage.asset.url],
        },
        robots: {
            index: true,
            follow: true,
            googleBot: {
                index: true,
                follow: true,
                'max-video-preview': -1,
                'max-image-preview': 'large',
                'max-snippet': -1,
            },
        },
        alternates: {
            canonical: `${COMPANY_INFO.website.url}/blog/${slug}`,
        },
        other: {
            'article:author': COMPANY_INFO.founder,
            'article:publisher': COMPANY_INFO.name,
            'article:published_time': article.publishedAt,
            'article:section': article.categories[0]
                ? ARTICLE_CATEGORIES[article.categories[0] as ArticleCategory]
                : 'Impression 3D',
            'article:tag': article.categories
                .map((cat) => ARTICLE_CATEGORIES[cat as ArticleCategory])
                .join(', '),
        },
    };
}

// Génération des pages statiques
export async function generateStaticParams() {
    const articles = await getAllArticles();

    return articles.map((article) => ({
        slug: article.slug.current,
    }));
}

export default async function ArticlePage({ params }: ArticlePageProps) {
    const { slug } = await params;
    const [article, allArticles] = await Promise.all([
        getArticleBySlug(slug),
        getAllArticles(),
    ]);

    if (!article) {
        notFound();
    }

    const formattedDate = formatDate(article.publishedAt);
    const readingTime = calculateReadingTime(article.body);

    return (
        <main className="min-h-screen">
            {/* Header avec navigation amélioré - sticky */}
            <div className="border-b border-border bg-card/90 backdrop-blur-xl sticky top-0 z-40 transition-all duration-300">
                <div className="container mx-auto px-4 py-4">
                    <Link
                        href="/blog"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary hover:bg-primary/20 transition-all duration-200 hover:scale-105"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span className="font-medium">Retour au blog</span>
                    </Link>
                </div>
            </div>

            {/* Contenu principal avec animations */}
            <div className="animate-in fade-in duration-700">
                {/* Article Header */}
                <article className="py-16 md:py-24">
                    <div className="container mx-auto px-4">
                        <div className="max-w-4xl mx-auto">
                            {/* Header avec animations */}
                            <div className="animate-in slide-in-from-bottom duration-700">
                                {/* Categories */}
                                <div className="flex flex-wrap gap-2 mb-6">
                                    {article.categories.map((category) => (
                                        <Badge
                                            key={category}
                                            className={cn(
                                                'text-sm font-medium border',
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
                                </div>

                                {/* Title avec gradient */}
                                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                                    <span className="bg-gradient-to-r from-foreground via-foreground to-primary bg-clip-text text-transparent">
                                        {article.title}
                                    </span>
                                </h1>

                                {/* Meta avec design amélioré */}
                                <div className="flex flex-wrap items-center gap-4 p-4 rounded-xl bg-muted/30 border border-border/50 backdrop-blur-sm mb-8">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <div className="p-1.5 rounded-lg bg-primary/10">
                                            <User className="w-4 h-4 text-primary" />
                                        </div>
                                        <span>{COMPANY_INFO.founder}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <div className="p-1.5 rounded-lg bg-primary/10">
                                            <Calendar className="w-4 h-4 text-primary" />
                                        </div>
                                        <time dateTime={article.publishedAt}>
                                            {formattedDate}
                                        </time>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <div className="p-1.5 rounded-lg bg-primary/10">
                                            <Clock className="w-4 h-4 text-primary" />
                                        </div>
                                        <span>
                                            {readingTime} min de lecture
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Featured Image avec animation */}
                            <div className="relative aspect-video md:aspect-[2/1] rounded-2xl overflow-hidden group mb-12 animate-in slide-in-from-bottom duration-700 delay-200">
                                <Image
                                    src={article.mainImage.asset.url}
                                    alt={article.mainImage.alt}
                                    fill
                                    priority
                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 100vw, 896px"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </div>

                            {/* Content avec animation */}
                            <div className="animate-in slide-in-from-bottom duration-700 delay-300">
                                <div className="prose prose-lg max-w-none prose-primary prose-headings:font-bold prose-headings:text-foreground prose-p:text-muted-foreground prose-p:leading-relaxed prose-strong:text-foreground prose-blockquote:border-l-primary prose-blockquote:bg-primary/5 prose-blockquote:p-4 prose-blockquote:rounded-r-lg">
                                    {article.body.map((block, index) => {
                                        if (block._type === 'block') {
                                            const Tag =
                                                block.style === 'h2'
                                                    ? 'h2'
                                                    : block.style === 'h3'
                                                      ? 'h3'
                                                      : block.style === 'h4'
                                                        ? 'h4'
                                                        : block.style ===
                                                            'blockquote'
                                                          ? 'blockquote'
                                                          : 'p';

                                            return (
                                                <Tag
                                                    key={index}
                                                    className={cn(
                                                        block.style === 'h2' &&
                                                            'text-2xl md:text-3xl font-bold mt-12 mb-4',
                                                        block.style === 'h3' &&
                                                            'text-xl md:text-2xl font-bold mt-8 mb-3',
                                                        block.style === 'h4' &&
                                                            'text-lg md:text-xl font-bold mt-6 mb-2',
                                                        block.style ===
                                                            'blockquote' &&
                                                            'border-l-4 border-primary pl-6 italic text-muted-foreground my-6',
                                                        block.style ===
                                                            'normal' &&
                                                            'text-base md:text-lg leading-relaxed mb-6'
                                                    )}
                                                >
                                                    {block.children.map(
                                                        (child, childIndex) => (
                                                            <span
                                                                key={childIndex}
                                                            >
                                                                {child.text}
                                                            </span>
                                                        )
                                                    )}
                                                </Tag>
                                            );
                                        }
                                        return null;
                                    })}
                                </div>
                            </div>

                            {/* Bouton retour en bas de l'article */}
                            <div className="mt-12 pt-8 border-t border-border/50 text-center animate-in slide-in-from-bottom duration-700 delay-500">
                                <Link
                                    href="/blog"
                                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-medium transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-primary/20"
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                    Retour au blog
                                </Link>
                            </div>
                        </div>
                    </div>
                </article>
            </div>

            {/* Articles recommandés */}
            <RelatedArticles
                currentArticle={article}
                allArticles={allArticles}
            />

            {/* Call to Action */}
            <CallToAction />

            {/* Schema.org JSON-LD pour l'article */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'BlogPosting',
                        headline: article.title,
                        description: article.seo?.metaDescription || '',
                        image: {
                            '@type': 'ImageObject',
                            url: article.mainImage.asset.url,
                            alt: article.mainImage.alt,
                        },
                        author: {
                            '@type': 'Person',
                            name: COMPANY_INFO.founder,
                        },
                        publisher: {
                            '@type': 'LocalBusiness',
                            name: COMPANY_INFO.name,
                            url: COMPANY_INFO.website.url,
                            logo: {
                                '@type': 'ImageObject',
                                url: `${COMPANY_INFO.website.url}/logos/hexoprint-sans-text-no-bg-750x750.png`,
                            },
                        },
                        datePublished: article.publishedAt,
                        dateModified: article.publishedAt,
                        mainEntityOfPage: {
                            '@type': 'WebPage',
                            '@id': `${COMPANY_INFO.website.url}/blog/${article.slug.current}`,
                        },
                        keywords: article.categories
                            .map(
                                (cat) =>
                                    ARTICLE_CATEGORIES[cat as ArticleCategory]
                            )
                            .join(', '),
                        articleSection: article.categories[0]
                            ? ARTICLE_CATEGORIES[
                                  article.categories[0] as ArticleCategory
                              ]
                            : 'Impression 3D',
                        about: {
                            '@type': 'Thing',
                            name: 'Impression 3D',
                        },
                        inLanguage: 'fr-FR',
                    }),
                }}
            />
        </main>
    );
}
