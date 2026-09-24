import { computed, Injectable, signal } from '@angular/core';
import { ACHIEVEMENTS } from '../data/achievements.data';
import {
    ACHIEVEMENT,
    AchievementId,
    AchievementStatus,
} from '../model/achievement.model';
import { UPGRADES } from '../data/upgrades.data';
import { EconomyService } from './economy.service';
import { UpgradeService } from './upgrade.service';

@Injectable({ providedIn: 'root' })
export class AchievementService {
    readonly obtainedIds = signal<AchievementId[]>([]);
    readonly masterworkStreak = signal(0);
    readonly achievements = computed<AchievementStatus[]>(() =>
        ACHIEVEMENTS.map((achievement) => ({
            ...achievement,
            obtained: this.obtainedIds().includes(achievement.id),
        })),
    );

    constructor(
        private readonly economy: EconomyService,
        private readonly upgrades: UpgradeService,
    ) { }

    processSale(isMasterwork: boolean, commandCompleted: boolean, qualityLabel: string | null): void {
        const streak = isMasterwork ? this.masterworkStreak() + 1 : 0;
        this.masterworkStreak.set(streak);

        if (commandCompleted && qualityLabel === 'Exceptionnelle') {
            this.unlock(ACHIEVEMENT.COMMANDE_EXCEPTIONNELLE);
        }
        if (streak >= 2) {
            this.unlock(ACHIEVEMENT.DOUBLE_COUP_MAITRE);
        }
    }

    reset(): void {
        this.obtainedIds.set([]);
        this.masterworkStreak.set(0);
    }

    private unlock(id: AchievementId): void {
        if (this.obtainedIds().includes(id)) return;

        const achievement = ACHIEVEMENTS.find((candidate) => candidate.id === id);
        if (!achievement) return;

        const reward = this.upgrades.grantFreeLevel(achievement.rewardUpgrade);
        const upgradeName = UPGRADES[achievement.rewardUpgrade].name;
        const rewardText = reward.upgraded
            ? `+1 niveau de ${upgradeName}`
            : `+${reward.bonusPieces.toFixed(1)} P (niveau maximum atteint)`;

        this.obtainedIds.update((ids) => [...ids, id]);
        this.economy.addAchievement({
            type: 'achievement',
            achievementName: achievement.name,
            rewardText,
        });
    }
}
