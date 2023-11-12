import { UnitGroup } from '../unit-types/types';
import { KeysMatching } from '../utils';
import { Specialties } from './specialties';

export interface ConditionalModifierParamsModel {
  attacker?: UnitGroup;
  attacked: UnitGroup;
}

/* to add: critical strike chance & multiplier, retaliation damage percent */
export interface ModifiersModel extends Specialties {
  // base damage percent modifier
  baseDamagePercentModifier: number;

  // increases taken universal magic damage by percent
  // specified in 0-1 scale
  amplifiedTakenMagicDamagePercent: number;

  // player bonuses
  // todo: theoretically, can be renamed starting with unitGroup
  heroBonusAttack: number;
  heroBonusDefence: number;
  heroMaxMana: number;

  /* unit speed bonus */
  unitGroupSpeedBonus: number;
  cannotBeSlowed: boolean;
  fixedSpeed: number;

  lifesteal: number;
  // to implement
  retaliationDamagePercent: number;

// critical damage
  criticalDamageChance: number;
  criticalDamageMul: number;

  // damage block
  // chance is in 0-1 scale
  // needs to be specified all together on same modfiers instance
  chanceToBlock: number;
  damageBlockMin: number;
  damageBlockMax: number;

  // percent of block value will be ignored
  blockPiercingPercent: number;

  // specified in 0-100 scale
  resistAll: number;
  resistFire: number;
  resistCold: number;
  resistPoison: number;
  resistLightning: number;

  /* markers */
  isRanged: boolean;
  counterattacks: boolean;
  isGhost: boolean;
  isSummon: boolean;
  isBoss: boolean;

  /* states */
  defending: true,

  /* Modifiers can be returned on condition */
  __attackConditionalModifiers?: (params: ConditionalModifierParamsModel) => Modifiers;

  // mods from specialties can be added to hero, then
  // by this condition, applied/not applied somehow to units.
  __unitConditionalMods: (unitGroup: UnitGroup) => Modifiers | null;

  // might get obsolete.
  // same as above, but for auras.
  __auraModifiers: () => Modifiers;
}

export type Modifiers = Partial<ModifiersModel>;

export type ModName = keyof ModifiersModel;
export type NumModNames = KeysMatching<ModifiersModel, number>;
export type BoolModNames = KeysMatching<ModifiersModel, boolean>;
