import { DamageType } from '../api/combat-api';
import { UnitStatsInfo } from '../unit-types';

export const resistsMapping: Partial<Record<DamageType, keyof UnitStatsInfo>> = {
  [DamageType.Cold]: 'coldResist',
  [DamageType.Fire]: 'fireResist',
  [DamageType.Lightning]: 'lightningResist',
  [DamageType.Poison]: 'poisonResist',
};

// defaul cap is 60%
export const defaultResistCap = 60;
