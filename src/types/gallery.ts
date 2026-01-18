/**
 * ⚠️ IMPORTANT : Ces valeurs doivent correspondre EXACTEMENT au schéma Sanity
 * Voir src/sanity/schemaTypes/gallery.ts pour les valeurs définies
 * 
 * Les valeurs sont synchronisées avec le schéma Sanity :
 * - 'piece-fonctionnelle' (avec tiret, pas 'fonctionnel')
 * - 'autre' (singulier, pas 'autres')
 */
export type GalleryCategory =
    | 'modelisme'
    | 'prototypage'
    | 'reparation'
    | 'decoration'
    | 'piece-fonctionnelle'
    | 'autre';

/**
 * Type pour les filtres de catégorie (inclut 'all' pour désactiver le filtre)
 */
export type CategoryFilter = GalleryCategory | 'all';

export type GalleryItemType = {
    _id: string;
    _type: 'gallery';
    title: string;
    image: {
        asset: {
            _id: string;
            url: string;
        };
        alt: string;
        crop?: {
            top: number;
            bottom: number;
            left: number;
            right: number;
        };
        hotspot?: {
            x: number;
            y: number;
            height: number;
            width: number;
        };
    };
    description: string;
    category: GalleryCategory;
    material?: string | null;
    printTime: string;
    featured: boolean;
    createdAt: string;
};

// Mapping des catégories pour l'affichage
export const categoryLabels: Record<GalleryCategory, string> = {
    modelisme: 'Modélisme',
    prototypage: 'Prototypage',
    reparation: 'Réparation',
    decoration: 'Décoration',
    'piece-fonctionnelle': 'Pièce fonctionnelle',
    autre: 'Autre',
};

/**
 * Récupère le label d'affichage pour une catégorie
 * Normalise automatiquement la catégorie pour gérer les caractères invisibles
 * @throws Si la catégorie n'est pas valide après normalisation
 */
export function getCategoryLabel(category: GalleryCategory | string): string {
    // Normaliser la catégorie pour gérer les caractères invisibles
    const normalized = typeof category === 'string' 
        ? toGalleryCategory(category)
        : category;
    
    const label = categoryLabels[normalized];
    if (!label) {
        throw new Error(
            `[Gallery] Catégorie invalide: "${category}" (normalisée: "${normalized}"). Valeurs valides: ${Object.keys(categoryLabels).join(', ')}`
        );
    }
    return label;
}

/**
 * Normalise une catégorie en supprimant les caractères invisibles et espaces
 * Résout les problèmes de copier-coller depuis Sanity ou autres sources
 */
export function normalizeCategory(category: string): string {
    return category
        .trim()
        // Supprimer les caractères zero-width (zero-width space, zero-width non-breaking space, etc.)
        .replace(/[\u200B-\u200D\uFEFF]/g, '')
        // Supprimer les autres caractères invisibles Unicode
        .replace(/[\u2060\u200C\u200D]/g, '')
        // Normaliser les espaces multiples en un seul
        .replace(/\s+/g, ' ')
        .trim();
}

/**
 * Vérifie si une catégorie est valide (avec normalisation)
 */
export function isValidCategory(category: string): category is GalleryCategory {
    const normalized = normalizeCategory(category);
    return normalized in categoryLabels;
}

/**
 * Convertit une string en GalleryCategory avec normalisation
 * @throws Si la catégorie n'est pas valide après normalisation
 */
export function toGalleryCategory(category: string): GalleryCategory {
    const normalized = normalizeCategory(category);
    if (!isValidCategory(normalized)) {
        throw new Error(
            `[Gallery] Catégorie invalide: "${category}" (normalisée: "${normalized}"). Valeurs valides: ${Object.keys(categoryLabels).join(', ')}`
        );
    }
    return normalized;
}

/**
 * Helper pour déterminer si c'est pour professionnels ou particuliers
 */
export function isForProfessionals(category: GalleryCategory): boolean {
    return ['prototypage', 'reparation', 'piece-fonctionnelle'].includes(category);
}
