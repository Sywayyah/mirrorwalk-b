import { UnitGroup } from '../unit-types/types';
import { KeysMatching } from '../utils';
import { Specialties } from './specialties';

export interface ConditionalModifierParamsModel {
  attacker?: UnitGroup;
  attacked: UnitGroup;
}

/* to add: critical strike chance & multiplier, retaliation damage percent */
export interface ModifiersModel extends Specialties {
  /** Econonmy/Macro attributes */
  experienceGainBonus: number; // 0-1 format
  townBuildingCostFactor: number; // 0-1 format

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
  // type
  isRanged: boolean;
  isCavalry: boolean;
  isGhost: boolean;
  isForest: boolean;
  isMagical: boolean;
  isBigCreature: boolean;
  isGiant: boolean;
  isColossal: boolean;

  // percentage, combat
  counterattacks: boolean;
  isPinner: boolean;
  // penalty damage from unpinned unit groups, default is 1.25
  pinningIncomingDamagePercent: number;
  isUnpinnable: boolean;

  isSummon: boolean;
  isBoss: boolean;

  /* states */
  defending: true;

  __sourceObjectId: string;
  __description: () => object;

  /* Modifiers can be returned on condition */
  __attackConditionalModifiers?: (
    params: ConditionalModifierParamsModel,
  ) => Modifiers;

  // mods from specialties can be added to hero, then
  // by this condition, applied/not applied somehow to units.
  __unitConditionalMods: (unitGroup: UnitGroup) => Modifiers | null;

  // might get obsolete.
  // same as above, but for auras.
  // todo: remoteness is also a question, because remoteness is different in different views
  __auraModifiers: (params: {
    target: UnitGroup;
    thisUnit?: UnitGroup;
    remoteness?: number;
    currentGroupPosition?: number;
  }) => Modifiers | null;

  // to implement, can become common on undead items
  heroManacostPenalty: number;
}

export type Modifiers = Partial<ModifiersModel>;

export type ModName = keyof ModifiersModel;
export type NumModNames = KeysMatching<ModifiersModel, number>;
export type BoolModNames = KeysMatching<ModifiersModel, boolean>;
