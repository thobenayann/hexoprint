'use client';

import { sanityFetch } from '@/sanity/lib/live';
import { useEffect, useState } from 'react';

export type MaterialOption = {
    value: string;
    label: string;
};

/**
 * Hook pour récupérer dynamiquement les matériaux depuis les objets de galerie existants
 * Retourne un tableau d'options utilisables dans les filtres
 */
export function useDynamicMaterials() {
    const [materials, setMaterials] = useState<MaterialOption[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchMaterialsFromGallery() {
            try {
                setIsLoading(true);

                // Requête GROQ pour récupérer tous les matériaux utilisés dans la galerie
                const query = `*[_type == "gallery" && defined(material) && material != null && material != ""].material`;
                const response = await sanityFetch({ query });

                console.log(
                    '[useDynamicMaterials] Response complète:',
                    response
                );
                console.log(
                    '[useDynamicMaterials] Response.data:',
                    response.data
                );

                // Vérifier que la réponse est un tableau de strings
                const galleryMaterials = Array.isArray(response.data)
                    ? (response.data as string[])
                    : [];

                console.log(
                    '[useDynamicMaterials] Matériaux bruts de la galerie:',
                    galleryMaterials
                );

                // Créer un ensemble pour éliminer les doublons
                const uniqueMaterials = Array.from(
                    new Set(
                        galleryMaterials
                            .filter(
                                (material: string) =>
                                    material &&
                                    typeof material === 'string' &&
                                    material.trim()
                            )
                            .map((material: string) => material.trim())
                    )
                ).sort();

                console.log(
                    '[useDynamicMaterials] Matériaux uniques:',
                    uniqueMaterials
                );

                // Transformer en options pour les filtres
                const materialOptions: MaterialOption[] = uniqueMaterials.map(
                    (material: string) => ({
                        value: material.toLowerCase().replace(/\s+/g, '-'), // Normaliser pour l'URL
                        label: material,
                    })
                );

                console.log(
                    '[useDynamicMaterials] Options finales:',
                    materialOptions
                );
                setMaterials(materialOptions);
            } catch (error) {
                console.error(
                    'Erreur lors du chargement des matériaux depuis la galerie:',
                    error
                );
                // Fallback en cas d'erreur - matériaux de base
                setMaterials([
                    { value: 'pla', label: 'PLA' },
                    { value: 'abs', label: 'ABS' },
                    { value: 'petg', label: 'PETG' },
                    { value: 'resine', label: 'Résine' },
                ]);
            } finally {
                setIsLoading(false);
            }
        }

        fetchMaterialsFromGallery();
    }, []);

    return {
        materials,
        isLoading,
    };
}

/**
 * Fonction utilitaire pour normaliser un nom de matériau en valeur de filtre
 */
export function normalizeFilterValue(material: string): string {
    return material.toLowerCase().replace(/\s+/g, '-');
}

/**
 * Fonction utilitaire pour récupérer le label depuis une valeur de filtre
 */
export function getLabelFromFilterValue(
    filterValue: string,
    materials: MaterialOption[]
): string {
    const material = materials.find((m) => m.value === filterValue);
    return material?.label || filterValue;
}
