import { UPGRADE, Upgrade, UpgradeId } from '../model/upgrade.model';

export const UPGRADES: Record<UpgradeId, Upgrade> = {
    [UPGRADE.MARTEAU]: {
        id: UPGRADE.MARTEAU,
        name: 'Marteau',
        cost: 12,
        growth: 1.15,
        max: 20,
        desc: '+20% de coups par clic / niveau',
    },
    [UPGRADE.TALENT]: {
        id: UPGRADE.TALENT,
        name: 'Talent de forgeron',
        cost: 40,
        growth: 1.18,
        max: 25,
        desc: '+0.04 qualité moyenne / niveau',
    },
    [UPGRADE.NEGOCIATION]: {
        id: UPGRADE.NEGOCIATION,
        name: 'Négociation',
        cost: 80,
        growth: 1.25,
        max: 10,
        desc: '-2 points de prélèvement / niveau',
    },
    [UPGRADE.EQUIPEMENT]: {
        id: UPGRADE.EQUIPEMENT,
        name: 'Équipement de la forge',
        cost: 150,
        growth: 1.7,
        max: 5,
        desc: '+0.10 plafond de qualité / niveau',
    },
};