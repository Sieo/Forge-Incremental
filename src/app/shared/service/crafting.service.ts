import { Injectable, computed, inject, signal } from '@angular/core';
import { ITEM, Item, ItemId } from '../model/item.model';
import { Command } from '../model/command.model';
import { UPGRADE } from '../model/upgrade.model';
import { EconomyService } from './economy.service';
import { PalierService } from './palier.service';
import { UpgradeService } from './upgrade.service';
import { ITEMS } from '../data/items.data';
import { GAME_RULES } from '../data/game-rules.data';
import { AchievementService } from './achievement.service';

export function libelleQualite(
    qualite: number,
    qualiteMoyenne: number,
    variance: number,
): string {
    const ecart = (qualite - qualiteMoyenne) / variance;
    if (ecart >= 0.5) return 'Exceptionnelle';
    if (ecart >= 0) return 'Très bonne';
    if (ecart >= -0.5) return 'Bonne';
    return 'Médiocre';
}

@Injectable({ providedIn: 'root' })
export class CraftingService {
    readonly progress = signal(0);
    readonly selectedItemId = signal<ItemId>(ITEM.POINTES);
    readonly activeCommand = signal<Command | null>(null);
    readonly commandHistory = signal<Command[]>([]);
    readonly salesSinceLastCommand = signal(0);
    readonly nextCommandThreshold = signal<number>(GAME_RULES.commands.initialThreshold);

    readonly currentItem = computed<Item>(() => {
        const selectedItem = ITEMS[this.selectedItemId()];
        return selectedItem && this.paliers.isItemUnlocked(selectedItem.id)
            ? selectedItem
            : ITEMS[ITEM.POINTES];
    });
    readonly vitesse = computed(() =>
        GAME_RULES.crafting.baseSpeed
        + GAME_RULES.crafting.speedPerHammerLevel * this.upgrades.level(UPGRADE.MARTEAU),
    );
    readonly coupsNecessaires = computed(() => this.coupsEffectifs(this.currentItem()));
    readonly clicsEffectues = computed(() =>
        this.clicsPourProgression(this.currentItem(), this.progress()),
    );
    readonly plafondQualite = computed(() =>
        GAME_RULES.crafting.baseQualityCeiling
        + GAME_RULES.crafting.qualityCeilingPerEquipmentLevel * this.upgrades.level(UPGRADE.EQUIPEMENT),
    );
    readonly qualiteMoyenne = computed(() =>
        Math.min(
            GAME_RULES.crafting.baseAverageQuality
            + GAME_RULES.crafting.averageQualityPerTalentLevel * this.upgrades.level(UPGRADE.TALENT),
            this.plafondQualite(),
        ),
    );
    readonly prelevement = computed(() =>
        Math.max(
            GAME_RULES.crafting.baseLevy
            - GAME_RULES.crafting.levyPerNegotiationLevel * this.upgrades.level(UPGRADE.NEGOCIATION),
            GAME_RULES.crafting.minimumLevy,
        ),
    );

    private readonly economy: EconomyService = inject(EconomyService);
    private readonly upgrades: UpgradeService = inject(UpgradeService);
    private readonly paliers: PalierService = inject(PalierService);
    private readonly achievements: AchievementService = inject(AchievementService);

    strike(): void {
        if (this.paliers.forgeOpened()) return;

        const item = this.currentItem();
        const nextProgress = this.progress() + this.vitesse();
        if (nextProgress < item.coups - GAME_RULES.crafting.progressEpsilon) {
            this.progress.set(nextProgress);
            return;
        }

        const estCoupDeMaitre = Math.random() < GAME_RULES.crafting.masterworkChance;
        const qualiteMoyenneAuTirage = this.qualiteMoyenne();
        const qualite = estCoupDeMaitre
            ? this.plafondQualite() * (
                GAME_RULES.crafting.masterworkQualityBase
                + Math.random() * GAME_RULES.crafting.masterworkQualityVariation
            )
            : Math.max(
                GAME_RULES.crafting.minimumQuality,
                Math.min(
                    qualiteMoyenneAuTirage
                    + (Math.random() * GAME_RULES.crafting.qualityVariation
                        - GAME_RULES.crafting.qualityVariation / 2),
                    this.plafondQualite() + GAME_RULES.crafting.qualityCeilingMargin,
                ),
            );
        const brut = item.valeur * qualite;
        const gain = brut * (1 - this.prelevement());
        const libelle = estCoupDeMaitre
            ? null
            : libelleQualite(
                qualite,
                qualiteMoyenneAuTirage,
                GAME_RULES.crafting.qualityVariation / 2,
            );

        this.progress.set(0);
        const command = this.activeCommand();
        const commandCompleted = command !== null
            && command.itemId === item.id
            && (
                qualite >= command.qualiteMin
                || (
                    command.libelleQualiteMin === 'Exceptionnelle'
                    && libelle === 'Exceptionnelle'
                )
            );

        if (commandCompleted) {
            this.economy.addSale({
                item: item.name,
                qualite,
                libelleQualite: libelle,
                gain: gain + command.recompense,
                crit: estCoupDeMaitre,
                command: true,
            });
            this.achievements.processSale(estCoupDeMaitre, true, libelle);
            this.commandHistory.update((history) =>
                [command, ...history].slice(0, GAME_RULES.commands.visibleHistorySize),
            );
            this.activeCommand.set(null);
            this.salesSinceLastCommand.set(0);
        } else {
            this.economy.addSale({
                item: item.name,
                qualite,
                libelleQualite: libelle,
                gain,
                crit: estCoupDeMaitre,
            });
            this.achievements.processSale(estCoupDeMaitre, false, libelle);
            this.enregistrerVentePourCommande();
        }
    }

    frapper(): void {
        this.strike();
    }

    coupsEffectifs(item: Item): number {
        const vitesse = this.vitesse();
        let progress = 0;
        let clics = 0;

        while (progress < item.coups - GAME_RULES.crafting.progressEpsilon) {
            progress += vitesse;
            clics += 1;
        }

        return clics;
    }

    private clicsPourProgression(item: Item, progression: number): number {
        const vitesse = this.vitesse();
        let progress = 0;
        let clics = 0;

        while (progress < progression - GAME_RULES.crafting.progressEpsilon && clics < this.coupsEffectifs(item)) {
            progress += vitesse;
            clics += 1;
        }

        return clics;
    }

    selectItem(id: ItemId): boolean {
        const item = ITEMS[id];
        if (!item || !this.paliers.isItemUnlocked(id)) return false;

        this.selectedItemId.set(id);
        this.progress.set(0);
        return true;
    }

    selectionner(id: ItemId): boolean {
        return this.selectItem(id);
    }

    reset(): void {
        this.progress.set(0);
        this.selectedItemId.set(ITEM.POINTES);
        this.activeCommand.set(null);
        this.commandHistory.set([]);
        this.salesSinceLastCommand.set(0);
        this.nextCommandThreshold.set(GAME_RULES.commands.initialThreshold);
        this.achievements.reset();
    }

    genererCommande(): Command {
        const candidats: ItemId[] = [ITEM.POINTES, ITEM.EPEE, ITEM.HACHE]
            .filter((id) => this.paliers.isItemUnlocked(id));
        const itemId = candidats[Math.floor(Math.random() * candidats.length)];
        const item = ITEMS[itemId];
        const qualiteMoyenneAuTirage = this.qualiteMoyenne();
        const qualiteMin = qualiteMoyenneAuTirage * (
            GAME_RULES.commands.qualityMultiplierBase
            + Math.random() * GAME_RULES.commands.qualityMultiplierVariation
        );
        this.nextCommandThreshold.set(
            GAME_RULES.commands.minimumThreshold
            + Math.floor(Math.random() * GAME_RULES.commands.thresholdRange),
        );

        return {
            itemId,
            qualiteMin,
            libelleQualiteMin: libelleQualite(
                qualiteMin,
                qualiteMoyenneAuTirage,
                GAME_RULES.crafting.qualityVariation / 2,
            ),
            recompense: item.valeur * qualiteMin * 1.5,
            salesUntilExpire: GAME_RULES.commands.salesUntilExpire,
        };
    }

    private enregistrerVentePourCommande(): void {
        const command = this.activeCommand();
        if (command) {
            const salesUntilExpire = command.salesUntilExpire - 1;
            this.activeCommand.set(
                salesUntilExpire > 0 ? { ...command, salesUntilExpire } : null,
            );
            return;
        }

        const salesSinceLastCommand = this.salesSinceLastCommand() + 1;
        this.salesSinceLastCommand.set(salesSinceLastCommand);
        if (salesSinceLastCommand >= this.nextCommandThreshold()) {
            this.activeCommand.set(this.genererCommande());
            this.salesSinceLastCommand.set(0);
        }
    }
}