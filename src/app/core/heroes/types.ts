import { GameObject } from '../game-objects';
import { ItemBaseModel, ItemObject } from '../items';
import { InventoryItems } from '../items/inventory';
import { Modifiers } from '../modifiers';
import { ResourcesModel } from '../resources';
import { Spell, SpellBaseType } from '../spells';
import { DescriptionElement } from '../ui';
import { GenerationModel } from '../unit-types';

export interface HeroBaseStats {
  stats: {
    mana: number;
    baseAttack: number;
    baseDefence: number;
  };
  abilities: SpellBaseType[];
  generalDescription: DescriptionElement;
  resources: ResourcesModel;
  items: ItemBaseModel[];
  army: GenerationModel[];
}

/* Base type for a hero */
export interface HeroBase {
  name: string;
  generalDescription: DescriptionElement;
  initialState: {
    stats: {
      mana: number;
      baseAttack: number;
      baseDefence: number;
    },
    abilities: SpellBaseType[],
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
  baseDefence: number;
  bonusDefence: number;
}

export interface HeroCreationParams {
  heroBase: HeroBase;
}

export class Hero extends GameObject<HeroCreationParams> {
  public static readonly categoryId: string = 'hero';
  public name!: string | null;
  public experience: number = 0;
  public level: number = 1;
  public freeSkillpoints: number = 0;
  public stats!: HeroStats;
  public spells: Spell[] = [];
  public mods: Modifiers[] = [];
  public items: ItemObject[] = [];
  public base!: HeroBase;
  public inventory: InventoryItems = new InventoryItems();

  create({ heroBase }: HeroCreationParams): void {
    this.base = heroBase;
    this.name = heroBase.name;

    const heroInitState = heroBase.initialState;

    const heroBaseStats = heroBase.initialState.stats;

    this.stats = {
      baseAttack: heroBaseStats.baseAttack,
      bonusAttack: 0,
      baseDefence: heroBaseStats.baseDefence,
      bonusDefence: 0,
      currentMana: heroBaseStats.mana,
      maxMana: heroBaseStats.mana,
    };

    this.spells = heroInitState.abilities.map(spell => this.getApi().spells.createSpellInstance(spell));
  }

}
