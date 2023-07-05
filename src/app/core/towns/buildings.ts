import { PlayersApi } from "../api/game-api";
import { GameObject } from "../game-objects";
import { Resources } from "../resources";
import { LocalEvents } from "../triggers";
import { UnitBaseType } from "../unit-types";
import { BuildingsEventsGroup } from "./events";

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

// Events & APIs should be revised and possibly simplified
/** Major possible improvement points:
 *
 *  1. Event group might return a type, where all Util Subtypes already present.
 *  2. Point 1 might make it possible so I won't need a file with types declared per event.
 *  3. API unifications.
 */
export type BuldingsAPI = { players: PlayersApi, localEvents: LocalEvents<typeof BuildingsEventsGroup> };

export interface BuidlingBase {
  name: string;
  // cost: Resources;
  description?: string;
  upgrade?: BuidlingBase;
  activity?: BuildingAcitivty;
  config?: { init(api: BuldingsAPI): void };
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
    // can add some public methods in GameObjects
  }
}