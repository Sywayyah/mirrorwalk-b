import type { Fraction } from '../fractions/types';
import type { Player } from '../players';
import { ResourcesModel } from '../resources';
import { Spell, SpellBaseType } from '../spells';
import { Modifiers } from '../modifiers/modifiers';
import { GameObject } from '../game-objects';

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

  // Should it be mod refs? or plain modifiers?
  public modifiers!: Modifiers[];

  create({ count, ownerPlayer, unitBase }: UnitCreationParams): void {
    if (count <= 0) {
      console.warn(`Cannot create unit group with ${count} units. Setting count to 1.`, this);

      count = 1;
    }

    this.count = count;
    this.type = unitBase;

    // think about it later
    if (ownerPlayer) {
      this.ownerPlayerRef = ownerPlayer;
    }

    this.turnsLeft = unitBase.defaultTurnsPerRound;

    this.fightInfo = {
      initialCount: count,
      isAlive: true,
      spellsOnCooldown: false,
    };
  }
}
