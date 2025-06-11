import { defineField, defineType } from 'sanity';

export const configuration = defineType({
    name: 'configuration',
    title: 'Configuration',
    type: 'document',
    fields: [
        defineField({
            name: 'hourlyRate',
            title: 'Taux horaire (€)',
            type: 'number',
            description: "Le taux horaire de la main d'œuvre en euros",
            validation: (rule) => rule.required().min(0).precision(2),
        }),
        defineField({
            name: 'filaments',
            title: 'Filaments',
            type: 'array',
            of: [
                {
                    type: 'object',
                    fields: [
                        defineField({
                            name: 'material',
                            title: 'Matériau',
                            type: 'string',
                            options: {
                                list: [
                                    { title: 'PLA', value: 'pla' },
                                    { title: 'PETG', value: 'petg' },
                                    { title: 'ABS', value: 'abs' },
                                    { title: 'TPU', value: 'tpu' },
                                    { title: 'Résine', value: 'resine' },
                                    { title: 'Autres', value: 'autres' },
                                ],
                            },
                            validation: (rule) => rule.required(),
                        }),
                        defineField({
                            name: 'pricePerKg',
                            title: 'Prix au kg (€)',
                            type: 'number',
                            description:
                                "Prix d'achat du filament par kilogramme",
                            validation: (rule) =>
                                rule.required().min(0).precision(2),
                        }),
                        defineField({
                            name: 'color',
                            title: 'Couleur',
                            type: 'string',
                            description:
                                'Couleur disponible pour ce matériau (optionnel)',
                        }),
                        defineField({
                            name: 'brand',
                            title: 'Marque',
                            type: 'string',
                            description: 'Marque du filament (optionnel)',
                        }),
                    ],
                    preview: {
                        select: {
                            material: 'material',
                            pricePerKg: 'pricePerKg',
                            color: 'color',
                        },
                        prepare(selection) {
                            const { material, pricePerKg, color } = selection;
                            const materialLabel = material
                                ? material.toUpperCase()
                                : 'Matériau';
                            const colorLabel = color ? ` - ${color}` : '';
                            // const priceLabel = pricePerKg
                            //     ? ` (${pricePerKg}€/kg)`
                            //     : '';

                            return {
                                title: `${materialLabel}${colorLabel}`,
                                subtitle: `${pricePerKg}€/kg`,
                            };
                        },
                    },
                },
            ],
        }),
        defineField({
            name: 'machines',
            title: 'Machines',
            type: 'array',
            of: [
                {
                    type: 'object',
                    fields: [
                        defineField({
                            name: 'model',
                            title: 'Modèle',
                            type: 'string',
                            validation: (rule) => rule.required(),
                        }),
                        defineField({
                            name: 'volume',
                            title: "Volume d'impression",
                            type: 'string',
                            description: 'Exemple: 220x220x250 mm',
                            validation: (rule) => rule.required(),
                        }),
                        defineField({
                            name: 'precision',
                            title: 'Précision (mm)',
                            type: 'number',
                            description:
                                "Précision de l'impression en millimètres",
                            validation: (rule) =>
                                rule.required().min(0).precision(3),
                        }),
                        defineField({
                            name: 'technology',
                            title: 'Technologie',
                            type: 'string',
                            options: {
                                list: [
                                    { title: 'FDM/FFF', value: 'fdm' },
                                    { title: 'SLA/Résine', value: 'sla' },
                                    { title: 'SLS', value: 'sls' },
                                    { title: 'Autres', value: 'autres' },
                                ],
                            },
                        }),
                        defineField({
                            name: 'isActive',
                            title: 'Machine active',
                            type: 'boolean',
                            description:
                                'Décocher si la machine est en maintenance ou hors service',
                            initialValue: true,
                        }),
                    ],
                    preview: {
                        select: {
                            model: 'model',
                            volume: 'volume',
                            technology: 'technology',
                            isActive: 'isActive',
                        },
                        prepare(selection) {
                            const { model, volume, technology, isActive } =
                                selection;
                            const techLabel = technology
                                ? ` (${technology.toUpperCase()})`
                                : '';
                            const statusLabel =
                                isActive === false ? ' - INACTIVE' : '';

                            return {
                                title: `${model}${techLabel}${statusLabel}`,
                                subtitle: volume || 'Volume non défini',
                            };
                        },
                    },
                },
            ],
        }),
        defineField({
            name: 'additionalCosts',
            title: 'Coûts additionnels',
            type: 'array',
            of: [
                {
                    type: 'object',
                    fields: [
                        defineField({
                            name: 'label',
                            title: 'Libellé',
                            type: 'string',
                            validation: (rule) => rule.required(),
                        }),
                        defineField({
                            name: 'amount',
                            title: 'Montant (€)',
                            type: 'number',
                            description: 'Coût en euros',
                            validation: (rule) =>
                                rule.required().min(0).precision(2),
                        }),
                        defineField({
                            name: 'description',
                            title: 'Description',
                            type: 'text',
                            description: 'Description optionnelle de ce coût',
                        }),
                        defineField({
                            name: 'isActive',
                            title: 'Actif',
                            type: 'boolean',
                            description:
                                'Décocher pour désactiver temporairement ce coût',
                            initialValue: true,
                        }),
                    ],
                    preview: {
                        select: {
                            label: 'label',
                            amount: 'amount',
                            isActive: 'isActive',
                        },
                        prepare(selection) {
                            const { label, amount, isActive } = selection;
                            const statusLabel =
                                isActive === false ? ' (INACTIF)' : '';

                            return {
                                title: `${label}${statusLabel}`,
                                subtitle: `${amount}€`,
                            };
                        },
                    },
                },
            ],
        }),
        defineField({
            name: 'lastUpdated',
            title: 'Dernière mise à jour',
            type: 'datetime',
            description: 'Mise à jour automatiquement',
            readOnly: true,
            initialValue: () => new Date().toISOString(),
        }),
    ],
    preview: {
        prepare() {
            return {
                title: 'Configuration générale',
                subtitle: 'Paramètres de tarification et machines',
            };
        },
    },
    // Singleton: un seul document de ce type sera géré via la structure du studio
});
