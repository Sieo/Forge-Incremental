import { inject, Injectable, signal } from '@angular/core';
import { EconomyService } from './economy.service';
import { UPGRADES } from '../data/upgrades.data';
import { UPGRADE, UpgradeId } from '../model/upgrade.model';

export interface FreeLevelResult {
    upgraded: boolean;
    bonusPieces: number;
}

@Injectable({ providedIn: 'root' })
export class UpgradeService {
    readonly levels = signal<Record<UpgradeId, number>>({
        [UPGRADE.MARTEAU]: 0,
        [UPGRADE.TALENT]: 0,
        [UPGRADE.NEGOCIATION]: 0,
        [UPGRADE.EQUIPEMENT]: 0,
    });

    private readonly economy: EconomyService = inject(EconomyService);

    level(id: UpgradeId): number {
        return this.levels()[id] ?? 0;
    }

    cost(id: UpgradeId): number | null {
        const upgrade = UPGRADES[id];
        if (!upgrade) return null;

        const level = this.level(id);
        if (level >= upgrade.max) return null;

        return Math.round(upgrade.cost * Math.pow(upgrade.growth, level));
    }

    buy(id: UpgradeId): boolean {
        const cost = this.cost(id);
        if (cost === null || !this.economy.spend(cost)) return false;

        this.levels.update((levels) => ({ ...levels, [id]: this.level(id) + 1 }));
        return true;
    }

    acheter(id: UpgradeId): boolean {
        return this.buy(id);
    }

    grantFreeLevel(id: UpgradeId): FreeLevelResult {
        const upgrade = UPGRADES[id];
        const level = this.level(id);
        if (!upgrade || level >= upgrade.max) {
            const bonusPieces = upgrade
                ? Math.round(upgrade.cost * Math.pow(upgrade.growth, level))
                : 0;
            if (bonusPieces > 0) this.economy.addBonusPieces(bonusPieces);
            return { upgraded: false, bonusPieces };
        }

        this.levels.update((levels) => ({ ...levels, [id]: level + 1 }));
        return { upgraded: true, bonusPieces: 0 };
    }

    reset(): void {
        this.levels.set({
            [UPGRADE.MARTEAU]: 0,
            [UPGRADE.TALENT]: 0,
            [UPGRADE.NEGOCIATION]: 0,
            [UPGRADE.EQUIPEMENT]: 0,
        });
    }
}