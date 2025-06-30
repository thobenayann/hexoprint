/**
 * Informations centralisées de l'entreprise Hexo'print
 * Ce fichier contient toutes les données de contact et informations légales
 * à utiliser dans les différents composants du site.
 */

export const COMPANY_INFO = {
    name: "Hexo'print",
    legalName: "Hexo'print",
    founder: 'Yann RAVARY',
    siteUrl: 'https://hexoprint.fr',

    // Informations de contact
    contact: {
        phone: '07 84 58 54 25',
        email: 'hexoprint3d@gmail.com',
        address: {
            street: 'Impasse Porthos',
            postalCode: '31600',
            city: 'Seysses',
            department: 'Haute-Garonne',
            region: 'Occitanie',
            country: 'France',
            fullAddress: 'Impasse Porthos, 31600 Seysses',
        },
    },

    // Données légales
    legal: {
        siret: '90119196500010',
        status: 'Auto-entrepreneur',
    },

    // Horaires d'ouverture
    schedule: {
        weekdays: {
            label: 'Lundi - Vendredi',
            hours: '9h00 - 18h00',
        },
        saturday: {
            label: 'Samedi',
            hours: '9h00 - 12h00',
        },
        sunday: {
            label: 'Dimanche',
            hours: 'Fermé',
        },
        note: 'Rendez-vous possibles en dehors des horaires sur demande',
    },

    // Réseaux sociaux
    social: {
        instagram: 'https://www.instagram.com/hexoprint3d',
    },

    // Zones de service
    serviceArea: {
        localDelivery: {
            radius: 25,
            description: 'Zone de livraison gratuite (25km)',
            areas: ['Seysses', 'Muret', 'Portet-sur-Garonne', 'Pins-Justaret'],
        },
        extendedDelivery: {
            radius: 50,
            description: 'Zone de service étendue (50km)',
            areas: [
                'Toulouse métropole',
                'Haute-Garonne (31)',
                'Départements limitrophes',
            ],
        },
        shipping: {
            national: true,
            description: 'Envoi postal partout en France',
        },
    },

    // URL du site
    website: {
        url: 'https://hexoprint.fr',
        domain: 'hexoprint.fr',
    },

    // Spécialités techniques
    expertise: {
        materials: ['PLA', 'ABS', 'PETG', 'Résine', 'TPU', 'Carbon'] as const,
        services: [
            'Impression 3D',
            'Fabrication additive',
            'Prototypage rapide',
            'Modélisme',
            'Pièces sur-mesure',
            'Réparation de pièces',
        ] as const,
    },
} as const;

// Types dérivés pour une meilleure TypeScript
export type CompanyMaterial = (typeof COMPANY_INFO.expertise.materials)[number];
export type CompanyService = (typeof COMPANY_INFO.expertise.services)[number];

// Helpers pour formatage
export const formatPhone = (phone: string) => {
    return phone.replace(
        /(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/,
        '$1 $2 $3 $4 $5'
    );
};

export const formatFullAddress = () => {
    const { address } = COMPANY_INFO.contact;
    return `${address.street}, ${address.postalCode} ${address.city}`;
};
