import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    // Optimisations pour la production
    experimental: {
        // Support pour les Server Actions (si utilisées)
        serverActions: {
            bodySizeLimit: '10mb', // Pour l'upload de fichiers STL
        },
        // Optimisation du bundle (toujours experimental en 15.3)
        optimizePackageImports: ['lucide-react', '@sanity/ui'],
    },

    // Configuration des images pour Sanity CDN
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'cdn.sanity.io',
                pathname: '/images/**',
            },
        ],
        // Optimisations d'images pour Core Web Vitals
        formats: ['image/webp', 'image/avif'],
        deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
        imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
        minimumCacheTTL: 31536000, // 1 an de cache pour les images
        dangerouslyAllowSVG: true,
        contentSecurityPolicy:
            "default-src 'self'; script-src 'none'; sandbox;",
    },

    // Optimisations de compilation
    compiler: {
        removeConsole: process.env.NODE_ENV === 'production',
    },

    // Headers de sécurité et performance pour la production
    async headers() {
        return [
            {
                source: '/studio/:path*',
                headers: [
                    {
                        key: 'X-Frame-Options',
                        value: 'SAMEORIGIN',
                    },
                    {
                        key: 'X-Content-Type-Options',
                        value: 'nosniff',
                    },
                    {
                        key: 'Referrer-Policy',
                        value: 'strict-origin-when-cross-origin',
                    },
                ],
            },
            {
                // Headers pour les assets JavaScript et CSS
                source: '/_next/static/:path*',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, max-age=31536000, immutable',
                    },
                ],
            },

            {
                // Headers pour toutes les pages
                source: '/(.*)',
                headers: [
                    {
                        key: 'X-DNS-Prefetch-Control',
                        value: 'on',
                    },
                    {
                        key: 'X-Content-Type-Options',
                        value: 'nosniff',
                    },
                ],
            },
        ];
    },

    // Optimisation de la compression
    compress: true,

    // Gestion du trailing slash pour éviter les redirections inutiles
    trailingSlash: false,

    // Configuration de la sortie pour optimiser les performances
    output: 'standalone',

    // Configuration Turbopack (compatible Next.js 15.3+)
    turbopack: {
        // Configuration vide pour le moment - peut être étendue si besoin
        // rules: {}, // Pour ajouter des loaders webpack supportés
        // resolveAlias: {}, // Pour les alias de modules
        // resolveExtensions: [], // Pour les extensions personnalisées
    },
};

export default nextConfig;
