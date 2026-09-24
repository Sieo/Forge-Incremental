export const UPGRADE = {
    MARTEAU: 'marteau',
    TALENT: 'talent',
    NEGOCIATION: 'negociation',
    EQUIPEMENT: 'equipement',
} as const;

export type UpgradeId = (typeof UPGRADE)[keyof typeof UPGRADE];

export interface Upgrade {
    id: UpgradeId;
    name: string;
    cost: number;
    growth: number;
    max: number;
    desc: string;
}