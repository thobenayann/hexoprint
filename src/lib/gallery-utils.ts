/**
 * Retourne le label d'affichage pour un matériau
 * Compatible avec les données Sanity en texte libre
 */
export const getMaterialDisplayName = (
    material: string | null | undefined
): string => {
    // Vérification de nullité
    if (!material) {
        return 'Matériau non spécifié';
    }

    // Retourner le nom tel quel (format texte libre depuis Sanity)
    return material;
};
