import { PlayersApi, SpellsApi } from '../api/game-api';
import { GameObject } from '../game-objects';
import { ItemBaseModel } from '../items';
import { Player } from '../players';
import { ResourceType } from '../resources';
import { GenerationModel, UnitBaseType, UnitGroup } from '../unit-types';

/**
 * Todo: rethink stuctures.
 *  - rethink the model and system (it might get simplified)
 *  - rethink relation between view model and structures model
 *     Maybe structure is just a base type for view location?
 *     In the end, most of the things might get moved to locations.
 *      Structures will become just a base type.
*/

/* Base descriptive type */
/* Refactor these types */

export enum StuctureControl {
  Neutral = 'neutral',
  EnemyPlayer = 'enemy',
}

interface OnVisitedParams {
  playersApi: PlayersApi;
  spellsApi: SpellsApi,
  visitingPlayer: Player;
}

export interface StructureGeneratorModel {
  name: string;
  icon?: string;
  control: StuctureControl;
  description?: string,
  /* looks good. it can be impossible to describe all possible logic data-driven,
      it's better to have it like fn, which decides on it's own

      although, think about it later.
   */

  /* to generate neutral camp structure */
  generateGuard?: () => GenerationModel;

  /* todo: Array of rewards? */
  generateReward?: () => NeutralRewardModel;

  onVisited?: (params: OnVisitedParams) => void;
}

/* NOTE: all that is next - it looks more like instance */

/* Rewarding resources models */
export interface ResourceRewardModel {
  type: ResourceType;
  count: number;
}

export interface HiringRewardModel {
  unitType: UnitBaseType;
  maxCount: number;
}

/* Kinds of location structures */
/*  this will require some later thinking */
export enum StructureTypeEnum {
  /* Mostly, for locations with guards+rewards */
  NeutralCamp = 'neutral-camp',
  /* Mostly,for locations without guards, and which uses game api */
  NeutralSite = 'neutral-site',
}

export interface StructureCreationModel<T extends StructureTypeEnum = StructureTypeEnum> {
  generator: StructureGeneratorModel;
  guardingPlayer?: Player;
  type: T;
}

export class StructureModel<T extends StructureTypeEnum = StructureTypeEnum> extends GameObject<StructureCreationModel> {
  public static readonly categoryId: string = 'struct';

  public type!: T;
  public generator!: StructureGeneratorModel;
  public isInactive?: boolean;
  public isCompleted?: boolean;
  public guard?: Player;
  public reward?: NeutralRewardModel;

  create({ generator, type, guardingPlayer }: StructureCreationModel<T>): void {
    this.generator = generator;
    this.type = type;
    this.guard = guardingPlayer;

    if (generator.generateReward) {
      this.reward = generator.generateReward();
    }
  }
}

/* Neutral structures */
export enum NeutralRewardTypesEnum {
  SingleResource = 'resource',
  Resources = 'resources',
  Item = 'item',
  UnitsHire = 'hire',
  Mines = 'mines',
  UnitsUpgrade = 'upgrading',
  Scripted = 'scripted',

  NoReward = 'no-reward',
}

export interface NeutralRewardModel<T extends NeutralRewardTypesEnum = NeutralRewardTypesEnum> {
  type: T;
}

/* Resources Reward */
export interface ResourcesReward extends NeutralRewardModel<NeutralRewardTypesEnum.Resources> {
  resourceGroups: ResourceRewardModel[][];
}


/* Hiring Reward */
export interface HiringReward extends NeutralRewardModel<NeutralRewardTypesEnum.UnitsHire> {
  units: HiringRewardModel[];
}

/* Item Reward */
export interface ItemReward extends NeutralRewardModel<NeutralRewardTypesEnum.Item> {
  itemGroups: ItemBaseModel[][];
}

/* Unit ungrade reward */
export interface UnitUpgradeReward extends NeutralRewardModel<NeutralRewardTypesEnum.UnitsUpgrade> {
  getUnits: (api: PlayersApi) => UnitGroup[];
}

/* Reward defined by script */
export interface ScriptedReward extends NeutralRewardModel<NeutralRewardTypesEnum.Scripted> {
  description: string;
  onAccept: (apiRefs: OnVisitedParams) => void,
}

export interface NoReward extends NeutralRewardModel<NeutralRewardTypesEnum.NoReward> {
}
