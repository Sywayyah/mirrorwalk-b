import { ItemBaseModel, ItemInstanceModel } from '../items';
import type { InventoryItems } from '../items/inventory';
import { ResourcesModel } from '../resources';
import { SpellInstance, SpellModel } from '../spells';
import { GenerationModel, Modifiers } from '../unit-types';

export interface HeroBaseStats {
  stats: {
    mana: number;
    baseAttack: number;
  };
  abilities: SpellModel[];
  resources: ResourcesModel;
  items: ItemBaseModel[];
  army: GenerationModel[];
}

/* Base type for a hero */
export interface HeroBase {
  name: string;
  initialState: {
    stats: {
      mana: number;
      baseAttack: number;
    },
    abilities: SpellModel[],
    resources: ResourcesModel,
    items: ItemBaseModel[],
    army: GenerationModel[],
  };
}

export interface HeroStats {
  maxMana: number;
  currentMana: number;
  /* these ones can be just for UI, but mods will be used in calcs */
  baseAttack: number;
  bonusAttack: number;
}

/* Hero based on some type */
export interface Hero {
  name: string | null;
  experience: number;
  level: number;
  freeSkillpoints: number;
  stats: HeroStats;
  spells: SpellInstance[];
  mods: Modifiers[];
  items: ItemInstanceModel[];
  base: HeroBase;
  inventory: InventoryItems;
}
