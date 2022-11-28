import { PlayerInstanceModel } from '../../players';
import { DefaultSpellStateType, SpellInstance } from '../../spells';
import { Modifiers, UnitGroupInstModel } from '../../unit-types';
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

export interface CombatActionsRef extends SpellsApi {
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

  getRandomEnemyPlayerGroup: () => UnitGroupInstModel;

  getEnemyPlayer: () => PlayerInstanceModel;

  historyLog: (plainMsg: string) => void;

  createModifiers: (modifiers: Modifiers) => Modifiers;

  addModifiersToUnitGroup: (target: UnitGroupInstModel, modifiers: Modifiers) => void;

  removeModifiresFromUnitGroup: (target: UnitGroupInstModel, modifiers: Modifiers) => void;

  healUnit: (unit: UnitGroupInstModel, healValue: number) => void;
}
