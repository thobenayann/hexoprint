import { createClient } from 'next-sanity';

import {
    apiVersion,
    dataset,
    isDevelopment,
    isProduction,
    projectId,
    readToken,
    shouldUseToken,
    writeToken,
} from '../env';

// Client principal pour les requêtes publiques
export const client = createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: isProduction, // CDN seulement en production pour les performances
    perspective: 'published', // Utilise les données publiées
    stega: {
        enabled: isDevelopment, // Visual editing seulement en développement
        studioUrl: '/studio',
    },
});

// Client avec token pour les requêtes privées (côté serveur)
export const clientWithToken = createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: false, // Jamais de CDN pour les requêtes avec token
    token: readToken,
    perspective: 'published',
    stega: {
        enabled: isDevelopment,
        studioUrl: '/studio',
    },
});

// Client pour les mutations (écriture)
export const writeClient = createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: false,
    token: writeToken,
    perspective: 'published',
});

// Client pour les previews/drafts (développement)
export const previewClient = createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: false,
    token: readToken,
    perspective: 'previewDrafts', // Inclut les drafts et les documents publiés
    stega: {
        enabled: true,
        studioUrl: '/studio',
    },
});

// Helper pour obtenir le bon client selon le contexte
export const getClient = (preview = false) => {
    if (preview && isDevelopment) {
        return previewClient;
    }

    if (shouldUseToken()) {
        return clientWithToken;
    }

    return client;
};
