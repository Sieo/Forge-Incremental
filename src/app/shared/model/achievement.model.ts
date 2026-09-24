import { UpgradeId } from './upgrade.model';

export const ACHIEVEMENT = {
    COMMANDE_EXCEPTIONNELLE: 'commande_exceptionnelle',
    DOUBLE_COUP_MAITRE: 'double_coup_maitre',
} as const;

export type AchievementId = (typeof ACHIEVEMENT)[keyof typeof ACHIEVEMENT];

export type AchievementCondition = 'exceptionalCommand' | 'doubleMasterwork';

export interface AchievementDefinition {
    id: AchievementId;
    name: string;
    description: string;
    rewardDescription: string;
    condition: AchievementCondition;
    rewardUpgrade: UpgradeId;
}

export interface AchievementStatus extends AchievementDefinition {
    obtained: boolean;
}