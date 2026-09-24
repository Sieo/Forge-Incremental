import { ItemId } from './item.model';

export interface Command {
    itemId: ItemId;
    qualiteMin: number;
    recompense: number;
    salesUntilExpire: number;
}