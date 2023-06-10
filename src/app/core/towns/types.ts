import { Resources } from '../resources';
import { UnitBaseType } from '../unit-types';

// Towns and buildings, practically, can also become GameObjects.

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

export interface TownBase<T extends string> {
  name: string;
  availableBuildings: Record<T, BuildingDescription>;
}

export interface Building {
  currentLevel: number;
  built?: boolean;
  base: BuildingDescription;
  currentBuilding: BuidlingBase;

}


// instance
export interface Town<T extends string> {
  base: TownBase<T>;
  buildings: Record<T, Building>;
  growthMap: Record<string, number>;
  unitsAvailableMap: Record<string, number>;
}
