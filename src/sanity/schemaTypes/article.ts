import { defineField, defineType } from 'sanity';

export const article = defineType({
    name: 'article',
    title: 'Article',
    type: 'document',
    fields: [
        defineField({
            name: 'title',
            title: 'Titre',
            type: 'string',
            validation: (rule) =>
                rule
                    .required()
                    .max(65)
                    .warning(
                        'Le titre doit faire maximum 65 caractères pour un bon SEO'
                    ),
        }),
        defineField({
            name: 'slug',
            title: 'Slug',
            type: 'slug',
            options: {
                source: 'title',
                maxLength: 96,
            },
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'publishedAt',
            title: 'Date de publication',
            type: 'datetime',
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'mainImage',
            title: 'Image principale',
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
                                "Le texte alternatif est important pour l'accessibilité et le SEO"
                            ),
                }),
            ],
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'body',
            title: 'Contenu',
            type: 'array',
            of: [
                {
                    type: 'block',
                    styles: [
                        { title: 'Normal', value: 'normal' },
                        { title: 'H2', value: 'h2' },
                        { title: 'H3', value: 'h3' },
                        { title: 'H4', value: 'h4' },
                        { title: 'Citation', value: 'blockquote' },
                    ],
                    marks: {
                        decorators: [
                            { title: 'Gras', value: 'strong' },
                            { title: 'Italique', value: 'em' },
                            { title: 'Code', value: 'code' },
                        ],
                        annotations: [
                            {
                                title: 'Lien',
                                name: 'link',
                                type: 'object',
                                fields: [
                                    {
                                        title: 'URL',
                                        name: 'href',
                                        type: 'url',
                                    },
                                    {
                                        title: 'Ouvrir dans un nouvel onglet',
                                        name: 'blank',
                                        type: 'boolean',
                                    },
                                ],
                            },
                        ],
                    },
                },
                {
                    type: 'image',
                    options: { hotspot: true },
                    fields: [
                        {
                            name: 'alt',
                            title: 'Texte alternatif',
                            type: 'string',
                            validation: (rule) => rule.required(),
                        },
                        {
                            name: 'caption',
                            title: 'Légende',
                            type: 'string',
                        },
                    ],
                },
            ],
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'categories',
            title: 'Catégories',
            type: 'array',
            of: [
                {
                    type: 'string',
                },
            ],
            options: {
                list: [
                    { title: 'Modélisme', value: 'modelisme' },
                    { title: 'Prototypage', value: 'prototypage' },
                    { title: 'Réparation', value: 'reparation' },
                    { title: 'Décoration', value: 'decoration' },
                    { title: 'Technique', value: 'technique' },
                    { title: 'Matériaux', value: 'materiaux' },
                ],
            },
        }),
        defineField({
            name: 'seo',
            title: 'Référencement SEO',
            type: 'object',
            fields: [
                defineField({
                    name: 'metaTitle',
                    title: 'Titre SEO',
                    type: 'string',
                    validation: (rule) =>
                        rule
                            .max(65)
                            .warning(
                                'Le titre SEO doit faire maximum 65 caractères'
                            ),
                }),
                defineField({
                    name: 'metaDescription',
                    title: "Résumé de l'article pour le SEO",
                    type: 'text',
                    validation: (rule) =>
                        rule
                            .max(155)
                            .warning(
                                'La description SEO doit faire maximum 155 caractères'
                            ),
                }),
            ],
            options: {
                collapsible: true,
                collapsed: false,
            },
        }),
    ],
    preview: {
        select: {
            title: 'title',
            author: 'author.name',
            media: 'mainImage',
            publishedAt: 'publishedAt',
        },
        prepare(selection) {
            const { title, media, publishedAt } = selection;
            const formattedDate = publishedAt
                ? new Date(publishedAt).toLocaleDateString('fr-FR')
                : 'Brouillon';

            return {
                title,
                subtitle: `Publié le ${formattedDate}`,
                media,
            };
        },
    },
    orderings: [
        {
            title: 'Date de publication, plus récent en premier',
            name: 'publishedAtDesc',
            by: [{ field: 'publishedAt', direction: 'desc' }],
        },
        {
            title: 'Date de publication, plus ancien en premier',
            name: 'publishedAtAsc',
            by: [{ field: 'publishedAt', direction: 'asc' }],
        },
    ],
});
