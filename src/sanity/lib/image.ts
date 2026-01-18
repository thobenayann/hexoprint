import { createImageUrlBuilder, type SanityImageSource } from '@sanity/image-url';

import { dataset, projectId } from '../env';

// https://www.sanity.io/docs/image-url
// Gestion sécurisée des variables d'environnement avec fallbacks
const builder = createImageUrlBuilder({
    projectId: projectId || '',
    dataset: dataset || '',
});

export const urlFor = (source: SanityImageSource) => {
    return builder.image(source);
};
