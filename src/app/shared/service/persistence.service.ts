import { effect, inject, Injectable } from '@angular/core';
import { Sale, EconomyService } from './economy.service';
import { CraftingService } from './crafting.service';
import { Command } from '../model/command.model';
import { ITEMS } from '../data/items.data';
import { ItemId } from '../model/item.model';
import { UpgradeId } from '../model/upgrade.model';
import { GAME_RULES } from '../data/game-rules.data';
import { PalierService } from './palier.service';
import { UpgradeService } from './upgrade.service';

interface PersistenceState {
    pieces: number;
    lifetimeGains: number;
    sales: Sale[];
    levels: Partial<Record<UpgradeId, number>>;
    progress: number;
    selectedItemId: ItemId;
    forgeOpened: boolean;
    activeCommand: Command | null;
    commandHistory: Command[];
    salesSinceLastCommand: number;
    nextCommandThreshold: number;
}

const SAVE_KEY = 'forgeron_proto_save_v1';

@Injectable({ providedIn: 'root' })
export class PersistenceService {
    private readonly economy: EconomyService = inject(EconomyService);
    private readonly upgrades: UpgradeService = inject(UpgradeService);
    private readonly crafting: CraftingService = inject(CraftingService);
    private readonly paliers: PalierService = inject(PalierService);

    constructor() {
        this.load();

        effect(() => {
            const state: PersistenceState = {
                pieces: this.economy.pieces(),
                lifetimeGains: this.economy.lifetimeGains(),
                sales: this.economy.sales(),
                levels: this.upgrades.levels(),
                progress: this.crafting.progress(),
                selectedItemId: this.crafting.selectedItemId(),
                forgeOpened: this.paliers.forgeOpened(),
                activeCommand: this.crafting.activeCommand(),
                commandHistory: this.crafting.commandHistory(),
                salesSinceLastCommand: this.crafting.salesSinceLastCommand(),
                nextCommandThreshold: this.crafting.nextCommandThreshold(),
            };

            this.save(state);
        });
    }

    private load(): void {
        if (typeof localStorage === 'undefined') return;

        try {
            const rawState = localStorage.getItem(SAVE_KEY);
            if (!rawState) return;

            const state = JSON.parse(rawState) as Partial<PersistenceState>;
            if (typeof state.pieces === 'number') this.economy.pieces.set(state.pieces);
            if (typeof state.lifetimeGains === 'number') {
                this.economy.lifetimeGains.set(state.lifetimeGains);
            }
            if (Array.isArray(state.sales)) this.economy.sales.set(state.sales);
            if (state.levels && typeof state.levels === 'object') {
                this.upgrades.levels.set({ ...this.upgrades.levels(), ...state.levels });
            }
            if (typeof state.progress === 'number') this.crafting.progress.set(state.progress);
            if (state.selectedItemId && Object.hasOwn(ITEMS, state.selectedItemId)) {
                this.crafting.selectedItemId.set(state.selectedItemId);
            }
            if (typeof state.forgeOpened === 'boolean') {
                this.paliers.forgeOpened.set(state.forgeOpened);
            }
            if (state.activeCommand === null || (state.activeCommand && typeof state.activeCommand === 'object')) {
                this.crafting.activeCommand.set(state.activeCommand ?? null);
            }
            if (Array.isArray(state.commandHistory)) {
                this.crafting.commandHistory.set(
                    state.commandHistory.slice(0, GAME_RULES.commands.visibleHistorySize),
                );
            }
            if (typeof state.salesSinceLastCommand === 'number') {
                this.crafting.salesSinceLastCommand.set(state.salesSinceLastCommand);
            }
            if (typeof state.nextCommandThreshold === 'number') {
                this.crafting.nextCommandThreshold.set(state.nextCommandThreshold);
            }
        } catch {
            localStorage.removeItem(SAVE_KEY);
        }
    }

    private save(state: PersistenceState): void {
        if (typeof localStorage === 'undefined') return;

        try {
            localStorage.setItem(SAVE_KEY, JSON.stringify(state));
        } catch {
            // La partie reste jouable si le stockage local est indisponible.
        }
    }
}