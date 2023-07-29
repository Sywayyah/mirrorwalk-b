import { GameObject } from '../game-objects';
import { Item, ItemBaseModel } from '../items';
import { InventoryItems } from '../items/inventory';
import { Modifiers, ModsRef, ModsRefsGroup } from '../modifiers';
import { ResourcesModel } from '../resources';
import { Spell, SpellBaseType } from '../spells';
import { DescriptionElement } from '../ui';
import { GenerationModel } from '../unit-types';
import { CommonUtils } from '../utils';

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

export enum HeroMods {
  /** Hero stats mods */
  HeroStatMods = 'hsMods',
  /** Mods coming from items. */
  HeroItemMods = 'hiMods',
  /** Mods affecting all units of the player */
  CommonCombatMods = 'ccMods',
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

  // Modifiers might come from hero himself, from bonuses,
  // from items.
  // do I need to transform unit stats into mods?
  // maybe not. maybe a unit can subscribe to parent groups and do next:
  // expose a new observable that is going to transform values in some way
  // and there will be 2 more methods: one that returns stream and another
  // that returns latest calculated value.
  public modifiers: ModsRefsGroup = ModsRefsGroup.empty();

  /** All items that hero possesses (not all might be equiped) */
  public itemsBackpack: Item[] = [];

  public base!: HeroBase;
  public inventory: InventoryItems = new InventoryItems();

  create({ heroBase }: HeroCreationParams): void {
    this.base = heroBase;
    this.name = heroBase.name;

    const heroInitState = heroBase.initialState;

    const heroBaseStats = heroBase.initialState.stats;

    // theoretically, it will get obsolete, or will change form somehow
    // or maybe not, if there will be a new calculation
    this.stats = {
      baseAttack: heroBaseStats.baseAttack,
      bonusAttack: 0,
      baseDefence: heroBaseStats.baseDefence,
      bonusDefence: 0,
      currentMana: heroBaseStats.mana,
      maxMana: heroBaseStats.mana,
    };

    this.spells = heroInitState.abilities.map(spell => this.getApi().spells.createSpellInstance(spell));

    // store it as field of Hero? or access it from group
    this.modifiers.attachNamedParentGroup(HeroMods.HeroItemMods, ModsRefsGroup.empty());
    this.modifiers.attachNamedParentGroup(HeroMods.HeroStatMods, ModsRefsGroup.empty());
    this.modifiers.attachNamedParentGroup(HeroMods.CommonCombatMods, ModsRefsGroup.empty());
  }

  /** Add item to backback */
  public addItem(item: Item): void {
    this.itemsBackpack.push(item);
  }

  /** Removme item from backback and inventory (if equipped) */
  public removeItem(item: Item): void {
    CommonUtils.removeItem(this.itemsBackpack, item);

    if (this.inventory.isItemEquipped(item)) {
      this.inventory.unequipItem(item);
    }
  }

  /** Equips item and gains bonuses */
  public equipItem(item: Item): void {
    this.inventory.equipItem(item);

    const itemModsGroup = this.getItemModsGroup();

    const itemBase = item.baseType;

    // add mods to itemModsGroup
    if (itemBase.staticMods) {
      const mods = ModsRef.fromMods(itemBase.staticMods);
      itemModsGroup?.addModsRef(mods);
    }

    // add spells given by item
    if (itemBase.bonusAbilities) {
      itemBase.bonusAbilities.forEach((spellConfig) => {
        const spellInstance = this.getApi().spells.createSpellInstance(
          spellConfig.spell,
          { initialLevel: spellConfig.level },
        );

        spellInstance.sourceInfo.gameObjectId = item.id;

        this.spells.push(spellInstance);
      });
    }
  }

  /** Item becomes unequiped, losing bonuses */
  public unequipItem(item: Item): void {
    CommonUtils.removeItem(this.itemsBackpack, item);
    this.inventory.unequipItem(item);
    const itemModsGroup = this.getItemModsGroup();

    if (item.baseType.staticMods) {
      if (itemModsGroup) {
        // think about this workaround, should I always use modsRef instead of Modifiers?
        itemModsGroup.removeRefByModInstance(item.baseType.staticMods);
      }
    }

    // remove spells given by item
    this.spells = this.spells.filter(spell => spell.sourceInfo.gameObjectId !== item.id);
  }

  clearCommonCombatMods(): void {
    this.modifiers.getNamedGroup(HeroMods.CommonCombatMods)?.clearOwnModRefs();
  }

  private getItemModsGroup(): ModsRefsGroup | undefined {
    return this.modifiers.getNamedGroup(HeroMods.HeroItemMods);
  }
}
