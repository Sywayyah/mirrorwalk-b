import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Entity, EntityId, UnitTypeId } from '../entities';
import { GroupSpellsChanged } from '../events';
import type { Faction } from '../factions/types';
import { GameObject } from '../game-objects';
import { Hero } from '../heroes';
import { ModsRef, ModsRefsGroup, Specialties } from '../modifiers';
import { Modifiers } from '../modifiers/modifiers';
import type { Player } from '../players';
import { ResourcesModel } from '../resources';
import { Spell, SpellBaseType } from '../spells';
import { DescriptionElement } from '../ui';
import { CommonUtils } from '../utils';
import { complete } from '../utils/observables';

type RequirementModel = Partial<ResourcesModel>;

enum UnitDamageTypesEnum {
  Physical,
}

interface UnitDamageModel {
  minDamage: number;
  maxDamage: number;
  type?: UnitDamageTypesEnum;
}

export interface UnitTypeBaseStatsModel {
  /* base health of single unit of this type */
  health: number;
  /* base speed of this unit type. speed defines how early in the battle order can be placed */
  speed: number;

  /**
   * Similar to Homm3 system.
   *  When attacking, your attack is checked against enemy defence.
   *  If attack is higher than defence, damage is increased by 5% per each point of difference.
   *  If lower, damage is decreased by 3% percent of difference.
   */
  defence: number;

  attackRating: number;

  damageInfo: UnitDamageModel;
}

export interface UnitDescriptionParams {
  unitBase: UnitBaseType;
  unit: UnitGroup;
}

export interface UnitDescriptions {
  descriptions: DescriptionElement[];
}

export interface UnitBaseType extends Entity {
  id: UnitTypeId;

  faction: Faction;
  /* displayed name */
  name: string;
  // todo: practically, here I can configure how names can be displayed in different places
  //  also specifying font size, short name versions, etc.
  /* main portrait for this unit (used during combat, hiring and so on) */
  mainPortraitUrl?: string;

  level: number;

  baseStats: UnitTypeBaseStatsModel;

  getDescription?: (params: UnitDescriptionParams) => UnitDescriptions,

  /* what does this unit type requires */
  baseRequirements: RequirementModel;

  /* base reward from neutral camps */
  neutralReward: {
    gold: number;
    experience: number;
  };

  defaultModifiers?: Modifiers;

  defaultSpells?: SpellBaseType<any>[];
  // spells?: EntityId[];

  /* minimal amount of units that can stack can be hired, sold or split by */
  minQuantityPerStack?: number;

  /* How many attacks unit can make by default, if not specified - 1 */
  defaultTurnsPerRound?: number;

  upgraded?: boolean;

  upgradeDetails?: {
    target: EntityId,
    upgradeCost: Partial<ResourcesModel>,
  };

  getUnitTypeSpecialtyModifiers?(specialties: Specialties): Modifiers | null | undefined;
}

interface UnitCreationParams {
  count: number;
  unitBase: UnitBaseType;
  ownerHero?: Hero;
}

export enum UnitModGroups {
  /** Mods coming from player */
  HeroMods = 'hMods',

  /** Mods attached to particular unit during the battle */
  CombatMods = 'cMods',

  /** Mods gained from auras */
  AuraMods = 'aMods',

  /** Mods gained from specialties and conditional mods */
  SpecialtyAndConditionalMods = 'scMods',

  /** Mods coming from spells */
  SpellMods = 'sMods',
}

export interface UnitStatsInfo {
  baseAttack: number;
  bonusAttack: number;
  finalAttack: number;

  baseDefence: number;
  bonusDefence: number;
  finalDefence: number;

  defends?: boolean;

  baseSpeed: number;
  speedBonus: number;
  finalSpeed: number;

  fireResist: number;
  coldResist: number;
  lightningResist: number;
  poisonResist: number;

  totalHealth: number;
  totalMinDamage: number;
  totalMaxDamage: number;
  avgTotalDamage: number;

  position: number;
}

export class UnitGroup extends GameObject<UnitCreationParams> {
  public static readonly categoryId: string = 'unit-group';

  // todo: many properties can become getters

  private _count!: number;
  /* the last unit hp tail. */
  // todo: recheck how it works, maybe shouldn't be undefined anymore
  private _tailUnitHp?: number;

  public get count() {
    return this._count;
  }

  public get tailUnitHp() {
    return this._tailUnitHp;
  }

  public type!: UnitBaseType;
  private _ownerPlayer!: Player;
  private _ownerHero!: Hero;

  public get ownerHero(): Hero {
    return this._ownerHero;
  }

  public get ownerPlayer(): Player {
    return this._ownerPlayer;
  }

  /* how much turns left during round, not sure if it's best to have it there */
  public turnsLeft!: number;

  public fightInfo!: {
    initialCount: number;
    isAlive: boolean;
    spellsOnCooldown?: boolean;
  };

  public get spells(): Spell[] {
    return this._spells;
  }

  private _spells!: Spell[];

  // mods are going to be attached there
  public readonly modGroup: ModsRefsGroup = ModsRefsGroup.empty();

  // final stats used by the game
  private readonly unitStats$ = new BehaviorSubject<UnitStatsInfo>({
    baseAttack: 0,
    bonusAttack: 0,
    finalAttack: 0,

    baseDefence: 0,
    bonusDefence: 0,
    finalDefence: 0,

    defends: false,

    baseSpeed: 0,
    speedBonus: 0,
    finalSpeed: 0,

    fireResist: 0,
    coldResist: 0,
    lightningResist: 0,
    poisonResist: 0,

    totalHealth: 0,
    totalMinDamage: 0,
    totalMaxDamage: 0,
    avgTotalDamage: 0,

    position: 0,
  });

  private readonly destroyed$ = new Subject<void>();

  create({ count, unitBase, ownerHero }: UnitCreationParams): void {
    if (count <= 0 || !count) {
      console.warn(`Cannot create unit group with ${count} units. Setting count to 1.`, this);

      count = 1;
    }

    this.type = unitBase;

    // think about it later

    if (ownerHero) {
      this.assignOwnerHero(ownerHero);
      this.assignOwnerPlayer(ownerHero.ownerPlayer);
    }

    this.turnsLeft = unitBase.defaultTurnsPerRound || 1;
    this._tailUnitHp = unitBase.baseStats.health;

    if (this.type.defaultModifiers) {
      // think about it as well.
      // practically, refs on this group remain untouched, but need to keep it in mind
      this.modGroup.addModsRef(ModsRef.fromMods(this.type.defaultModifiers));
    }

    this.fightInfo = {
      initialCount: count,
      isAlive: true,
      spellsOnCooldown: false,
    };

    this.setUnitsCount(count);

    // Init unit mod groups
    this.modGroup.attachNamedParentGroup(UnitModGroups.CombatMods, ModsRefsGroup.empty());
    this.modGroup.attachNamedParentGroup(UnitModGroups.SpecialtyAndConditionalMods, ModsRefsGroup.empty());
    this.modGroup.attachNamedParentGroup(UnitModGroups.SpellMods, ModsRefsGroup.empty());

    // Init spells when all mod groups are ready
    this._spells = [];

    if (this.type.defaultSpells) {
      this.type.defaultSpells
        .map(spell => this.getApi().spells.createSpellInstance(spell))
        .forEach(spell => this.addSpell(spell));
    }

    this.setupStatsUpdating();
  }

  setPosition(pos: number): void {
    const stats = this.getStats();

    if (stats.position !== pos) {
      stats.position = pos;
      this.unitStats$.next(stats);
    }
  }

  assignOwnerHero(ownerHero: Hero): void {
    this._ownerHero = ownerHero;
    this._ownerPlayer = ownerHero.ownerPlayer;
    this.modGroup.detachNamedParentGroup(UnitModGroups.HeroMods);
    this.modGroup.attachNamedParentGroup(UnitModGroups.HeroMods, this._ownerHero.modGroup);
  }

  onDestroy(): void {
    complete(this.destroyed$);
    this.spells.forEach(spell => this.getApi().gameObjects.destroyObject(spell));
  }

  // can be more methods
  assignOwnerPlayer(player: Player): void {
    this._ownerPlayer = player;

    // think if I need to retach like that
  }

  addUnitsCount(addedCount: number): void {
    this.setUnitsCount(this._count + addedCount);
  }

  setUnitsCount(newCount: number): void {
    this._count = newCount >= 0 ? newCount : 0;
    this.recalcHealthBasedStats();
  }

  addTailUnitHp(addedTailHp: number): void {
    this.setTailUnitHp((this._tailUnitHp ?? 0) + addedTailHp);
  }

  setTailUnitHp(newTailUnitHp: number): void {
    this._tailUnitHp = newTailUnitHp;
    this.recalcHealthBasedStats();
  }

  listenStats(): Observable<UnitStatsInfo> {
    return this.unitStats$.pipe(takeUntil(this.destroyed$));
  }

  addSpell(spell: Spell): void {
    this._spells.push(spell);
    spell.setOwnerObjectId(this.id);
    spell.baseType.config.spellConfig.onAcquired?.({ spellInstance: spell, ownerUnit: this });
    this.getApi().events.dispatch(GroupSpellsChanged({ unitGroup: this }));
    // todo: initialize listeners
  }

  removeSpell(spell: Spell): void {
    CommonUtils.removeItem(this._spells, spell);
  }

  removeDefendingMod() {
    const combatMods = this.modGroup.getNamedGroup(UnitModGroups.CombatMods);

    if (!combatMods) {
      return;
    }

    const defendingMod = combatMods
      ?.getAllRefs()
      .find((modRef) => modRef.getModValue('defending'));

    if (defendingMod) {
      combatMods?.removeModsRef(defendingMod);
    }
  }


  getStats(): UnitStatsInfo {
    return this.unitStats$.getValue();
  }

  attachSpecialtyMods(specialtyMods: Modifiers): void {
    this.getSpecialtyAndConditionalModsGroup().addModsRef(ModsRef.fromMods(specialtyMods));
  }

  clearSpecialtyAndConditionalMods(): void {
    this.getSpecialtyAndConditionalModsGroup().clearOwnModRefs();
  }

  /**
   * Removes all mods gained during the battle. Should be called in the end of battle.
   * Mods attached by spells are going to be managed by spells.
   *
   * Mods that can be removed may have flag __dispellableOnDeath: true.
   */
  clearCombatMods(): void {
    this.modGroup.getNamedGroup(UnitModGroups.CombatMods)!.clearOwnModRefs();
  }

  addCombatMods(modifiers: Modifiers): void {
    this.modGroup.getNamedGroup(UnitModGroups.CombatMods)!.addModsRef(ModsRef.fromMods(modifiers));
  }

  removeCombatMods(modifiers: Modifiers): void {
    this.modGroup.getNamedGroup(UnitModGroups.CombatMods)!.removeRefByModInstance(modifiers);
  }

  addSpellMods(mods: Modifiers): void {
    this.modGroup.getNamedGroup(UnitModGroups.SpellMods)!.addModsRef(ModsRef.fromMods(mods));
  }

  removeSpellMods(mods: Modifiers): void {
    this.modGroup.getNamedGroup(UnitModGroups.SpellMods)!.removeRefByModInstance(mods);
  }

  private recalcHealthBasedStats(): void {
    const currentUnitStats = this.unitStats$.getValue();
    const baseStats = this.type.baseStats;
    const unitCount = this._count;

    currentUnitStats.totalHealth = baseStats.health * (unitCount - 1) + (this.tailUnitHp ?? 0);
    currentUnitStats.totalMinDamage = unitCount * baseStats.damageInfo.minDamage;
    currentUnitStats.totalMaxDamage = unitCount * baseStats.damageInfo.maxDamage;
    currentUnitStats.avgTotalDamage = (currentUnitStats.totalMinDamage + currentUnitStats.totalMaxDamage) / 2;

    this.unitStats$.next(currentUnitStats);
  }

  private getSpecialtyAndConditionalModsGroup(): ModsRefsGroup {
    return this.modGroup.getNamedGroup(UnitModGroups.SpecialtyAndConditionalMods)!;
  }

  private setupStatsUpdating(): void {
    this.modGroup.onValueChanges().pipe(takeUntil(this.destroyed$)).subscribe((mods) => {
      const baseStats = this.type.baseStats;
      // review later
      const heroBaseStats = this.ownerPlayer?.hero.base.initialState.stats;

      const baseAttack = baseStats.attackRating;
      const bonusAttack = (mods.heroBonusAttack || 0) + (heroBaseStats?.baseAttack || 0);

      const baseDefence = baseStats.defence;
      const bonusDefence = (mods.heroBonusDefence || 0) + (heroBaseStats?.baseDefence || 0);

      let baseSpeed = baseStats.speed;
      let speedBonus = mods.unitGroupSpeedBonus || 0;

      if (speedBonus < 0 && mods.cannotBeSlowed) {
        speedBonus = 0;
      }

      if (mods.fixedSpeed) {
        speedBonus = 0;
        baseSpeed = mods.fixedSpeed || 5;
      }

      const allResist = mods.resistAll || 0;

      const previousStats = this.unitStats$.getValue();

      const stats: UnitStatsInfo = {
        baseAttack,
        bonusAttack,
        finalAttack: baseAttack + bonusAttack,

        defends: mods.defending,

        baseDefence,
        bonusDefence,
        finalDefence: baseDefence + bonusDefence,

        baseSpeed,
        speedBonus,
        finalSpeed: baseSpeed + speedBonus,

        fireResist: (mods.resistFire || 0) + allResist,
        coldResist: (mods.resistCold || 0) + allResist,
        lightningResist: (mods.resistLightning || 0) + allResist,
        poisonResist: (mods.resistPoison || 0) + allResist,

        totalHealth: previousStats.totalHealth,
        totalMinDamage: previousStats.totalMinDamage,
        totalMaxDamage: previousStats.totalMaxDamage,
        avgTotalDamage: previousStats.avgTotalDamage,
        position: previousStats.position,
      };

      this.unitStats$.next(stats);
    });
  }
}
