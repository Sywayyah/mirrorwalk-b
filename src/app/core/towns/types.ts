import { Resources } from '../resources';
import { UnitBase } from '../unit-types';

export enum ActivityTypes {
  Hiring,
}

interface BuildingAcitivty<T extends ActivityTypes = ActivityTypes> {
  type: T;
}

export interface HiringActivity extends BuildingAcitivty<ActivityTypes.Hiring> {
  hiring: { type: UnitBase, count: number, refillDaysInterval: number }[];
}

export interface Building {
  name: string;
  // cost: Resources;
  upgrade?: Building;
  activity?: BuildingAcitivty;
}


export interface TownBase<T extends string> {
  name: string;
  availableBuildings: Record<T, { description: string, levels: { building: Building, cost: Resources }[] }>;
}

export interface Town<T extends string> {
  base: TownBase<T>;
  buildings: Record<T, { currentLevel: number }>;
}
