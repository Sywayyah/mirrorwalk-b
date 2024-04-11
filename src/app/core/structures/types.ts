import { PlayersApi, SpellsApi } from '../api/game-api';
import { Entity, StructId, UnitTypeId } from '../entities';
import { EventFeedApi } from '../game-objects';
import { ItemBaseModel } from '../items';
import { Player } from '../players';
import { ResourceType } from '../resources';
import { LocalEvents } from '../triggers';
import { DescriptionElement } from '../ui';
import { GenerationModel, UnitGroup } from '../unit-types';
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
export type ControlsState = Record<'accept', boolean>;

interface StructuresApi {
  updateAvailableLocations(): void;
  markLocationVisited(struct: MapStructure): void;
}

export type StructsAPI = {
  players: PlayersApi;
  localEvents: LocalEvents<typeof SturctEventsGroup>;
  thisStruct: MapStructure;
  eventFeed: EventFeedApi;
  spells: SpellsApi;
  structures: StructuresApi;
};

export enum StructureType {
  Scripted,
}

interface StructureDescriptions {
  // will override name defind on generator level
  name?: string;
  descriptions: (string | DescriptionElement)[];
}

/* This base type for structures will be expanded and, most likely, will have an access to events and API. */
export interface StructureGeneratorModel extends Entity {
  id: StructId;
  name: string;
  icon?: string;
  control: StuctureControl;

  description?: (params: { thisStruct: MapStructure }) => StructureDescriptions;

  actionPoints?: number;
  disableWeeklyGuardRise?: boolean;

  type?: StructureType;

  generateGuard?: (params: { thisStruct: MapStructure }) => GenerationModel;

  /* todo: Array of rewards? */
  generateReward?: () => NeutralRewardModel;

  // practically, this can be converted to local event
  // todo: might be obsolete
  onVisited?: (params: OnVisitedParams) => void;
  config?: {
    init(api: StructsAPI): void;
  };
}

/* Rewarding resources models */
export interface ResourceRewardModel {
  type: ResourceType;
  count: number;
}

export interface HiringRewardModel {
  unitTypeId: UnitTypeId;
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
