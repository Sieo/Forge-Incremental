import { Injectable, computed, inject, signal } from '@angular/core';
import { EconomyService } from './economy.service';
import { UpgradeService } from './upgrade.service';

const FORGE_INDEPENDANTE_COUT = 3000;
const EPEE_UNLOCK_GAINS = 20;

@Injectable({ providedIn: 'root' })
export class PalierService {
    readonly forgeOpened = signal(false);
    readonly canOpenForge = computed(
        () => !this.forgeOpened() && this.economy.pieces() >= FORGE_INDEPENDANTE_COUT,
    );
    readonly epeeUnlocked = computed(
        () => this.economy.lifetimeGains() >= EPEE_UNLOCK_GAINS,
    );
    readonly hacheUnlocked = computed(() => this.upgrades.level('equipement') >= 1);


    private readonly economy: EconomyService = inject(EconomyService);
    private readonly upgrades: UpgradeService = inject(UpgradeService);

    isItemUnlocked(id: string): boolean {
        if (id === 'pointes') return true;
        if (id === 'epee') return this.epeeUnlocked();
        if (id === 'hache') return this.hacheUnlocked();
        return false;
    }

    openForge(): boolean {
        if (!this.canOpenForge() || !this.economy.spend(FORGE_INDEPENDANTE_COUT)) {
            return false;
        }

        this.forgeOpened.set(true);
        return true;
    }

    reset(): void {
        this.forgeOpened.set(false);
    }
}