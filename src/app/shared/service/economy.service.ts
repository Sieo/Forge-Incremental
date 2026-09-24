import { Injectable, signal } from '@angular/core';
import { GAME_RULES } from '../data/game-rules.data';
import { Sale } from '../model/sale.model';
import { AchievementLog, JournalEntry } from '../model/sale.model';

@Injectable({ providedIn: 'root' })
export class EconomyService {
    readonly pieces = signal(0);
    readonly lifetimeGains = signal(0);
    readonly sales = signal<JournalEntry[]>([]);

    addSale(sale: Sale): void {
        this.pieces.update((pieces) => pieces + sale.gain);
        this.lifetimeGains.update((gains) => gains + sale.gain);
        this.sales.update((sales) =>
            [sale, ...sales].slice(0, GAME_RULES.display.visibleSalesSize),
        );
    }

    addAchievement(entry: AchievementLog): void {
        this.sales.update((sales) =>
            [entry, ...sales].slice(0, GAME_RULES.display.visibleSalesSize),
        );
    }

    addBonusPieces(amount: number): void {
        this.pieces.update((pieces) => pieces + amount);
    }

    spend(amount: number): boolean {
        if (amount < 0 || this.pieces() < amount) return false;

        this.pieces.update((pieces) => pieces - amount);
        return true;
    }

    reset(): void {
        this.pieces.set(0);
        this.lifetimeGains.set(0);
        this.sales.set([]);
    }
}