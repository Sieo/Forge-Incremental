import { UPGRADE } from '../model/upgrade.model';
import { ACHIEVEMENT, AchievementDefinition } from '../model/achievement.model';

export const ACHIEVEMENTS: AchievementDefinition[] = [
    {
        id: ACHIEVEMENT.COMMANDE_EXCEPTIONNELLE,
        name: 'Commande exceptionnelle',
        description: 'Compléter une commande avec une qualité exceptionnelle.',
        rewardDescription: '+1 niveau de Négociation, ou des pièces au niveau maximum.',
        condition: 'exceptionalCommand',
        rewardUpgrade: UPGRADE.NEGOCIATION,
    },
    {
        id: ACHIEVEMENT.DOUBLE_COUP_MAITRE,
        name: 'Double coup de maître',
        description: 'Obtenir deux coups de maître consécutifs.',
        rewardDescription: '+1 niveau de Talent de forgeron, ou des pièces au niveau maximum.',
        condition: 'doubleMasterwork',
        rewardUpgrade: UPGRADE.TALENT,
    },
];