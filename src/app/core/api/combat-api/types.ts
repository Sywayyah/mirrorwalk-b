import { Modifiers } from '../../modifiers';
import { Player } from '../../players';
import { DefaultSpellStateType, Spell } from '../../spells';
import { UnitBaseType, UnitGroup } from '../../unit-types';
import { SpellsApi } from '../game-api';

export interface PostDamageInfo {
  unitLoss: number;
  finalDamage: number;
  initialUnitCount: number;
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
  summonUnitsForPlayer(ownerPlayer: Player, unitType: UnitBaseType, unitNumber: number): UnitGroup;

  dealDamageTo: (
    target: UnitGroup,
    damage: number,
    damageType: DamageType,
    postActionFn?: (actionInfo: PostDamageInfo) => void,
  ) => void;

  // adds spell instance to specific unit group.
  addSpellToUnitGroup: <T = DefaultSpellStateType>(
    target: UnitGroup,
    spell: Spell<T>,
    ownerPlayer: Player,
  ) => void;

  // Removes spell instance from the target unit group and from battle events system.
  removeSpellFromUnitGroup: <T = DefaultSpellStateType>(
    target: UnitGroup,
    spell: Spell<T>,
  ) => void;

  getUnitGroupsOfPlayer: (player: Player) => UnitGroup[];

  getAliveUnitGroupsOfPlayer: (player: Player) => UnitGroup[];

  getRandomEnemyPlayerGroup: () => UnitGroup;

  getEnemyOfPlayer: (player: Player) => Player;

  historyLog: (plainMsg: string) => void;

  createModifiers: (modifiers: Modifiers) => Modifiers;

  addModifiersToUnitGroup: (target: UnitGroup, modifiers: Modifiers) => void;

  removeModifiresFromUnitGroup: (target: UnitGroup, modifiers: Modifiers) => void;

  healUnit: (unit: UnitGroup, healValue: number) => HealingInfo;
}
