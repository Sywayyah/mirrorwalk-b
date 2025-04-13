import { UnitTypeId } from '../../entities';
import { Modifiers } from '../../modifiers';
import { Player } from '../../players';
import { DefaultSpellStateType, Spell } from '../../spells';
import { UnitGroup } from '../../unit-types';
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

  Fire = 'fire',
  Cold = 'cold',
  Poison = 'poison',
  Lightning = 'lightning',

  Astral = 'astral'
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
  getUnitsFromFightQueue(): UnitGroup[];

  /** If turns aren't specified, removes all turns left */
  removeTurnsFromUnitGroup(target: UnitGroup, turns?: number): void;

  addTurnsToUnitGroup(target: UnitGroup, turns: number): void;

  summonUnitsForPlayer(ownerPlayer: Player, unitTypeId: UnitTypeId, unitCount: number): UnitGroup;

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

  isEnemyUnitGroup: (unitGroup: UnitGroup) => boolean;

  getEnemyOfPlayer: (player: Player) => Player;

  historyLog: (plainMsg: string) => void;

  createModifiers: (modifiers: Modifiers) => Modifiers;

  addModifiersToUnitGroup: (target: UnitGroup, modifiers: Modifiers) => void;

  removeModifiresFromUnitGroup: (target: UnitGroup, modifiers: Modifiers) => void;

  healUnit: (unit: UnitGroup, healValue: number) => HealingInfo;

  getCurrentUnitGroup: () => UnitGroup;

  unitGroupAttack: (attacker: UnitGroup, attacked: UnitGroup) => void;
  // actions for pinning
  pinAttempt: (pinning: UnitGroup, pinned: UnitGroup) => void | {};
}
