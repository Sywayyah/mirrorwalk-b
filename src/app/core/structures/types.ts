import { PlayersApi, SpellsApi } from '../api/game-api';
import { EventFeedApi } from '../game-objects';
import { ItemBaseModel } from '../items';
import { Player } from '../players';
import { ResourceType } from '../resources';
import { LocalEvents } from '../triggers';
import { GenerationModel, UnitBaseType, UnitGroup } from '../unit-types';
import { SturctEventsGroup } from './events';
import { MapStructure } from './map-structures';

export enum StuctureControl {
  Neutral = 'neutral',
  EnemyPlayer = 'enemy',
}

interface OnVisitedParams {
  playersApi: PlayersApi;
  spellsApi: SpellsApi,
  visitingPlayer: Player;
}


export type StructsAPI = {
  players: PlayersApi,
  localEvents: LocalEvents<typeof SturctEventsGroup>,
  thisStruct: MapStructure,
  eventFeed: EventFeedApi,
  spells: SpellsApi,
};

export enum StructureType {
  Scripted,
}

/* This base type for structures will be expanded and, most likely, will have an access to events and API. */
export interface StructureGeneratorModel {
  name: string;
  icon?: string;
  control: StuctureControl;
  description?: string;
  actionPoints?: number;
  disableWeeklyGuardRise?: boolean;

  type?: StructureType;

  generateGuard?: () => GenerationModel;

  /* todo: Array of rewards? */
  generateReward?: () => NeutralRewardModel;

  // practically, this can be converted to local event
  // todo: might be obsolete
  onVisited?: (params: OnVisitedParams) => void;
  config?: { init(api: StructsAPI): void };
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
