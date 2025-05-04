import { CombatActionsRef } from '../api/combat-api';
import { Icon } from '../assets';
import { Entity, ItemId } from '../entities';
import { GameObject } from '../game-objects';
import { Hero } from '../heroes';
import { Modifiers } from '../modifiers';
import { Player } from '../players';
import { Resources } from '../resources';
import { SpellBaseType } from '../spells';
import { DescriptionVariants } from '../ui';
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
  thisItem?: Item<T>;
  thisItemBase: ItemBaseModel<T>;
}

export interface ItemDescription {
  descriptions: DescriptionVariants['variants'][];
}

export interface ItemsEventsRef {
  on: (handlers: ItemsEventsHandlers) => void;
}

export type SpellWithConfig = {
  spell: SpellBaseType;
  level: number;
};

export type ItemAbilityDescriptionGetter<StateType extends object> = (
  itemData: ItemDescriptionData<StateType>,
) => ItemDescription;

export type ItemConfig<StateType extends object> = {
  init: (combatRefs: {
    actions: CombatActionsRef;
    events: ItemsEventsRef;
    ownerPlayer: Player;
    ownerHero: Hero;
    thisInstance: Item<StateType>;
  }) => void;
};

export interface ItemBaseModel<StateType extends object = object> extends Entity {
  id: ItemId;
  defaultState?: StateType;

  cost?: Resources;
  sellingCost?: Resources;
  slotType: ItemSlotType;
  name: string;
  icon: Icon;
  staticMods: Modifiers;
  /** Mods that will be applied on enemy units by default */
  staticEnemyMods?: Modifiers;

  /* There could be some requirements: */
  // requirements: ItemRequirementModel[],

  description: ItemAbilityDescriptionGetter<StateType>;
  config: ItemConfig<StateType>;
  bonusAbilities?: SpellWithConfig[];
}

export interface ItemCreationParams<T extends object = object> {
  itemBase: ItemBaseModel<T>;
  state?: T;
}

export class Item<T extends object = object> extends GameObject<ItemCreationParams<T>> {
  public static readonly categoryId: string = 'item';

  public baseType!: ItemBaseModel<T>;
  public state?: T;

  create(params: ItemCreationParams<T>): void {
    this.baseType = params.itemBase;
    this.state = params.state;
  }
}
