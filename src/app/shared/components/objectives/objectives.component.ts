import { DecimalPipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { EconomyService } from '../../service/economy.service';
import { PalierService } from '../../service/palier.service';
import { GAME_RULES } from '../../data/game-rules.data';

@Component({
    imports: [DecimalPipe],
    selector: 'app-objectives',
    standalone: true,
    templateUrl: './objectives.component.html',
    styleUrl: './objectives.component.scss',
})
export class ObjectivesComponent {
    readonly economy = inject(EconomyService);
    readonly paliers = inject(PalierService);
    readonly modalVisible = signal(false);
    readonly progress = computed(() => Math.min(this.economy.pieces(), GAME_RULES.forge.independentCost));
    readonly progressPercent = computed(() => (this.progress() / GAME_RULES.forge.independentCost) * 100);
    readonly objective = GAME_RULES.forge.independentCost;

    openForge(): void {
        if (this.paliers.openForge()) {
            this.modalVisible.set(true);
        }
    }

    closeModal(): void {
        this.modalVisible.set(false);
    }
}