

export interface ModifiersModel {
    // increases taken magic damage by percent
    amplifiedTakenMagicDamage: number;

    playerBonusAttack: number;

    /* unit group bonuses */
    unitGroupBonusAttack: number;

    /* markers */
    isRanged: boolean;
    counterattacks: boolean;
}

export type Modifiers = Partial<ModifiersModel>;