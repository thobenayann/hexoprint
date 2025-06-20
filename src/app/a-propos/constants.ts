export const ABOUT_PAGE_DATA = {
    hero: {
        title: 'La passion du détail au cœur de chaque impression',
        subtitle:
            "Hexo'print : Votre partenaire technique en fabrication additive",
        description:
            "Hexoprint, c'est avant tout une passion devenue métier. Fondée par Yann, un technicien passionné par l'impression 3D, l'entreprise mêle savoir-faire artisanal et rigueur technique.",
    },
    content: {
        mainContent:
            "De la création des plans jusqu'au produit final, chaque étape est maîtrisée et réalisée avec minutie. Notre objectif est simple : vous proposer une impression 3D de qualité, avec une vraie expertise technique, une écoute attentive, et toujours avec le sourire !",
        mission: {
            title: 'Notre Mission',
            description:
                "Donner vie à vos projets grâce à l'impression 3D artisanale et sur-mesure, en accompagnant chaque client avec soin, écoute et précision.",
        },
        expertise: {
            title: 'Notre Expertise',
            description:
                'Maîtrise avancée des matériaux (PLA, ABS, PETG, résine) et capacité à fournir des conseils techniques précis pour optimiser vos projets.',
        },
    },
    infos: {
        values: [
            {
                title: 'Accompagnement',
                description:
                    'Nous accompagnons vos idées, des plus simples aux plus audacieuses, avec une écoute attentive et des conseils personnalisés.',
            },
            {
                title: 'Qualité',
                description:
                    'Votre satisfaction est au cœur de notre métier. Chaque impression compte, même la plus petite pièce.',
            },
            {
                title: 'Passion & Précision',
                description:
                    "Technique, passion et précision : la recette d'une impression réussie ! Vous avez un projet complexe ? C'est justement notre spécialité.",
            },
        ],
        materials: [
            'PLA',
            'ABS',
            'PETG',
            'Résine',
            'TPU',
            'WOOD',
            'Carbon',
        ] as string[],
        location: {
            city: 'Seysses',
            department: 'Haute-Garonne (31)',
        },
    },
} as const;

export const ABOUT_PAGE_SEO = {
    title: "À propos d'Hexo'print - Spécialiste impression 3D Haute-Garonne",
    description:
        "Découvrez Hexo'print, votre spécialiste en impression 3D artisanale à Seysses (31). Passion, expertise technique et qualité au service de vos projets sur-mesure.",
    keywords: [
        'impression 3D Haute-Garonne',
        'impression 3D Seysses',
        'artisan impression 3D',
        'Hexoprint à propos',
        'spécialiste impression 3D 31',
        'fabrication additive artisanale',
        'impression 3D sur-mesure Toulouse',
        'expertise matériaux 3D',
    ] as string[],
};
