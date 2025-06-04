// Types pour les variables d'environnement
declare global {
    namespace NodeJS {
        interface ProcessEnv {
            // Variables publiques Sanity (disponibles côté client)
            NEXT_PUBLIC_SANITY_PROJECT_ID: string;
            NEXT_PUBLIC_SANITY_DATASET: string;
            NEXT_PUBLIC_SANITY_API_VERSION: string;

            // Variables privées Sanity (côté serveur uniquement)
            SANITY_API_READ_TOKEN?: string;
            SANITY_API_WRITE_TOKEN?: string;

            // Variables Next.js
            NODE_ENV: 'development' | 'production' | 'test';

            // Variables Vercel
            VERCEL_ENV?: 'development' | 'preview' | 'production';
            VERCEL_URL?: string;
        }
    }
}

export {};
