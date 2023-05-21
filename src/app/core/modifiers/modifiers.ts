import { UnitGroupInstModel } from '../unit-types/types';


export interface ConditionalModifierParamsModel {
  // attacker: UnitGroupInstModel;
  attacked: UnitGroupInstModel;
}

export interface ModifiersModel {
  // base damage percent modifier
  baseDamagePercentModifier: number;

  // increases taken magic damage by percent
  amplifiedTakenMagicDamage: number;

  // player bonuses
  playerBonusAttack: number;
  playerBonusDefence: number;


  /* unit group bonuses */
  unitGroupBonusAttack: number;
  unitGroupBonusDefence: number;

  resistAll: number;

  /* unit speed bonus */
  unitGroupSpeedBonus: number;

  /* Modifiers can be returned on condition */
  attackConditionalModifiers?: (params: ConditionalModifierParamsModel) => Modifiers;

  /* markers */
  isRanged: boolean;
  counterattacks: boolean;
  isGhost: boolean;
  isSummon: boolean;
}

export type Modifiers = Partial<ModifiersModel>;


/* Work in progress. This container can potentially aggregate combined values with
  no need for recalc the array of Modifiers.
*/