import { GameObject } from "../game-objects";
import { Resources } from "../resources";
import { UnitBaseType } from "../unit-types";

export enum ActivityTypes {
  Hiring,
}

interface BuildingAcitivty<T extends ActivityTypes = ActivityTypes> {
  type: T;
}

export interface HiringDetails {
  type: UnitBaseType;
  growth: number;
  // optional, default is 7
  refillDaysInterval?: number;
  // trainUpgraded?: boolean;
}

export interface HiringActivity extends BuildingAcitivty<ActivityTypes.Hiring> {
  hiring: HiringDetails;
  unitGrowthGroup: string;
  growth: number;
  growthIntervalDays: number;
  upgrade?: boolean;
}

export interface BuidlingBase {
  name: string;
  // cost: Resources;
  description?: string;
  upgrade?: BuidlingBase;
  activity?: BuildingAcitivty;
}

export interface BuildingLevel {
  building: BuidlingBase;
  cost: Resources;
}

export interface BuildingDescription {
  description: string;
  levels: { building: BuidlingBase, cost: Resources }[];
  icon: string;
  tier: number;
}

interface BuildingCreationParams {
  base: BuildingDescription;
}

export class Building extends GameObject<BuildingCreationParams> {
  public static readonly categoryId: string = 'building';

  public currentLevel: number = 0;
  public built: boolean = false;
  public base!: BuildingDescription;
  public currentBuilding!: BuidlingBase;

  create(params: BuildingCreationParams): void {
    this.base = params.base;
    this.currentBuilding = params.base.levels[0].building;
  }
}
