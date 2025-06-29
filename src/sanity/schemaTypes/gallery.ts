import { defineField, defineType } from 'sanity';

export const gallery = defineType({
    name: 'gallery',
    title: 'Galerie',
    type: 'document',
    fields: [
        defineField({
            name: 'title',
            title: 'Titre',
            type: 'string',
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'image',
            title: 'Image',
            type: 'image',
            options: {
                hotspot: true,
            },
            fields: [
                defineField({
                    name: 'alt',
                    title: 'Texte alternatif',
                    type: 'string',
                    validation: (rule) =>
                        rule
                            .required()
                            .warning(
                                "Le texte alternatif est important pour l'accessibilité"
                            ),
                }),
            ],
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'description',
            title: 'Description',
            type: 'text',
            validation: (rule) =>
                rule
                    .required()
                    .max(160)
                    .warning(
                        'La description doit faire maximum 160 caractères'
                    ),
        }),
        defineField({
            name: 'category',
            title: 'Catégorie',
            type: 'string',
            options: {
                list: [
                    { title: 'Modélisme', value: 'modelisme' },
                    { title: 'Prototypage', value: 'prototypage' },
                    { title: 'Réparation', value: 'reparation' },
                    { title: 'Décoration', value: 'decoration' },
                    { title: 'Pièce fonctionnelle', value: 'fonctionnel' },
                    { title: 'Autres', value: 'autres' },
                ],
            },
        }),
        defineField({
            name: 'material',
            title: 'Matériau utilisé',
            type: 'string',
            description:
                'Nom du matériau utilisé (ex: PLA, ABS, PETG, TPU, Résine, etc.)',
            placeholder: 'Saisissez le matériau utilisé',
            validation: (rule) => rule.min(1).max(50),
        }),
        defineField({
            name: 'printTime',
            title: "Temps d'impression (heures)",
            type: 'number',
            validation: (rule) => rule.min(0),
        }),
        defineField({
            name: 'featured',
            title: 'Mise en avant',
            type: 'boolean',
            description:
                "Cocher pour mettre cette réalisation en avant sur la page d'accueil",
            initialValue: false,
        }),
        defineField({
            name: 'createdAt',
            title: 'Date de création',
            type: 'date',
            validation: (rule) => rule.required(),
        }),
    ],
    preview: {
        select: {
            title: 'title',
            media: 'image',
            category: 'category',
            material: 'material',
        },
        prepare(selection) {
            const { title, media, category, material } = selection;
            const categoryLabel = category
                ? category.charAt(0).toUpperCase() + category.slice(1)
                : '';
            const materialLabel = material || '';

            const subtitle = [categoryLabel, materialLabel]
                .filter(Boolean)
                .join(' • ');

            return {
                title,
                subtitle: subtitle || 'Réalisation',
                media,
            };
        },
    },
    orderings: [
        {
            title: 'Date de création, plus récent en premier',
            name: 'createdAtDesc',
            by: [{ field: 'createdAt', direction: 'desc' }],
        },
        {
            title: 'Titre A-Z',
            name: 'titleAsc',
            by: [{ field: 'title', direction: 'asc' }],
        },
        {
            title: 'Mis en avant en premier',
            name: 'featuredFirst',
            by: [
                { field: 'featured', direction: 'desc' },
                { field: 'createdAt', direction: 'desc' },
            ],
        },
    ],
});
