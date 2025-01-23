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

export type CombatStateVariant<
  T extends CombatStateEnum,
  V extends object = {},
> = { type: T } & V;

export type CombatState =
  | CombatStateVariant<CombatStateEnum.Initial>
  | CombatStateVariant<CombatStateEnum.Normal>
  | CombatStateVariant<CombatStateEnum.Defending>
  | CombatStateVariant<CombatStateEnum.Fleeing>
  | CombatStateVariant<CombatStateEnum.Recharging>
  | CombatStateVariant<CombatStateEnum.RechargingFailed>
  | CombatStateVariant<CombatStateEnum.Retreated>
  | CombatStateVariant<CombatStateEnum.Pinned, { pinnedBy: UnitGroup }>
  | CombatStateVariant<CombatStateEnum.Pinning, { pinning: UnitGroup }>;

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
