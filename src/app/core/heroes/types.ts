import { ItemBaseModel, ItemInstanceModel } from '../items/types';
import { ResourcesModel } from '../resources/types';
import { SpellModel, SpellInstance } from '../spells';
import { Modifiers } from '../unit-types/modifiers';
import { GenerationModel } from '../unit-types/utils';


export interface HeroInstanceStats {
  maxMana: number;
  currentMana: number;
  /* these ones can be just for UI, but mods will be used in calcs */
  baseAttack: number;
  bonusAttack: number;
}

export interface HeroModelStats {
  stats: {
      mana: number;
      baseAttack: number;
  };
  abilities: SpellModel[];
  resources: ResourcesModel;
  items: ItemBaseModel[];
  army: GenerationModel[];
}

export interface HeroModel {
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

/* Hero model, instance more likely */

export interface HeroInstanceModel {
  name: string | null;
  experience: number;
  level: number;
  freeSkillpoints: number;
  stats: HeroInstanceStats;
  // abilities?: AbilityTypeModel[];
  spells: SpellInstance[];
  mods: Modifiers[];
  items: ItemInstanceModel[];
  base: HeroModel;
}
