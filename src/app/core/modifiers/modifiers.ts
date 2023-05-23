import { UnitGroupInstModel } from '../unit-types/types';
import { KeysMatching } from '../utils';


export interface ConditionalModifierParamsModel {
  // attacker: UnitGroupInstModel;
  attacked: UnitGroupInstModel;
}

export interface ModifiersModel {
  // base damage percent modifier
  baseDamagePercentModifier: number;

  // increases taken magic damage by percent
  amplifiedTakenMagicDamagePercent: number;

  // player bonuses
  playerBonusAttack: number;
  playerBonusDefence: number;


  /* unit group bonuses */
  unitGroupBonusAttack: number;
  unitGroupBonusDefence: number;

  // to be implemented
  lifesteal: number;

  // to be implemented
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

export type ModName = keyof ModifiersModel;
export type NumModNames = KeysMatching<ModifiersModel, number>;
export type BoolModNames = KeysMatching<ModifiersModel, boolean>;
