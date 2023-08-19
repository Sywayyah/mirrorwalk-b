import { UnitGroup } from '../unit-types/types';
import { KeysMatching } from '../utils';
import { Masteries } from './specialties';

export interface ConditionalModifierParamsModel {
  // attacker: UnitGroupInstModel;
  attacked: UnitGroup;
}

/* to add: critical strike chance & multiplier, retaliation damage percent */
export interface ModifiersModel extends Masteries {
  // base damage percent modifier
  baseDamagePercentModifier: number;

  // increases taken universal magic damage by percent
  // specified in 0-1 scale
  amplifiedTakenMagicDamagePercent: number;

  // player bonuses
  playerBonusAttack: number;
  playerBonusDefence: number;

  /* unit group bonuses */
  // todo: check, not sure if it works properly, maybe needs to be removed
  unitGroupBonusAttack: number;
  unitGroupBonusDefence: number;

  /* unit speed bonus */
  unitGroupSpeedBonus: number;

  // to be implemented
  lifesteal: number;
  retaliationDamagePercent: number;
  criticalDamageMul: number;
  criticalDamageChance: number;

  // specified in 0-100 scale
  resistAll: number;
  resistFire: number;
  resistCold: number;
  resistPoison: number;
  resistLightning: number;

  /* Modifiers can be returned on condition */
  attackConditionalModifiers?: (params: ConditionalModifierParamsModel) => Modifiers;

  /* markers */
  isRanged: boolean;
  counterattacks: boolean;
  isGhost: boolean;
  isSummon: boolean;
  isBoss: boolean;

  // this can be used potentially to imlpement specialties.
  // mods from specialties can be added to hero, then
  // by this condition, applied/not applied somehow to units.
  __unitTypeModifiers: (unitGroup: UnitGroup) => Modifiers;

  // same as above, but for auras.
  __auraModifiers: () => Modifiers;

  // additionally, theoretically.. specialties can be a part of modifiers,
  // but maybe there can be a separate modGroup, containing only specialties or something.
  // or maybe it can be a part of main stream of mods
  // todo: for now, it is in main stream, but I tend to replicate it into another mod stream

  // Need to think about definition of bonuses per Specialty
}

export type Modifiers = Partial<ModifiersModel>;

export type ModName = keyof ModifiersModel;
export type NumModNames = KeysMatching<ModifiersModel, number>;
export type BoolModNames = KeysMatching<ModifiersModel, boolean>;
