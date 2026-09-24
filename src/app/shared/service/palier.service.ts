import { Injectable, computed, inject, signal } from '@angular/core';
import { EconomyService } from './economy.service';
import { UpgradeService } from './upgrade.service';
import { GAME_RULES } from '../data/game-rules.data';
import { ITEM, ItemId } from '../model/item.model';
import { UPGRADE } from '../model/upgrade.model';

@Injectable({ providedIn: 'root' })
export class PalierService {
    readonly forgeOpened = signal(false);
    readonly canOpenForge = computed(
        () => !this.forgeOpened() && this.economy.pieces() >= GAME_RULES.forge.independentCost,
    );
    readonly epeeUnlocked = computed(
        () => this.economy.lifetimeGains() >= GAME_RULES.forge.swordUnlockLifetimeGains,
    );
    readonly hacheUnlocked = computed(() =>
        this.upgrades.level(UPGRADE.EQUIPEMENT) >= GAME_RULES.forge.axeUnlockEquipmentLevel,
    );

    private readonly economy: EconomyService = inject(EconomyService);
    private readonly upgrades: UpgradeService = inject(UpgradeService);

    isItemUnlocked(id: ItemId): boolean {
        if (id === ITEM.POINTES) return true;
        if (id === ITEM.EPEE) return this.epeeUnlocked();
        if (id === ITEM.HACHE) return this.hacheUnlocked();
        return false;
    }

    openForge(): boolean {
        if (!this.canOpenForge() || !this.economy.spend(GAME_RULES.forge.independentCost)) {
            return false;
        }

        this.forgeOpened.set(true);
        return true;
    }

    reset(): void {
        this.forgeOpened.set(false);
    }
}