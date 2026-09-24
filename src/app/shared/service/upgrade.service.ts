import { inject, Injectable, signal } from '@angular/core';
import { EconomyService } from './economy.service';
import { UPGRADES } from '../data/upgrades.data';

@Injectable({ providedIn: 'root' })
export class UpgradeService {
    readonly levels = signal<Record<string, number>>({
        marteau: 0,
        talent: 0,
        negociation: 0,
        equipement: 0,
    });

    private readonly economy: EconomyService = inject(EconomyService);

    level(id: string): number {
        return this.levels()[id] ?? 0;
    }

    cost(id: string): number | null {
        const upgrade = UPGRADES[id];
        if (!upgrade) return null;

        const level = this.level(id);
        if (level >= upgrade.max) return null;

        return Math.round(upgrade.cost * Math.pow(upgrade.growth, level));
    }

    buy(id: string): boolean {
        const cost = this.cost(id);
        if (cost === null || !this.economy.spend(cost)) return false;

        this.levels.update((levels) => ({ ...levels, [id]: this.level(id) + 1 }));
        return true;
    }

    acheter(id: string): boolean {
        return this.buy(id);
    }

    reset(): void {
        this.levels.set({
            marteau: 0,
            talent: 0,
            negociation: 0,
            equipement: 0,
        });
    }
}