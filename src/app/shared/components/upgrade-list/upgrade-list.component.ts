import { Component, inject } from '@angular/core';
import { UPGRADES } from '../../data/upgrades.data';
import { EconomyService } from '../../service/economy.service';
import { PalierService } from '../../service/palier.service';
import { UpgradeService } from '../../service/upgrade.service';

@Component({
    selector: 'app-upgrade-list',
    standalone: true,
    templateUrl: './upgrade-list.component.html',
    styleUrl: './upgrade-list.component.scss',
})
export class UpgradeListComponent {
    readonly upgrades = Object.values(UPGRADES);
    readonly economy = inject(EconomyService);
    readonly upgradeService = inject(UpgradeService);
    readonly paliers = inject(PalierService);

    acheter(id: string): void {
        this.upgradeService.acheter(id);
    }
}