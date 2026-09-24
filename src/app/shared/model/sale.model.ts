export interface Sale {
    item: string;
    qualite: number;
    libelleQualite: string | null;
    gain: number;
    crit: boolean;
    command?: boolean;
}