import { Resources } from '../resources';
import { UnitBase } from '../unit-types';

export enum ActivityTypes {
  Hiring,
}

interface BuildingAcitivty<T extends ActivityTypes = ActivityTypes> {
  type: T;
}

export interface HiringActivity extends BuildingAcitivty<ActivityTypes.Hiring> {
  hiring: {
    type: UnitBase;
    growth: number;
    // optional, default is 7
    refillDaysInterval?: number;
  }[];
  unitGrowthGroup: string;
}

export interface BuidlingBase {
  name: string;
  // cost: Resources;
  upgrade?: BuidlingBase;
  activity?: BuildingAcitivty;
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

export interface Town<T extends string> {
  base: TownBase<T>;
  buildings: Record<T, Building>;
}
