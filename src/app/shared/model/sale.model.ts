export interface Sale {
    type?: 'sale';
    item: string;
    qualite: number;
    libelleQualite: string | null;
    gain: number;
    crit: boolean;
    command?: boolean;
}

export interface AchievementLog {
    type: 'achievement';
    achievementName: string;
    rewardText: string;
}

export type JournalEntry = Sale | AchievementLog;