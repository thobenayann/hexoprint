import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    // Optimisations pour la production
    experimental: {
        // Support pour les Server Actions (si utilisées)
        serverActions: {
            bodySizeLimit: '10mb', // Pour l'upload de fichiers STL
        },
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
        // Optimisations d'images
        formats: ['image/webp', 'image/avif'],
        deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
        imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    },

    // Headers de sécurité pour la production
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
                // Headers pour les assets statiques
                source: '/(.*)',
                headers: [
                    {
                        key: 'X-DNS-Prefetch-Control',
                        value: 'on',
                    },
                ],
            },
        ];
    },
};

export default nextConfig;
