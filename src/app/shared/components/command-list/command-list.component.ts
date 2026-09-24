import { Component, inject } from '@angular/core';
import { ITEMS } from '../../data/items.data';
import { CraftingService } from '../../service/crafting.service';

@Component({
    imports: [],
    selector: 'app-command-list',
    standalone: true,
    templateUrl: './command-list.component.html',
    styleUrl: './command-list.component.scss',
})
export class CommandListComponent {
    readonly crafting = inject(CraftingService);
    readonly items = ITEMS;
}