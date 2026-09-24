import { ItemId } from './item.model';

export interface Command {
    itemId: ItemId;
    qualiteMin: number;
    libelleQualiteMin: string;
    recompense: number;
    salesUntilExpire: number;
}