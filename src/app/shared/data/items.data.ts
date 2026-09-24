import { ITEM, Item, ItemId } from '../model/item.model';

export const ITEMS: Record<ItemId, Item> = {
    [ITEM.POINTES]: { id: ITEM.POINTES, name: 'Pointes de flèches', coups: 3, valeur: 2 },
    [ITEM.EPEE]: { id: ITEM.EPEE, name: 'Épée', coups: 10, valeur: 10 },
    [ITEM.HACHE]: { id: ITEM.HACHE, name: 'Hache', coups: 18, valeur: 21 },
};