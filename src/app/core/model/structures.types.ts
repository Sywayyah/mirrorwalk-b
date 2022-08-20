import { GenerationModel } from "../utils/common.utils";
import { PlayersApi, SpellsApi } from "./game-api/game-apis.types";
import { ItemBaseModel } from "./items/items.types";
import { PlayerInstanceModel, UnitGroupInstModel, UnitGroupModel, UnitTypeModel } from "./main.model";
import { ResourceType } from "./resources.types";

/* Base descriptive type */
/* Refactor these types */

export enum StuctureControl {
    Neutral = 'neutral',
    EnemyPlayer = 'enemy',
}

interface OnVisitedParams {
    playersApi: PlayersApi;
    spellsApi: SpellsApi,
    visitingPlayer: PlayerInstanceModel;
}

export interface StructureGeneratorModel {
    name: string;
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
    unitType: UnitTypeModel;
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

export interface StructureModel<T extends StructureTypeEnum = StructureTypeEnum> {
    id: string;
    type: T;
    generator: StructureGeneratorModel;
    isInactive?: boolean;
}

/*  */
export interface NeutralSite extends StructureModel<StructureTypeEnum.NeutralSite> {
    isCompleted?: boolean;
    reward?: NeutralRewardModel;
}

/* Neutral structures */
export enum NeutralRewardTypesEnum {
    SingleResource = 'resource',
    Resources = 'resources',
    Item = 'item',
    UnitsHire = 'hire',
    Mines = 'mines',
    UnitsUpgrade = 'upgrading',
}

export interface NeutralRewardModel<T extends NeutralRewardTypesEnum = NeutralRewardTypesEnum> {
    type: T;
}

export interface NeutralCampStructure extends StructureModel<StructureTypeEnum.NeutralCamp> {
    guard: PlayerInstanceModel;
    reward?: NeutralRewardModel;
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
    getUnits: (api: PlayersApi) => UnitGroupInstModel[];
}
