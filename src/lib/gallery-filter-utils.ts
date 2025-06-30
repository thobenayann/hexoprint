import { normalizeFilterValue } from '@/hooks/use-dynamic-materials';
import type { GalleryItemType } from '@/types/gallery';

/**
 * Filtre les éléments de galerie selon les critères sélectionnés
 */
export function filterGalleryItems(
    items: GalleryItemType[],
    categoryFilter: string,
    materialFilter: string
): GalleryItemType[] {
    if (!items.length) return [];

    return items.filter((item) => {
        // Filtrer par catégorie
        if (categoryFilter !== 'all' && item.category !== categoryFilter) {
            return false;
        }

        // Filtrer par matériau (comparaison dynamique)
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
