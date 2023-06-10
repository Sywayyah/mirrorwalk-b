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
  /* base defence of this unit type, each 15 poins of defense increase EHP by 100% */
  /* maybe defence types can be different, although I don't really think I want to have
      paper-rock-scissors here  */
  defence: number;

  /* Similar to Homm3 system, where each point of difference between attack/defence increases damage by 5 percent */
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
  /* create a separate mapping, table UnitGroup->Abilities */
  /*  Associative tables.. can be useful. Don't need to overgrow the model */
  // baseAbilities?: AbilityModel[];

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

// export interface UnitGroupInstModel extends UnitGroupModel {
//   ownerPlayerRef: PlayerInstanceModel;

//   spells: SpellInstance[];

//   // Think, what it needs to be? should it be refs
//   // And should all applied mods be stored here? feels like rather not...
//   modifiers: Modifiers[];
// }

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

  /* not sure if this should be in this model, tbd later */
  public fightInfo!: {
    initialCount: number;
    isAlive: boolean;
    spellsOnCooldown?: boolean;
  };
  // ownerPlayerRef: PlayerInstanceModel;

  public spells!: Spell[];

  // Think, what it needs to be? should it be refs
  // And should all applied mods be stored here? feels like rather not... or maybe yes.
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
