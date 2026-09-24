import { Component, inject } from '@angular/core';
import { ITEMS } from '../../data/items.data';
import { CraftingService } from '../../service/crafting.service';
import { PalierService } from '../../service/palier.service';
import { ItemId } from '../../model/item.model';

@Component({
    selector: 'app-item-list',
    standalone: true,
    templateUrl: './item-list.component.html',
    styleUrl: './item-list.component.scss',
})
export class ItemListComponent {
    readonly items = Object.values(ITEMS);
    readonly crafting = inject(CraftingService);
    readonly paliers = inject(PalierService);

    selectionner(id: ItemId): void {
        this.crafting.selectionner(id);
    }
}