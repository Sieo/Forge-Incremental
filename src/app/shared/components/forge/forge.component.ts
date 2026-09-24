import { Component, computed, inject } from '@angular/core';
import { CraftingService } from '../../service/crafting.service';
import { PalierService } from '../../service/palier.service';

@Component({
    selector: 'app-forge',
    standalone: true,
    templateUrl: './forge.component.html',
    styleUrl: './forge.component.scss',
})
export class ForgeComponent {
    readonly crafting = inject(CraftingService);
    readonly paliers = inject(PalierService);
    readonly progressPercent = computed(() =>
        Math.min(100, (this.crafting.progress() / this.crafting.currentItem().coups) * 100),
    );

    frapper(): void {
        this.crafting.frapper();
    }
}