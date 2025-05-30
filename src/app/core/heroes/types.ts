import { Signal } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Entity, HeroId, ItemId, resolveEntity, SpellId, UnitTypeId } from '../entities';
import { HeroLevelsUp, UnitGroupAddedToHero, UnitGroupRemovedFromHero } from '../events';
import { GameObject } from '../game-objects';
import { Item } from '../items';
import { InventoryItems } from '../items/inventory';
import { filterSpecialties, Modifiers, ModsRef, ModsRefsGroup, Specialties } from '../modifiers';
import { Player } from '../players';
import { ResourcesModel } from '../resources';
import { Spell } from '../spells';
import { ReactiveState } from '../state';
import { DescriptionVariants } from '../ui';
import { ArmyGenerationModel, UnitGroup, UnitModGroups } from '../unit-types';
import { CommonUtils } from '../utils';
import { isNotNullish } from '../utils/common';
import { complete } from '../utils/observables';
import { HERO_LEVELS_BREAKPOINTS } from './levels';

export interface HeroBaseStats {
  stats: {
    mana: number;
    baseAttack: number;
    baseDefence: number;
  };
  abilities: SpellId[];
  generalDescription: DescriptionVariants['variants'];
  image?: string;
  resources: ResourcesModel;
  items: ItemId[];
  army: ArmyGenerationModel[];
  defaultModifiers?: Modifiers;
}

/* Base type for a hero */
export interface HeroBase extends Entity {
  id: HeroId;

  name: string;
  generalDescription: DescriptionVariants['variants'];
  initialState: {
    stats: {
      mana: number;
      baseAttack: number;
      baseDefence: number;
    };
    abilities: SpellId[];
    resources: ResourcesModel;
    items: ItemId[];
    army: ArmyGenerationModel[];
    defaultModifiers?: Modifiers;
  };
  image: string;
}

// stats that are not the part of modifiers
export interface HeroStats {
  currentMana: number;
}

export interface HeroCreationParams {
  heroBase: HeroBase;
  unitGroups?: UnitGroup[];
  ownerPlayer?: Player;
}

export enum HeroMods {
  /** Hero stats mods that remain unchanged */
  HeroStatMods = 'hsMods',
  /** Mods coming from items. */
  HeroItemMods = 'hiMods',
  /** Mods affecting all units of the player */
  CommonCombatMods = 'ccMods',
}

export interface HeroStatsInfo {
  baseAttack: number;
  bonusAttack: number;
  finalAttack: number;

  baseDefence: number;
  bonusDefence: number;
  finalDefence: number;

  fireResist: number;
  coldResist: number;
  lightningResist: number;
  poisonResist: number;

  currentMana: number;
  maxMana: number;
}

export interface UnitGroupSlot {
  unitGroup: null | UnitGroup;
  isReserve?: boolean;
}

export function swapUnitsInSlots(source: UnitGroupSlot, target: UnitGroupSlot): void {
  const temp = source.unitGroup;

  source.unitGroup = target.unitGroup;
  target.unitGroup = temp;
}

export function freeSlotsCount(slots: UnitGroupSlot[]): number {
  return slots.filter((slot) => !slot.unitGroup).length;
}

export class Hero extends GameObject<HeroCreationParams, HeroStatsInfo> {
  public static readonly categoryId: string = 'hero';
  public name!: string | null;
  public experience: number = 0;
  public level: number = 1;
  public freeSkillpoints: number = 0;
  public stats!: HeroStats;

  public spells: Spell[] = [];

  public readonly modGroup = ModsRefsGroup.empty();

  public readonly unitAurasModGroup = ModsRefsGroup.empty();

  public readonly specialtiesModGroup = ModsRefsGroup.empty();
  public readonly weeklyActivitiesModGroup = ModsRefsGroup.empty();

  /** All items that hero possesses (not all might be equiped) */
  public itemsBackpack: Item[] = [];

  public base!: HeroBase;
  public readonly inventory: InventoryItems = new InventoryItems();

  private _ownerPlayer!: Player;

  public get ownerPlayer(): Player {
    return this._ownerPlayer;
  }

  public get unitGroups() {
    return this._unitGroups;
  }

  private _unitGroups: UnitGroup[] = [];

  private readonly state = new ReactiveState<HeroStatsInfo>({
    baseAttack: 0,
    bonusAttack: 0,
    finalAttack: 0,

    baseDefence: 0,
    bonusDefence: 0,
    finalDefence: 0,

    fireResist: 0,
    coldResist: 0,
    lightningResist: 0,
    poisonResist: 0,

    currentMana: 0,
    maxMana: 0,
  });

  private readonly destroyed$ = new Subject<void>();

  readonly mainUnitSlots: UnitGroupSlot[] = [
    { unitGroup: null },
    { unitGroup: null },
    { unitGroup: null },
    { unitGroup: null },
  ];

  readonly reserveUnitSlots: UnitGroupSlot[] = [
    { unitGroup: null, isReserve: true },
    { unitGroup: null, isReserve: true },
  ];

  create({ heroBase, unitGroups, ownerPlayer }: HeroCreationParams): void {
    this.base = heroBase;
    this.name = heroBase.name;

    const heroBaseStats = heroBase.initialState.stats;

    if (ownerPlayer) {
      this._ownerPlayer = ownerPlayer;
    }

    this.stats = {
      currentMana: heroBaseStats.mana,
    };

    if (unitGroups) {
      this.setUnitGroups(unitGroups);
    }

    if (heroBase.initialState.defaultModifiers) {
      this.modGroup.addModsRef(ModsRef.fromMods(heroBase.initialState.defaultModifiers));
    }

    this.modGroup.attachNamedParentGroup(UnitModGroups.WeeklyMods, this.weeklyActivitiesModGroup);
  }

  public addExperience(experience: number, withBonus = false): void {
    if (experience <= 0) {
      return;
    }

    let exp = experience;

    if (withBonus) {
      exp = CommonUtils.increaseByPercent(
        experience,
        this.weeklyActivitiesModGroup.getCalcNumModValueOrZero('experienceGainBonus'),
      );
    }

    this.experience += exp;

    const currentXpToNextLevel = HERO_LEVELS_BREAKPOINTS[this.level + 1];

    // handle overstacked level
    if (currentXpToNextLevel <= this.experience) {
      this.level++;
      this.freeSkillpoints++;
      this.experience = this.experience - currentXpToNextLevel;

      // theoretically, overstacked skillpoints can be sent here
      this.getApi().events.dispatch(HeroLevelsUp({ newLevel: this.level, hero: this }));
    }
  }

  getState(): HeroStatsInfo {
    return this.getStats();
  }

  addReserveSlots(slotsCount: number) {
    for (let i = 0; i < slotsCount; i++) {
      this.reserveUnitSlots.push({ unitGroup: null, isReserve: true });
    }
  }

  hasFreeUnitSlots(): boolean {
    return this.hasFreeMainSlots() || this.hasFreeReserveSlots();
  }

  hasFreeMainSlots(): boolean {
    return this.getFreeMainSlotsCount() !== 0;
  }

  hasFreeReserveSlots(): boolean {
    return this.getFreeReserveSlotsCount() !== 0;
  }

  getFreeUnitSlotsCount(): number {
    return this.getFreeMainSlotsCount() + this.getFreeReserveSlotsCount();
  }

  getFreeMainSlotsCount(): number {
    return freeSlotsCount(this.mainUnitSlots);
  }

  getFreeReserveSlotsCount(): number {
    return freeSlotsCount(this.reserveUnitSlots);
  }

  getMainFilledUnitSlots(): UnitGroupSlot[] {
    return this.mainUnitSlots.filter((slot) => slot.unitGroup);
  }

  updateUnitGroupPositions(): void {
    this.getMainFilledUnitSlots().forEach((slot, i) => {
      slot?.unitGroup?.setPosition(i);
    });
  }

  getAllSlots(): UnitGroupSlot[] {
    return [...this.mainUnitSlots, ...this.reserveUnitSlots];
  }

  getAllUnitsFromSlots(): UnitGroup[] {
    return this.getAllSlots()
      .map((slot) => slot.unitGroup)
      .filter(isNotNullish);
  }

  setUnitGroups(unitGroups: UnitGroup[], updateSlots = true): void {
    this._unitGroups = unitGroups;

    this._unitGroups.forEach((unitGroup, i) => {
      if (updateSlots) {
        this.mainUnitSlots[i].unitGroup = unitGroup;
      }

      this.updateUnitGroup(unitGroup);
    });

    this.updateUnitGroupPositions();
  }

  addUnitGroup(unitGroup: UnitGroup): void {
    const wasIncluded = this.unitGroups.includes(unitGroup);

    this._unitGroups.push(unitGroup);
    this.updateUnitGroup(unitGroup);

    if (wasIncluded) {
      return;
    }

    const emptySlot = this.mainUnitSlots.find((slot) => !slot.unitGroup);

    if (emptySlot) {
      emptySlot.unitGroup = unitGroup;
      this.refreshUnitGroupsOrderBySlots();
      return;
    }

    const emptyReserveSlot = this.reserveUnitSlots.find((slot) => !slot.unitGroup);

    if (emptyReserveSlot) {
      emptyReserveSlot.unitGroup = unitGroup;
    }
    this.refreshUnitGroupsOrderBySlots();

    this.getApi().events.dispatch(UnitGroupAddedToHero({ hero: this, unitGroup }));
    this.updateUnitGroupPositions();
  }

  removeUnitGroup(unitGroup: UnitGroup): void {
    // todo: unassign hero
    CommonUtils.removeItem(this.unitGroups, unitGroup);

    this.getApi().events.dispatch(UnitGroupRemovedFromHero({ hero: this, unitGroup }));
    this.updateUnitGroupPositions();
  }

  refreshUnitGroupsOrderBySlots(): void {
    this._unitGroups = this.mainUnitSlots.map((slot) => slot.unitGroup).filter(Boolean) as UnitGroup[];
  }

  assignOwnerPlayer(player: Player): void {
    this._ownerPlayer = player;

    // init mods after player is known, so there is access to unit groups
    /* todo: theoretically, unit groups can be defined on hero level instead of player */
    const heroBase = this.base;
    const heroInitState = heroBase.initialState;

    this.spells = heroInitState.abilities.map((spell) =>
      this.getApi().spells.createSpellInstance(resolveEntity(spell)),
    );

    this.initParentModGroups();
    this.setupStatsUpdating(heroBase);
    this.updateUnitGroupPositions();
  }

  onDestroy(): void {
    complete(this.destroyed$);
  }

  getStats(): HeroStatsInfo {
    return this.state.get();
  }

  getStateSignal(): Signal<HeroStatsInfo> {
    return this.state.signal;
  }

  listenHeroStats(): Observable<HeroStatsInfo> {
    return this.state.observe().pipe(takeUntil(this.destroyed$));
  }

  /** Add item to backback */
  addItem(item: Item): void {
    this.itemsBackpack.push(item);
  }

  /** Removme item from backback and inventory (if equipped) */
  removeItem(item: Item): void {
    CommonUtils.removeItem(this.itemsBackpack, item);

    if (this.inventory.isItemEquipped(item)) {
      this.unequipItem(item);
    }
  }

  /** Equips item and gains bonuses */
  equipItem(item: Item): void {
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
        const spellInstance = this.getApi().spells.createSpellInstance(spellConfig.spell, {
          initialLevel: spellConfig.level,
        });

        spellInstance.setSourceGameObjectId(item.id);

        this.spells.push(spellInstance);
      });
    }
  }

  /** Item becomes unequiped, losing bonuses */
  unequipItem(item: Item): void {
    this.inventory.unequipItem(item);
    const itemModsGroup = this.getItemModsGroup();

    if (item.baseType.staticMods) {
      if (itemModsGroup) {
        // think about this workaround, should I always use modsRef instead of Modifiers?
        itemModsGroup.removeRefByModInstance(item.baseType.staticMods);
      }
    }

    // remove spells given by item
    this.spells = this.spells.filter((spell) => spell.sourceInfo.gameObjectId !== item.id);
  }

  addCommonCombatMods(mods: ModsRef): void {
    const commonCombatMods = this.modGroup.getNamedGroup(HeroMods.CommonCombatMods);
    commonCombatMods?.addModsRef(mods);
  }

  clearCommonCombatMods(): void {
    this.modGroup.getNamedGroup(HeroMods.CommonCombatMods)?.clearOwnModRefs();
  }

  updateUnitsSpecialtyAndConditionalMods(): void {
    this.unitGroups.forEach((unitGroup) => this.updateUnitSpecialtyAndConditionalMods(unitGroup));
  }

  updateUnitSpecialtyAndConditionalMods(unitGroup: UnitGroup): void {
    // todo: seems to work fine, but can be revisited later.
    // clearing old spec & conditional mods
    unitGroup.clearSpecialtyAndConditionalMods();

    // attaching conditional mods
    const conditionalMods = this.modGroup
      .getAllModValues('__unitConditionalMods')
      .map((unitConditMod) => unitConditMod(unitGroup))
      .filter(Boolean) as Modifiers[];

    // todo: theoretically, there can be some tool to merge mods.
    conditionalMods.forEach((mods) => unitGroup.attachSpecialtyMods(mods));

    // attaching specialty mods

    const specialtyMods = unitGroup.type.getUnitTypeSpecialtyModifiers?.(
      this.specialtiesModGroup.getMods() as Specialties,
    );

    if (specialtyMods) {
      unitGroup.attachSpecialtyMods(specialtyMods);
    }
  }

  addStatsMods(mods: Modifiers): void {
    this.modGroup.getNamedGroup(HeroMods.HeroStatMods)?.addModsRef(ModsRef.fromMods(mods));
  }

  addMana(mana: number) {
    this.stats.currentMana += mana;
    const maxMana = this.getStats().maxMana;

    if (this.stats.currentMana > maxMana) {
      this.stats.currentMana = maxMana;
    }

    this.state.patch({ currentMana: this.stats.currentMana });
  }

  private updateUnitGroup(unitGroup: UnitGroup): void {
    unitGroup.assignOwnerPlayer(this.ownerPlayer);
    unitGroup.assignOwnerHero(this);
    this.updateUnitSpecialtyAndConditionalMods(unitGroup);
  }

  private getItemModsGroup(): ModsRefsGroup | undefined {
    return this.modGroup.getNamedGroup(HeroMods.HeroItemMods);
  }

  private initParentModGroups(): void {
    this.modGroup.attachNamedParentGroup(HeroMods.HeroItemMods, ModsRefsGroup.empty());
    this.modGroup.attachNamedParentGroup(HeroMods.HeroStatMods, ModsRefsGroup.empty());
    this.modGroup.attachNamedParentGroup(HeroMods.CommonCombatMods, ModsRefsGroup.empty());
  }

  private setupStatsUpdating(heroBase: HeroBase): void {
    this.modGroup
      .onValueChanges()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((mods) => {
        this.specialtiesModGroup.clearOwnModRefs();
        this.specialtiesModGroup.addModsRef(ModsRef.fromMods(filterSpecialties(mods)));
        this.updateUnitsSpecialtyAndConditionalMods();

        const { baseAttack, baseDefence, mana } = heroBase.initialState.stats;

        const bonusAttack = mods.heroBonusAttack || 0;
        const bonusDefence = mods.heroBonusDefence || 0;

        const allResist = mods.resistAll || 0;

        const maxMana = (mods.heroMaxMana || 0) + mana;

        if (this.stats.currentMana > maxMana) {
          this.stats.currentMana = maxMana;
        }

        const heroStats: HeroStatsInfo = {
          baseAttack,
          bonusAttack,
          finalAttack: baseAttack + bonusAttack,

          baseDefence,
          bonusDefence,
          finalDefence: baseDefence + bonusDefence,

          fireResist: (mods.resistFire || 0) + allResist,
          coldResist: (mods.resistCold || 0) + allResist,
          lightningResist: (mods.resistLightning || 0) + allResist,
          poisonResist: (mods.resistPoison || 0) + allResist,

          currentMana: this.stats.currentMana,
          maxMana: maxMana,
        };

        this.state.set(heroStats);
      });
  }
}
