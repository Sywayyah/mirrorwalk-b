import { Modifiers } from '../../modifiers';
import { PlayerInstanceModel } from '../../players';
import { DefaultSpellStateType, SpellInstance } from '../../spells';
import { UnitBase, UnitGroupInstModel } from '../../unit-types';
import { SpellsApi } from '../game-api';

export interface PostDamageInfo {
  unitLoss: number;
  finalDamage: number;
}

export enum DamageType {
  PhysicalAttack = 'physAttack',
  Physical = 'physical',
  Magic = 'magic',
}

export interface SpellCreationOptions<T = DefaultSpellStateType> {
  initialLevel?: number;
  state?: T;
}

export interface HealingInfo {
  revivedUnitsCount: number;
  totalHealedHp: number;
}

export interface CombatActionsRef extends SpellsApi {
  summonUnitsForPlayer(ownerPlayer: PlayerInstanceModel, unitType: UnitBase, unitNumber: number): UnitGroupInstModel;

  dealDamageTo: (
    target: UnitGroupInstModel,
    damage: number,
    damageType: DamageType,
    postActionFn?: (actionInfo: PostDamageInfo) => void,
  ) => void;

  // adds spell instance to specific unit group.
  addSpellToUnitGroup: <T = DefaultSpellStateType>(
    target: UnitGroupInstModel,
    spell: SpellInstance<T>,
    ownerPlayer: PlayerInstanceModel,
  ) => void;

  // Removes spell instance from the target unit group and from battle events system.
  removeSpellFromUnitGroup: <T = DefaultSpellStateType>(
    target: UnitGroupInstModel,
    spell: SpellInstance<T>,
  ) => void;

  getUnitGroupsOfPlayer: (player: PlayerInstanceModel) => UnitGroupInstModel[];

  getAliveUnitGroupsOfPlayer: (player: PlayerInstanceModel) => UnitGroupInstModel[];

  getRandomEnemyPlayerGroup: () => UnitGroupInstModel;

  getEnemyPlayer: () => PlayerInstanceModel;

  historyLog: (plainMsg: string) => void;

  createModifiers: (modifiers: Modifiers) => Modifiers;

  addModifiersToUnitGroup: (target: UnitGroupInstModel, modifiers: Modifiers) => void;

  removeModifiresFromUnitGroup: (target: UnitGroupInstModel, modifiers: Modifiers) => void;

  healUnit: (unit: UnitGroupInstModel, healValue: number) => HealingInfo;
}
