import { EventData } from 'src/app/store';
import { Player } from '../../players';
import { Resources, ResourceType } from '../../resources';
import { Spell, SpellBaseType } from '../../spells';
import { UnitBaseType, UnitGroup } from '../../unit-types';
import { SpellCreationOptions } from '../combat-api';

export interface PlayersApi {
  addManaToPlayer: (player: Player, mana: number) => void;
  addMaxManaToPlayer: (player: Player, plusToMaxMana: number) => void;

  addSpellToPlayerHero: (player: Player, spell: Spell) => void;

  getCurrentPlayer: () => Player;
  getCurrentPlayerUnitGroups: () => UnitGroup[];

  addUnitGroupToPlayer: (player: Player, unitType: UnitBaseType, count: number) => void;
  addExperienceToPlayer: (player: Player, xpAmount: number) => void;

  giveResourceToPlayer: (player: Player, type: ResourceType, amount: number) => void;
  giveResourcesToPlayer: (player: Player, resources: Resources) => void;
}

export interface SpellsApi {
  createSpellInstance: <T>(spell: SpellBaseType<T>, options?: SpellCreationOptions<T>) => Spell<T>;
}

export interface GlobalEventsApi {
  dispatch(event: EventData): void;
}
