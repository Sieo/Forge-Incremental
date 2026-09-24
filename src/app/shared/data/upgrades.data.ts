import { Upgrade } from "../model/upgrade.model";

export const UPGRADES: Record<string, Upgrade> = {
    marteau: {
        id: 'marteau',
        name: 'Marteau',
        cost: 12,
        growth: 1.15,
        max: 20,
        desc: '+20% de coups par clic / niveau',
    },
    talent: {
        id: 'talent',
        name: 'Talent de forgeron',
        cost: 40,
        growth: 1.18,
        max: 25,
        desc: '+0.04 qualité moyenne / niveau',
    },
    negociation: {
        id: 'negociation',
        name: 'Négociation',
        cost: 80,
        growth: 1.25,
        max: 10,
        desc: '-2 points de prélèvement / niveau',
    },
    equipement: {
        id: 'equipement',
        name: 'Équipement de la forge',
        cost: 150,
        growth: 1.7,
        max: 5,
        desc: '+0.10 plafond de qualité / niveau',
    },
};