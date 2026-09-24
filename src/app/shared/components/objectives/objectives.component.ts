import { DecimalPipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { EconomyService } from '../../service/economy.service';
import { PalierService } from '../../service/palier.service';

const FORGE_OBJECTIVE = 3000;

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
    readonly progress = computed(() => Math.min(this.economy.pieces(), FORGE_OBJECTIVE));
    readonly progressPercent = computed(() => (this.progress() / FORGE_OBJECTIVE) * 100);
    readonly objective = FORGE_OBJECTIVE;

    openForge(): void {
        if (this.paliers.openForge()) {
            this.modalVisible.set(true);
        }
    }

    closeModal(): void {
        this.modalVisible.set(false);
    }
}