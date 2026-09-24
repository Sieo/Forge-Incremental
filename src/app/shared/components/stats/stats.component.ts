import { Component, inject } from '@angular/core';
import { CraftingService } from '../../service/crafting.service';
import { EconomyService } from '../../service/economy.service';

@Component({
    selector: 'app-stats',
    standalone: true,
    templateUrl: './stats.component.html',
    styleUrl: './stats.component.scss',
})
export class StatsComponent {
    readonly economy = inject(EconomyService);
    readonly crafting = inject(CraftingService);
}