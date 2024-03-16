import { EventData } from 'src/app/store';
import { UnitTypeId } from '../../entities';
import { Player } from '../../players';
import { Resources, ResourceType } from '../../resources';
import { Spell, SpellBaseType } from '../../spells';
import { UnitGroup } from '../../unit-types';
import { SpellCreationOptions } from '../combat-api';

export interface PlayersApi {
  addManaToPlayer: (player: Player, mana: number) => void;
  addMaxManaToPlayer: (player: Player, plusToMaxMana: number) => void;

  addSpellToPlayerHero: (player: Player, spell: Spell) => void;

  getCurrentPlayer: () => Player;
  getCurrentPlayerUnitGroups: () => UnitGroup[];

  addUnitGroupToPlayer: (player: Player, unitTypeId: UnitTypeId, count: number) => void;
  addExperienceToPlayer: (player: Player, xpAmount: number) => void;

  playerHasResources: (player: Player, resources: Resources) => boolean;
  giveResourceToPlayer: (player: Player, type: ResourceType, amount: number) => void;
  giveResourcesToPlayer: (player: Player, resources: Resources) => void;
  removeResourcesFromPlayer: (player: Player, resources: Resources) => void;
}

export interface SpellsApi {
  createSpellInstance: <T>(spell: SpellBaseType<T>, options?: SpellCreationOptions<T>) => Spell<T>;
}

export interface GlobalEventsApi {
  dispatch(event: EventData): void;
}
