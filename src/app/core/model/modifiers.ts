import { UnitGroupInstModel } from "./main.model";


export interface ConditionalModifierParamsModel {
    // attacker: UnitGroupInstModel;
    attacked: UnitGroupInstModel;
}

export interface ModifiersModel {
    // base damage percent modifier
    baseDamagePercentModifier: number;

    // increases taken magic damage by percent
    amplifiedTakenMagicDamage: number;

    playerBonusAttack: number;

    /* unit group bonuses */
    unitGroupBonusAttack: number;

    /* unit speed bonus */
    unitGroupSpeedBonus: number;

    /* Modifiers can be returned on condition */
    attackConditionalModifiers?: (params: ConditionalModifierParamsModel) => Modifiers;

    /* markers */
    isRanged: boolean;
    counterattacks: boolean;
    isGhost: boolean;
}

export type Modifiers = Partial<ModifiersModel>;