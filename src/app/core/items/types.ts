
/*
    I'm uncertain of what items model should consist of.
    Because of that, I feel like I need arrays.

    Anyways, it's not thought through completely.
        It will most surely require implementing new systems.

    Especially for active abilities.

    Also probably need to figure out more clearly the
        stats of the units, and which systems I want to have
        for them

    Idea, Item: If army has unit of level 9, all gain bonus

    Important: I think, it makes more sense for now to make
        gameplay and main stats more interesting

*/

import { CombatActionsRef } from '../api/combat-api';
import { Icon } from '../assets';
import { Hero } from '../heroes';
import { PlayerInstanceModel } from '../players';
import { SpellModel } from '../spells';
import { Modifiers, UnitGroupModel } from '../unit-types';


export interface ItemRequirementModel<T extends object> {
  type: string;
  value?: number | string | boolean;
  isRequirementMet?: (item: ItemBaseModel<T>, unitGroup: UnitGroupModel) => boolean;
}

export enum GameEventTypes {
  NewRoundBegins,
}

export interface GameEventNewRoundBegins {
  round: number;
}

export interface GameEventsMapping {
  [GameEventTypes.NewRoundBegins]: GameEventNewRoundBegins;
}

export type GameEventsHandlers = { [K in keyof GameEventsMapping]?: (target: GameEventsMapping[K]) => void };

export interface GameEventsRef {
  on: (handlers: GameEventsHandlers) => void;
}


export enum ItemType {
  Weapon = 'Weapon',
  Headgear = 'Headgear',
  Armor = 'Armor',
  Boots = 'Boots',
  Shield = 'Shield',
}

export interface ItemBaseModel<StateType extends object = object> {
  defaultState?: StateType;

  type: ItemType;
  name: string;
  icon: Icon;
  staticMods: Modifiers;
  /* Item can have reqs I think */
  // requirements: ItemRequirementModel[],
  /* As well as modifiers */
  // modifiers: ItemStatsModel[];
  /* And description can be built like this */
  // description: (item: ItemModel) => object[];
  /* Description can indeed return an array of objects, as for spells, but for now.. keep it simple */
  description: (item: ItemBaseModel<StateType>) => string;
  config: {
    init: (combatRefs: {
      actions: CombatActionsRef,
      events: GameEventsRef,
      ownerPlayer: PlayerInstanceModel,
      ownerHero: Hero,
      thisInstance: ItemInstanceModel<StateType>,
    }) => void,
  },
  /* todo: Spells by items can also have a separate coolrown queue */
  bonusAbilities?: { spell: SpellModel, level: number }[];
  /* Item class? */
  /* Active abilities? This will require an entire system */
}

export interface ItemInstanceModel<T extends object = object> {
  currentDescription: string; // string for now
  baseType: ItemBaseModel<T>;
  state: T;
}
