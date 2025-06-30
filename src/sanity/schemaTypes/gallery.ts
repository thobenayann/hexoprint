import { defineField, defineType } from 'sanity';
import MaterialAutocompleteInput from '../../components/sanity/MaterialAutocompleteInput';

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
                    { title: 'Prototypage', value: 'prototypage' },
                    {
                        title: 'Pièce fonctionnelle',
                        value: 'piece-fonctionnelle',
                    },
                    { title: 'Décoration', value: 'decoration' },
                    { title: 'Modélisme', value: 'modelisme' },
                    { title: 'Réparation', value: 'reparation' },
                    { title: 'Autre', value: 'autre' },
                ],
            },
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'material',
            title: 'Matériau utilisé',
            type: 'string',
            description:
                'Saisissez le matériau (ex: PLA, ABS, PETG, Résine, TPU, Carbon). Les suggestions apparaîtront basées sur les matériaux déjà utilisés.',
            components: {
                input: MaterialAutocompleteInput,
            },
            validation: (rule) => rule.min(1).max(50),
        }),
        defineField({
            name: 'printTime',
            title: "Temps d'impression",
            type: 'string',
            placeholder: 'Ex: 2h30, 45min...',
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'featured',
            title: 'À la une',
            type: 'boolean',
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
            material: 'material',
        },
        prepare(selection) {
            const { title, media, material } = selection;
            return {
                title: title,
                subtitle: material
                    ? `Matériau: ${material}`
                    : 'Pas de matériau',
                media: media,
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
