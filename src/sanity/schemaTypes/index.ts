import { type SchemaTypeDefinition } from 'sanity';

import { article } from './article';
import { configuration } from './configuration';
import { gallery } from './gallery';

export const schema: { types: SchemaTypeDefinition[] } = {
    types: [article, gallery, configuration],
};
