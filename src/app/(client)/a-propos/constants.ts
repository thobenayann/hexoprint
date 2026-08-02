import { COMPANY_INFO } from '@/lib/company-info';

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
        materials: COMPANY_INFO.expertise.materials,
        location: {
            city: COMPANY_INFO.contact.address.city,
            department: COMPANY_INFO.contact.address.department,
        },
    },
} as const;
