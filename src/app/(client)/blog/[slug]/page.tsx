import { CallToAction } from '@/components/sections/CallToAction';
import { RelatedArticles } from '@/components/sections/RelatedArticles';
import { Badge } from '@/components/ui/badge';
import { FloatingShareButton } from '@/components/ui/floating-share-button';
import { ShareButton } from '@/components/ui/share-button';
import { calculateReadingTime, formatDate } from '@/lib/blog-client-utils';
import { getArticleBySlug, getRelatedArticles } from '@/lib/blog-utils';
import { COMPANY_INFO } from '@/lib/company-info';
import { urlFor } from '@/sanity/lib/image';
import type { ArticleCategory } from '@/types/blog';
import { ARTICLE_CATEGORIES, CATEGORY_COLORS } from '@/types/blog';
import { PortableText, type PortableTextComponents } from '@portabletext/react';
import { ArrowLeft, Calendar, Clock, Eye } from 'lucide-react';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Suspense } from 'react';

// Types pour les paramètres de page
type PageParams = {
    params: Promise<{ slug: string }>;
};

// Composant pour le contenu portable (PortableText)
const portableTextComponents: PortableTextComponents = {
    types: {
        image: ({
            value,
        }: {
            value: { asset: { _ref: string }; alt?: string; caption?: string };
        }) => (
            <figure className="my-8 group">
                <div className="relative overflow-hidden rounded-2xl bg-muted/20 border border-border">
                    <Image
                        src={urlFor(value.asset).url()}
                        alt={value.alt || ''}
                        width={800}
                        height={450}
                        className="w-full transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 800px"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                {value.caption && (
                    <figcaption className="text-center text-sm text-muted-foreground mt-4 italic">
                        {value.caption}
                    </figcaption>
                )}
            </figure>
        ),
    },
    block: {
        h2: ({ children }) => (
            <h2 className="text-2xl md:text-3xl font-bold mt-12 mb-6 text-foreground bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text">
                {children}
            </h2>
        ),
        h3: ({ children }) => (
            <h3 className="text-xl md:text-2xl font-semibold mt-8 mb-4 text-foreground">
                {children}
            </h3>
        ),
        h4: ({ children }) => (
            <h4 className="text-lg md:text-xl font-medium mt-6 mb-3 text-foreground">
                {children}
            </h4>
        ),
        blockquote: ({ children }) => (
            <blockquote className="relative my-8 pl-6 pr-4 py-6 italic text-muted-foreground">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 backdrop-blur-sm border border-primary/20 rounded-2xl"></div>
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary to-hexo-blue-light rounded-full"></div>
                <div className="relative z-10 text-base md:text-lg leading-relaxed">
                    {children}
                </div>
            </blockquote>
        ),
        normal: ({ children }) => (
            <p className="mb-6 text-base md:text-lg leading-relaxed text-foreground/90">
                {children}
            </p>
        ),
    },
    marks: {
        link: ({
            children,
            value,
        }: {
            children: React.ReactNode;
            value?: { href?: string; blank?: boolean };
        }) => (
            <a
                href={value?.href}
                target={value?.blank ? '_blank' : undefined}
                rel={value?.blank ? 'noopener noreferrer' : undefined}
                className="text-primary hover:text-primary/80 font-medium underline-offset-4 hover:underline transition-colors"
            >
                {children}
            </a>
        ),
        strong: ({ children }: { children: React.ReactNode }) => (
            <strong className="font-semibold text-foreground">
                {children}
            </strong>
        ),
        em: ({ children }: { children: React.ReactNode }) => (
            <em className="italic text-foreground/90">{children}</em>
        ),
        code: ({ children }: { children: React.ReactNode }) => (
            <code className="bg-muted/50 border border-border px-2 py-1 rounded-md text-sm font-mono text-primary">
                {children}
            </code>
        ),
    },
    list: {
        bullet: ({ children }) => (
            <ul className="list-none mb-6 space-y-2">{children}</ul>
        ),
        number: ({ children }) => (
            <ol
                className="list-none mb-6 space-y-2"
                style={{ counterReset: 'list-counter' }}
            >
                {children}
            </ol>
        ),
    },
    listItem: {
        bullet: ({ children }) => (
            <li className="relative flex items-start gap-3 text-foreground">
                <div className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-gradient-to-r from-primary to-hexo-blue-light mt-2.5"></div>
                <div className="flex-1">{children}</div>
            </li>
        ),
        number: ({ children }) => (
            <li className="relative flex items-start gap-3 text-foreground numbered-list-item">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-primary to-hexo-blue-light flex items-center justify-center text-white text-xs font-bold mt-1">
                    <span className="counter-number"></span>
                </div>
                <div className="flex-1 pt-0.5">{children}</div>
            </li>
        ),
    },
};

// Génération des métadonnées pour le SEO
export async function generateMetadata({
    params,
}: PageParams): Promise<Metadata> {
    try {
        const { slug } = await params;
        const article = await getArticleBySlug(slug);

        const title = article.seo?.metaTitle || article.title;
        const description =
            article.seo?.metaDescription ||
            `Découvrez notre article sur ${article.title}`;
        const imageUrl = article.mainImage?.asset?.url
            ? urlFor(article.mainImage.asset).width(1200).height(630).url()
            : `${COMPANY_INFO.website.url}/logos/hexoprint-logo-impression-3d-with-text-1200x628.png`;

        return {
            title: `${title} - Blog ${COMPANY_INFO.name}`,
            description,
            keywords: [
                ...article.categories.map(
                    (cat) => ARTICLE_CATEGORIES[cat as ArticleCategory]
                ),
                'impression 3D',
                'blog',
                COMPANY_INFO.name,
                'Haute-Garonne',
            ],
            openGraph: {
                title,
                description,
                type: 'article',
                url: `${COMPANY_INFO.website.url}/blog/${article.slug.current}`,
                images: [
                    { url: imageUrl, width: 1200, height: 630, alt: title },
                ],
                publishedTime: article.publishedAt,
                authors: [COMPANY_INFO.name],
                siteName: COMPANY_INFO.name,
            },
            twitter: {
                card: 'summary_large_image',
                title,
                description,
                images: [imageUrl],
            },
            alternates: {
                canonical: `${COMPANY_INFO.website.url}/blog/${article.slug.current}`,
            },
        };
    } catch {
        return {
            title: `Article - Blog ${COMPANY_INFO.name}`,
            description: `Découvrez nos articles sur l'impression 3D`,
        };
    }
}

// Composant de fallback pour les articles recommandés
function RelatedArticlesFallback() {
    return (
        <section className="py-16 bg-gradient-to-br from-muted/5 via-background to-muted/10">
            <div className="container mx-auto px-4">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-2xl font-bold text-center mb-12">
                        Articles recommandés
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[...Array(3)].map((_, i) => (
                            <div
                                key={i}
                                className="bg-card/40 backdrop-blur-sm rounded-2xl border border-border animate-pulse"
                            >
                                <div className="aspect-video bg-muted rounded-t-2xl"></div>
                                <div className="p-6 space-y-3">
                                    <div className="h-4 bg-muted rounded w-3/4"></div>
                                    <div className="h-3 bg-muted rounded w-1/2"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

// Page principale de l'article (Server Component)
export default async function ArticlePage({ params }: PageParams) {
    const { slug } = await params;

    // Chargement des données côté serveur
    const article = await getArticleBySlug(slug);
    const readingTime = calculateReadingTime(article.body);
    const formattedDate = formatDate(article.publishedAt);

    return (
        <main className="min-h-screen">
            {/* Contenu de l'article */}
            <article className="py-8 md:py-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        {/* En-tête de l'article */}
                        <header className="mb-12">
                            {/* Navigation et catégories */}
                            <div className="bg-background/95 backdrop-blur-xl border border-border/50 rounded-2xl p-3 md:p-4 mb-8 shadow-lg mt-8 md:mt-4">
                                {/* Layout mobile optimisé */}
                                <div className="flex flex-col gap-4">
                                    {/* Première ligne : Bouton retour et métadonnées */}
                                    <div className="flex items-center justify-between gap-3">
                                        <Link
                                            href="/blog"
                                            className="group inline-flex items-center gap-2 px-3 md:px-4 py-2 rounded-xl bg-card/50 hover:bg-card border border-border hover:border-primary/20 transition-all duration-300 flex-shrink-0"
                                        >
                                            <ArrowLeft className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                                            <span className="text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors">
                                                Retour au blog
                                            </span>
                                        </Link>

                                        {/* Métadonnées à droite sur mobile */}
                                        <div className="flex items-center gap-2">
                                            <div className="flex items-center gap-2 px-2 md:px-3 py-1.5 rounded-xl bg-primary/10 border border-primary/20">
                                                <Eye className="w-3 h-3 text-primary" />
                                                <span className="text-xs font-medium text-primary">
                                                    {readingTime} min
                                                </span>
                                            </div>
                                            <ShareButton
                                                title={article.title}
                                                url={`${COMPANY_INFO.website.url}/blog/${article.slug.current}`}
                                            />
                                        </div>
                                    </div>

                                    {/* Deuxième ligne : Catégories sur toute la largeur */}
                                    <div className="flex flex-wrap gap-2">
                                        {article.categories.map((category) => (
                                            <Badge
                                                key={category}
                                                className={`${
                                                    CATEGORY_COLORS[
                                                        category as ArticleCategory
                                                    ]
                                                } hover:scale-105 transition-transform duration-200 text-xs`}
                                            >
                                                {
                                                    ARTICLE_CATEGORIES[
                                                        category as ArticleCategory
                                                    ]
                                                }
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Titre */}
                            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-foreground leading-tight bg-gradient-to-br from-foreground via-foreground to-muted-foreground bg-clip-text">
                                {article.title}
                            </h1>

                            {/* Métadonnées avec design moderne */}
                            <div className="flex flex-wrap items-center gap-6 mb-8">
                                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-card/40 backdrop-blur-sm border border-border">
                                    <Calendar className="w-4 h-4 text-primary" />
                                    <span className="text-sm font-medium text-foreground">
                                        {formattedDate}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-card/40 backdrop-blur-sm border border-border">
                                    <Clock className="w-4 h-4 text-primary" />
                                    <span className="text-sm font-medium text-foreground">
                                        {readingTime} min de lecture
                                    </span>
                                </div>
                            </div>
                        </header>

                        {/* Image principale avec design moderne */}
                        <div className="relative mb-12 group">
                            <div className="relative aspect-video rounded-2xl overflow-hidden bg-muted/20 border border-border">
                                <Image
                                    src={urlFor(article.mainImage.asset).url()}
                                    alt={article.mainImage.alt}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                    priority
                                    sizes="(max-width: 768px) 100vw, 1024px"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            </div>
                            {/* Floating decorative element */}
                            <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-gradient-to-br from-primary/20 to-hexo-blue-light/20 rounded-full blur-2xl opacity-60 group-hover:opacity-100 transition-opacity duration-500"></div>
                        </div>

                        {/* Contenu de l'article avec design amélioré */}
                        <div className="prose prose-lg max-w-none">
                            <PortableText
                                value={article.body}
                                components={portableTextComponents}
                            />
                        </div>

                        {/* Footer avec bouton retour stylisé */}
                        <div className="mt-16 pt-8 border-t border-border">
                            <div className="text-center">
                                <div className="relative inline-block group">
                                    <div className="absolute inset-0 bg-gradient-to-r from-primary to-hexo-blue-light rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
                                    <Link
                                        href="/blog"
                                        className="relative inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-primary to-hexo-blue-light text-primary-foreground font-semibold hover:scale-105 transition-transform duration-300 shadow-lg"
                                    >
                                        <ArrowLeft className="w-5 h-5" />
                                        <span>Retour au blog</span>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </article>

            {/* Articles recommandés */}
            <Suspense fallback={<RelatedArticlesFallback />}>
                <RelatedArticlesWrapper
                    articleId={article._id}
                    categories={article.categories as ArticleCategory[]}
                />
            </Suspense>

            {/* Call to Action */}
            <CallToAction />

            {/* Schema.org JSON-LD */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'BlogPosting',
                        headline: article.title,
                        image: urlFor(article.mainImage.asset)
                            .width(1200)
                            .height(630)
                            .url(),
                        author: {
                            '@type': 'Person',
                            name: COMPANY_INFO.founder,
                        },
                        publisher: {
                            '@type': 'Organization',
                            name: COMPANY_INFO.name,
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
                        articleSection: article.categories
                            .map(
                                (cat) =>
                                    ARTICLE_CATEGORIES[cat as ArticleCategory]
                            )
                            .join(', '),
                        keywords: article.categories
                            .map(
                                (cat) =>
                                    ARTICLE_CATEGORIES[cat as ArticleCategory]
                            )
                            .join(', '),
                    }),
                }}
            />

            {/* Bouton de partage mobile flottant */}
            <FloatingShareButton
                title={article.title}
                url={`${COMPANY_INFO.website.url}/blog/${article.slug.current}`}
            />
        </main>
    );
}

// Wrapper pour les articles recommandés (Server Component)
async function RelatedArticlesWrapper({
    articleId,
    categories,
}: {
    articleId: string;
    categories: ArticleCategory[];
}) {
    try {
        const relatedArticles = await getRelatedArticles(
            articleId,
            categories,
            3
        );
        return <RelatedArticles articles={relatedArticles} />;
    } catch (error) {
        console.error('[RelatedArticles] Erreur chargement:', error);
        return null; // Pas d'articles recommandés en cas d'erreur
    }
}
