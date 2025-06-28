'use client';

/**
 * This configuration is used to for the Sanity Studio that's mounted on the `\src\app\studio\[[...tool]]\page.tsx` route
 */

import { visionTool } from '@sanity/vision';
import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';

// Go to https://www.sanity.io/docs/api-versioning to learn how API versioning works
import {
    apiVersion,
    dataset,
    isDevelopment,
    projectId,
} from './src/sanity/env';
import { schema } from './src/sanity/schemaTypes';
import { structure } from './src/sanity/structure';

export default defineConfig({
    basePath: '/studio',
    projectId: projectId || '',
    dataset: dataset || '',
    // Add and edit the content schema in the './sanity/schemaTypes' folder
    schema,
    plugins: [
        structureTool({ structure }),
        // Vision is for querying with GROQ from inside the Studio
        // https://www.sanity.io/docs/the-vision-plugin
        // En production, désactiver Vision pour la sécurité (optionnel)
        ...(isDevelopment
            ? [visionTool({ defaultApiVersion: apiVersion })]
            : []),
    ],

    // Configuration CORS pour la production
    cors: {
        credentials: true,
        origin: [
            // Domaines autorisés en production
            'https://hexoprint.fr',
            'https://www.hexoprint.fr',
            // Domaines Vercel (si déployé sur Vercel)
            /^https:\/\/.*\.vercel\.app$/,
            // Localhost pour le développement
            ...(isDevelopment
                ? ['http://localhost:3000', 'http://127.0.0.1:3000']
                : []),
        ],
    },

    // Configuration pour les environnements
    scheduledPublishing: {
        enabled: true,
    },

    // Configuration des outils de développement
    tools: isDevelopment ? undefined : [],
});
