import type { StructureResolver } from 'sanity/structure';

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S) =>
    S.list()
        .title("Hexo'print CMS")
        .items([
            // Configuration (singleton)
            S.listItem()
                .title('⚙️ Configuration')
                .id('configuration')
                .child(
                    S.document()
                        .schemaType('configuration')
                        .documentId('configuration')
                        .title('Configuration générale')
                ),

            // Divider
            S.divider(),

            // Articles
            S.listItem()
                .title('📝 Articles')
                .schemaType('article')
                .child(
                    S.documentTypeList('article')
                        .title('Articles du blog')
                        .defaultOrdering([
                            { field: 'publishedAt', direction: 'desc' },
                        ])
                ),

            // Galerie
            S.listItem()
                .title('🖼️ Galerie')
                .schemaType('gallery')
                .child(
                    S.documentTypeList('gallery')
                        .title('Réalisations')
                        .defaultOrdering([
                            { field: 'createdAt', direction: 'desc' },
                        ])
                ),

            // Divider
            S.divider(),

            // Tous les autres types de documents (s'il y en a)
            ...S.documentTypeListItems().filter(
                (listItem) =>
                    !['configuration', 'article', 'gallery'].includes(
                        listItem.getId()!
                    )
            ),
        ]);
