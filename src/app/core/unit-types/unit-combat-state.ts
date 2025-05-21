import { VariantableDefault } from '../utils';
import type { UnitGroup } from './types';

export enum CombatStateEnum {
  Normal,
  Initial,
  Retreated,
  Defending,
  Pinned,
  Pinning,
  Fleeing,
  Recharging,
  RechargingFailed,
  Dead,
}

export type CombatStateVariants = VariantableDefault<
  CombatStateEnum,
  {
    [CombatStateEnum.Pinned]: { pinnedBy: UnitGroup };
    [CombatStateEnum.Pinning]: { pinning: UnitGroup };
  }
>;

export const CombatStateIconMapping: Record<CombatStateEnum, string | null> = {
  [CombatStateEnum.Defending]: 'shield',
  // yellow circle
  [CombatStateEnum.Initial]: null,
  // yellow circle
  [CombatStateEnum.Normal]: null,
  [CombatStateEnum.Dead]: 'skull',
  [CombatStateEnum.Pinned]: 'crossed-swords',
  [CombatStateEnum.Pinning]: 'crossed-swords',
  [CombatStateEnum.Fleeing]: 'x-mark',
  [CombatStateEnum.Recharging]: 'arrow-flights',
  [CombatStateEnum.RechargingFailed]: 'broken-shield',
  [CombatStateEnum.Retreated]: 'player-dodge',
};
