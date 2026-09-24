import { Item } from "../model/item.model";

export const ITEMS: Record<string, Item> = {
    pointes: { id: 'pointes', name: 'Pointes de flèches', coups: 3, valeur: 2 },
    epee: { id: 'epee', name: 'Épée', coups: 10, valeur: 10 },
    hache: { id: 'hache', name: 'Hache', coups: 18, valeur: 21 },
};