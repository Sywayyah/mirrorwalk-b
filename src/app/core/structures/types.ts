import { PlayersApi, SpellsApi } from '../api/game-api';
import { ItemBaseModel } from '../items';
import { Player } from '../players';
import { ResourceType } from '../resources';
import { GenerationModel, UnitBaseType, UnitGroup } from '../unit-types';

export enum StuctureControl {
  Neutral = 'neutral',
  EnemyPlayer = 'enemy',
}

interface OnVisitedParams {
  playersApi: PlayersApi;
  spellsApi: SpellsApi,
  visitingPlayer: Player;
}

/* This base type for structures will be expanded and, most likely, will have an access to events and API. */
export interface StructureGeneratorModel {
  name: string;
  icon?: string;
  control: StuctureControl;
  description?: string,

  generateGuard?: () => GenerationModel;

  /* todo: Array of rewards? */
  generateReward?: () => NeutralRewardModel;

  onVisited?: (params: OnVisitedParams) => void;
}

/* Rewarding resources models */
export interface ResourceRewardModel {
  type: ResourceType;
  count: number;
}

export interface HiringRewardModel {
  unitType: UnitBaseType;
  maxCount: number;
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
