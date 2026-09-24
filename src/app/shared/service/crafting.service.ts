import { Injectable, computed, inject, signal } from '@angular/core';
import { Item } from '../model/item.model';
import { EconomyService } from './economy.service';
import { PalierService } from './palier.service';
import { UpgradeService } from './upgrade.service';
import { ITEMS } from '../data/items.data';

@Injectable({ providedIn: 'root' })
export class CraftingService {
    readonly progress = signal(0);
    readonly selectedItemId = signal('pointes');

    readonly currentItem = computed<Item>(() => {
        const selectedItem = ITEMS[this.selectedItemId()];
        return selectedItem && this.paliers.isItemUnlocked(selectedItem.id)
            ? selectedItem
            : ITEMS['pointes'];
    });
    readonly vitesse = computed(() => 1 + 0.2 * this.upgrades.level('marteau'));
    readonly coupsNecessaires = computed(() => this.coupsEffectifs(this.currentItem()));
    readonly clicsEffectues = computed(() =>
        this.clicsPourProgression(this.currentItem(), this.progress()),
    );
    readonly plafondQualite = computed(() => 1 + 0.1 * this.upgrades.level('equipement'));
    readonly qualiteMoyenne = computed(() =>
        Math.min(0.8 + 0.04 * this.upgrades.level('talent'), this.plafondQualite()),
    );
    readonly prelevement = computed(() =>
        Math.max(0.6 - 0.02 * this.upgrades.level('negociation'), 0.4),
    );

    private readonly economy: EconomyService = inject(EconomyService);
    private readonly upgrades: UpgradeService = inject(UpgradeService);
    private readonly paliers: PalierService = inject(PalierService);

    strike(): void {
        if (this.paliers.forgeOpened()) return;

        const item = this.currentItem();
        const nextProgress = this.progress() + this.vitesse();
        if (nextProgress < item.coups - 1e-9) {
            this.progress.set(nextProgress);
            return;
        }

        const estCoupDeMaitre = Math.random() < 0.03;
        const qualite = estCoupDeMaitre
            ? this.plafondQualite() * (1.3 + Math.random() * 0.2)
            : Math.max(
                0.1,
                Math.min(
                    this.qualiteMoyenne() + (Math.random() * 0.3 - 0.15),
                    this.plafondQualite() + 0.05,
                ),
            );
        const brut = item.valeur * qualite;
        const gain = brut * (1 - this.prelevement());

        this.progress.set(0);
        this.economy.addSale({ item: item.name, qualite, gain, crit: estCoupDeMaitre });
    }

    frapper(): void {
        this.strike();
    }

    coupsEffectifs(item: Item): number {
        const vitesse = this.vitesse();
        let progress = 0;
        let clics = 0;

        while (progress < item.coups - 1e-9) {
            progress += vitesse;
            clics += 1;
        }

        return clics;
    }

    private clicsPourProgression(item: Item, progression: number): number {
        const vitesse = this.vitesse();
        let progress = 0;
        let clics = 0;

        while (progress < progression - 1e-9 && clics < this.coupsEffectifs(item)) {
            progress += vitesse;
            clics += 1;
        }

        return clics;
    }

    selectItem(id: string): boolean {
        const item = ITEMS[id];
        if (!item || !this.paliers.isItemUnlocked(id)) return false;

        this.selectedItemId.set(id);
        this.progress.set(0);
        return true;
    }

    selectionner(id: string): boolean {
        return this.selectItem(id);
    }

    reset(): void {
        this.progress.set(0);
        this.selectedItemId.set('pointes');
    }
}