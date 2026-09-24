export const ITEM = {
    POINTES: 'pointes',
    EPEE: 'epee',
    HACHE: 'hache',
} as const;

export type ItemId = (typeof ITEM)[keyof typeof ITEM];

export interface Item {
    id: ItemId;
    name: string;
    coups: number;
    valeur: number;
}