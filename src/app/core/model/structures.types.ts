import { GenerationModel } from "../utils/common.utils";
import { PlayerInstanceModel, UnitTypeModel } from "./main.model";
import { ResourceType } from "./resources.types";

/* Base descriptive type */

export enum StuctureControl {
    Neutral = 'neutral',
    EnemyPlayer = 'enemy',
}

export interface StructureGeneratorModel {
    name: string;
    control: StuctureControl;

    /* looks good. it can be impossible to describe all possible logic data-driven, 
        it's better to have it like fn, which decides on it's own

        although, think about it later.
     */
    generateGuard: () => GenerationModel;
    generateReward: () => NeutralRewardModel;
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
export enum StructureTypeEnum {
    NeutralCamp = 'neutral-camp',
}

export interface StructureModel<T extends StructureTypeEnum = StructureTypeEnum> {
    id: string;
    type: T;
    generator: StructureGeneratorModel;
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