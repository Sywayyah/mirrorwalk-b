import { PlayerInstanceModel } from '../../players';
import { SpellInstance, SpellModel } from '../../spells';
import { UnitGroupInstModel, UnitBase } from '../../unit-types';
import { SpellCreationOptions } from '../combat-api';

export interface PlayersApi {
  addManaToPlayer: (player: PlayerInstanceModel, mana: number) => void;
  addMaxManaToPlayer: (player: PlayerInstanceModel, plusToMaxMana: number) => void;

  addSpellToPlayerHero: (player: PlayerInstanceModel, spell: SpellInstance) => void;

  getCurrentPlayer: () => PlayerInstanceModel;
  getCurrentPlayerUnitGroups: () => UnitGroupInstModel[];

  addUnitGroupToPlayer: (player: PlayerInstanceModel, unitType: UnitBase, count: number) => void;
  addExperienceToPlayer: (player: PlayerInstanceModel, xpAmount: number) => void;
}

export interface SpellsApi {
  createSpellInstance: <T>(spell: SpellModel<T>, options?: SpellCreationOptions<T>) => SpellInstance<T>;
}
