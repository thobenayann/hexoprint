import { normalizeFilterValue } from '@/hooks/use-dynamic-materials';
import type { CategoryFilter, GalleryItemType } from '@/types/gallery';
import { isValidCategory, normalizeCategory } from '@/types/gallery';

/**
 * Filtre les éléments de galerie selon les critères sélectionnés
 * Centralisé et typé strictement avec validation et normalisation
 */
export function filterGalleryItems(
    items: GalleryItemType[],
    categoryFilter: CategoryFilter,
    materialFilter: string
): GalleryItemType[] {
    if (!items.length) return [];

    return items.filter((item) => {
        // Filtrer par catégorie - validation stricte avec normalisation
        if (categoryFilter !== 'all') {
            if (!isValidCategory(categoryFilter)) {
                console.error(
                    `[Gallery] Filtre de catégorie invalide: "${categoryFilter}". Valeurs valides: modelisme, prototypage, reparation, decoration, piece-fonctionnelle, autre`
                );
                return false;
            }
            // Normaliser les deux catégories pour la comparaison (gère les caractères invisibles)
            const normalizedFilter = normalizeCategory(categoryFilter);
            const normalizedItemCategory = normalizeCategory(item.category);
            if (normalizedItemCategory !== normalizedFilter) {
                return false;
            }
        }

        // Filtrer par matériau (comparaison normalisée)
        if (materialFilter !== 'all') {
            const itemMaterialNormalized = item.material
                ? normalizeFilterValue(item.material)
                : '';
            if (itemMaterialNormalized !== materialFilter) {
                return false;
            }
        }

        return true;
    });
}

/**
 * Récupère tous les matériaux uniques présents dans les éléments de galerie
 * Utile pour générer les options de filtres côté client
 */
export function getUniqueMaterialsFromItems(
    items: GalleryItemType[]
): string[] {
    const materials = items
        .map((item) => item.material)
        .filter((material): material is string => Boolean(material))
        .filter((material, index, array) => array.indexOf(material) === index) // Unique
        .sort();

    return materials;
}
