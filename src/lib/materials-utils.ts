import { sanityFetch } from '@/sanity/lib/live';
import { cache } from 'react';
import { COMPANY_INFO } from './company-info';
import { materialsQuery } from './sanity-queries';

// ==========================================
// TYPES POUR LES MATÉRIAUX
// ==========================================

type SanityMaterialResult = {
    filaments?: Array<{
        material: string;
    }>;
} | null;

// ==========================================
// FALLBACKS
// ==========================================

// Matériaux par défaut (COMPANY_INFO sans WOOD comme demandé)
const FALLBACK_MATERIALS: ReadonlyArray<string> =
    COMPANY_INFO.expertise.materials.filter((material) => material !== 'WOOD');

// ==========================================
// FONCTIONS UTILITAIRES
// ==========================================

/**
 * Récupère les matériaux depuis Sanity avec fallback vers les matériaux par défaut
 * Utilise React cache() pour éviter les requêtes dupliquées
 * @returns Promise avec la liste des matériaux formatés
 */
export const getMaterials = cache(async (): Promise<ReadonlyArray<string>> => {
    try {
        const { data: configData } = await sanityFetch<SanityMaterialResult>({
            query: materialsQuery,
            tags: ['configuration'],
        });

        // Si on a des données Sanity, les traiter
        if (configData?.filaments && Array.isArray(configData.filaments)) {
            const sanityMaterials = configData.filaments
                .map((filament) => filament.material)
                .filter(
                    (material): material is string =>
                        typeof material === 'string' &&
                        material.trim().length > 0
                )
                .map((material) => material.trim())
                .filter(
                    (material, index, array) =>
                        array.indexOf(material) === index
                ); // Déduplique

            // Si on a des matériaux valides, les retourner
            if (sanityMaterials.length > 0) {
                return sanityMaterials;
            }
        }

        // Fallback vers les matériaux par défaut
        return FALLBACK_MATERIALS;
    } catch (error) {
        // En cas d'erreur, utiliser le fallback
        return FALLBACK_MATERIALS;
    }
});

/**
 * Retourne les matériaux par défaut (pour tests ou utilisation directe)
 * @returns Liste des matériaux par défaut sans WOOD
 */
export const getFallbackMaterials = (): ReadonlyArray<string> => {
    return FALLBACK_MATERIALS;
};

// ==========================================
// EXPORTS DE TYPES
// ==========================================

/**
 * Type pour les matériaux disponibles
 */
export type MaterialsList = ReadonlyArray<string>;
