import createImageUrlBuilder from '@sanity/image-url';
import { SanityImageSource } from '@sanity/image-url/lib/types/types';

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
