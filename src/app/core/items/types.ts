import { CombatActionsRef } from '../api/combat-api';
import { Icon } from '../assets';
import { GameObject } from '../game-objects';
import { Hero } from '../heroes';
import { Modifiers } from '../modifiers';
import { Player } from '../players';
import { SpellBaseType } from '../spells';
import { DescriptionElement } from '../ui';
import { UnitGroup } from '../unit-types';
import { ItemsEventsHandlers } from './item-events';


export interface ItemRequirementModel<T extends object> {
  type: string;
  value?: number | string | boolean;
  isRequirementMet?: (item: ItemBaseModel<T>, unitGroup: UnitGroup) => boolean;
}


export enum ItemSlotType {
  Weapon = 'Weapon',
  Headgear = 'Headgear',
  Amulet = 'Amulet',
  Armor = 'Armor',
  Boots = 'Boots',
  Shield = 'Shield',
}

export interface ItemDescriptionData<T extends object> {
  thisItem: ItemObject<T>;
}

export interface ItemDescription {
  descriptions: DescriptionElement[];
}

export interface ItemsEventsRef {
  on: (handlers: ItemsEventsHandlers) => void;
}

export interface ItemBaseModel<StateType extends object = object> {
  defaultState?: StateType;

  slotType: ItemSlotType;
  name: string;
  icon: Icon;
  staticMods: Modifiers;

  /* There could be some requirements: */
  // requirements: ItemRequirementModel[],

  description: (itemData: ItemDescriptionData<StateType>) => ItemDescription;
  config: {
    init: (combatRefs: {
      actions: CombatActionsRef,
      events: ItemsEventsRef,
      ownerPlayer: Player,
      ownerHero: Hero,
      thisInstance: ItemObject<StateType>,
    }) => void,
  },
  bonusAbilities?: { spell: SpellBaseType, level: number }[];
}

export interface ItemCreationParams<T extends object = object> {
  itemBase: ItemBaseModel<T>;
  state?: T;
}

export class ItemObject<T extends object = object> extends GameObject<ItemCreationParams<T>> {
  public static readonly categoryId: string = 'item';

  public baseType!: ItemBaseModel<T>;
  public state?: T;

  create(params: ItemCreationParams<T>): void {
    this.baseType = params.itemBase;
    this.state = params.state;
  }
}
