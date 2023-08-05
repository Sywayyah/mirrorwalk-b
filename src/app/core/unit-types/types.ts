import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import type { Fraction } from '../fractions/types';
import { GameObject } from '../game-objects';
import { ModsRef, ModsRefsGroup } from '../modifiers';
import { Modifiers } from '../modifiers/modifiers';
import type { Player } from '../players';
import { ResourcesModel } from '../resources';
import { Spell, SpellBaseType } from '../spells';
import { DescriptionElement } from '../ui';
import { complete } from '../utils/observables';

interface RequirementModel extends Partial<ResourcesModel> {
  /* heroLevel?: number;
  gold?: number;
  redCrystals?: number;
  glory?: number;
  gems?: number; */
}

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

export interface UnitBaseType {
  type: string;

  fraction: Fraction<any>;
  /* displayed name */
  name: string;
  /* main portrait for this unit (used during combat, hiring and so on) */
  mainPortraitUrl?: string;

  level: number;

  baseStats: UnitTypeBaseStatsModel;

  getDescription?: (params: { unitBase: UnitBaseType, unit: UnitGroup }) => { descriptions: DescriptionElement[] },

  /* what does this unit type requires */
  baseRequirements: RequirementModel;

  /* base reward from neutral camps */
  neutralReward: {
    gold: number;
    experience: number;
  };

  defaultModifiers?: Modifiers;

  defaultSpells?: SpellBaseType[];

  /* minimal amount of units that can stack can be hired, sold or split by */
  minQuantityPerStack: number;

  /* How many attacks unit can make by default */
  defaultTurnsPerRound: number;

  upgraded?: boolean;

  upgradeDetails?: {
    target: UnitBaseType,
    upgradeCost: Partial<ResourcesModel>,
  };
}

interface UnitCreationParams {
  count: number;
  unitBase: UnitBaseType;
  ownerPlayer?: Player;
}

export enum UnitModGroups {
  /** Mods coming from player */
  PlayerMods = 'pMods',

  /** Mods attached to particular unit during the battle */
  CombatMods = 'cMods',
}

export interface UnitStatsInfo {
  baseAttack: number;
  bonusAttack: number;
  finalAttack: number;

  baseDefence: number;
  bonusDefence: number;
  finalDefence: number;

  baseSpeed: number;
  speedBonus: number;
  finalSpeed: number;
}

export class UnitGroup extends GameObject<UnitCreationParams> {
  public static readonly categoryId: string = 'unit-group';

  public count!: number;
  public type!: UnitBaseType;
  public ownerPlayerRef!: Player;

  /* how much turns left during round, not sure if it's best to have it there */
  public turnsLeft!: number;

  /* the last unit hp tail. If undefined, the tail unit hp is full */
  public tailUnitHp?: number;

  public fightInfo!: {
    initialCount: number;
    isAlive: boolean;
    spellsOnCooldown?: boolean;
  };

  public spells!: Spell[];

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

    baseSpeed: 0,
    speedBonus: 0,
    finalSpeed: 0,
  });

  private readonly destroyed$ = new Subject<void>();

  create({ count, ownerPlayer, unitBase }: UnitCreationParams): void {
    if (count <= 0 || !count) {
      console.warn(`Cannot create unit group with ${count} units. Setting count to 1.`, this);

      count = 1;
    }

    this.count = count;
    this.type = unitBase;

    // think about it later
    if (ownerPlayer) {
      this.assignOwnerPlayer(ownerPlayer);
    }

    this.turnsLeft = unitBase.defaultTurnsPerRound;

    if (this.type.defaultModifiers) {
      // think about it as well.
      this.modGroup.addModsRef(ModsRef.fromMods(this.type.defaultModifiers));
    }

    this.fightInfo = {
      initialCount: count,
      isAlive: true,
      spellsOnCooldown: false,
    };

    if (this.type.defaultSpells) {
      this.spells = this.type.defaultSpells.map(spell => this.getApi().spells.createSpellInstance(spell));
    } else {
      this.spells = [];
    }

    this.modGroup.attachNamedParentGroup(UnitModGroups.CombatMods, ModsRefsGroup.empty());

    this.modGroup.onValueChanges().pipe(takeUntil(this.destroyed$)).subscribe((mods) => {
      const baseStats = this.type.baseStats;

      const baseAttack = baseStats.attackRating;
      const bonusAttack = mods.playerBonusAttack || 0;

      const baseDefence = baseStats.defence;
      const bonusDefence = mods.playerBonusDefence || 0;

      const baseSpeed = baseStats.speed;
      const speedBonus = mods.unitGroupSpeedBonus || 0;

      const stats = {
        baseAttack,
        bonusAttack,
        finalAttack: bonusAttack + baseAttack,

        baseDefence,
        bonusDefence,
        finalDefence: baseDefence + bonusDefence,

        baseSpeed,
        speedBonus,
        finalSpeed: baseSpeed + speedBonus,
      };

      this.unitStats$.next(stats);
    });
  }

  onDestroy(): void {
    complete(this.destroyed$);
  }

  // can be more methods
  assignOwnerPlayer(player: Player): void {
    this.ownerPlayerRef = player;

    // think if I need to retach like that
    this.modGroup.detachNamedParentGroup(UnitModGroups.PlayerMods);
    this.modGroup.attachNamedParentGroup(UnitModGroups.PlayerMods, player.hero.modGroup);
  }

  listenStats(): Observable<UnitStatsInfo> {
    return this.unitStats$.pipe(takeUntil(this.destroyed$));
  }

  getStats(): UnitStatsInfo {
    return this.unitStats$.getValue();
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
}
