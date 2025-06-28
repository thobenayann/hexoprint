export type GalleryCategory =
    | 'modelisme'
    | 'prototypage'
    | 'reparation'
    | 'decoration'
    | 'fonctionnel'
    | 'autres';

export type GalleryMaterial =
    | 'pla'
    | 'petg'
    | 'abs'
    | 'resine'
    | 'tpu'
    | 'autres';

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
    material: GalleryMaterial;
    printTime: number;
    createdAt: string;
};

// Mapping des catégories pour l'affichage
export const categoryLabels: Record<GalleryCategory, string> = {
    modelisme: 'Modélisme',
    prototypage: 'Prototypage',
    reparation: 'Réparation',
    decoration: 'Décoration',
    fonctionnel: 'Pièce fonctionnelle',
    autres: 'Autres',
};

// Mapping des matériaux pour l'affichage
export const materialLabels: Record<GalleryMaterial, string> = {
    pla: 'PLA',
    petg: 'PETG',
    abs: 'ABS',
    resine: 'Résine',
    tpu: 'TPU',
    autres: 'Autres',
};

// Helper pour determiner si c'est pour professionnels ou particuliers
export const isForProfessionals = (category: GalleryCategory): boolean => {
    return ['prototypage', 'reparation', 'fonctionnel'].includes(category);
};
