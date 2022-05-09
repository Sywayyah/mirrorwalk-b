import { PlayerInstanceModel, UnitTypeModel } from "./main.model";
import { ResourceType } from "./resources.types";

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
export enum StructureTypeEnum {
    NeutralCamp = 'neutral-camp',
}

export interface StructureModel<T extends StructureTypeEnum = StructureTypeEnum> {
    id: string;
    type: T;
}

/* Neutral structures */
export enum NeutralRewardTypesEnum {
    SingleResource = 'resource',
    Resources = 'resources',
    UnitsHire = 'hire',
    Mines = 'mines',
}

export interface NeutralRewardModel<T extends NeutralRewardTypesEnum = NeutralRewardTypesEnum> {
    type: T;
}

export interface NeutralCampStructure extends StructureModel<StructureTypeEnum.NeutralCamp> {
    guard: PlayerInstanceModel;
    reward?: NeutralRewardModel;
    isDefeated?: boolean;
}

/* Resources camp */
export interface ResourcesReward extends NeutralRewardModel<NeutralRewardTypesEnum.Resources> {
    resourceGroups: ResourceRewardModel[][];
}


/* Hiring Camp */
export interface HiringReward extends NeutralRewardModel<NeutralRewardTypesEnum.UnitsHire> {
    units: HiringRewardModel[];
}