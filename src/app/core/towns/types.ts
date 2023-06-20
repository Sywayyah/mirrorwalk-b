import { NewDayParams, NewDayStarted } from '../events';
import { GameObject } from '../game-objects';
import { Resources } from '../resources';
import { UnitBaseType } from '../unit-types';

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

interface TownCreationParams<T extends string> {
  townBase: TownBase<T>;
}

export class Town<T extends string> extends GameObject<TownCreationParams<T>> {
  public static readonly categoryId: string = 'town';

  public base!: TownBase<T>;
  public buildings!: Record<T, Building>;
  public growthMap!: Record<string, number>;
  public unitsAvailableMap!: Record<string, number>;
  // todo: Market resources growth can be added, to determine growth/availability of resources
  // also, need to create a table for resources trading

  create({ townBase }: TownCreationParams<T>): void {
    this.base = townBase;

    this.initTownBuildings();
    this.initUnitGrowthAndAvailability();

    // the basic use of global events listening from GameObjects
    this.getApi().events.on(NewDayStarted).subscribe((event: NewDayParams) => {
      console.log('New day started, town:', this, event);
    });
  }

  private initTownBuildings(): void {
    this.buildings = Object
      .keys(this.base.availableBuildings)
      .reduce((acc, buildingId) => {
        return {
          ...acc,
          [buildingId]: this.getApi().gameObjects.createNewGameObject(Building, {
            base: this.base.availableBuildings[buildingId as T],
          }),
        };
      }, {} as Record<T, Building>);
  }

  private initUnitGrowthAndAvailability(): void {
    const hiringBuildings = Object.values<Building>(this.buildings)
      .filter((building) => building.currentBuilding.activity?.type === ActivityTypes.Hiring);

    this.growthMap = hiringBuildings
      .reduce((acc, hiringBuilding) => {
        const hiringActivity = hiringBuilding.currentBuilding.activity as HiringActivity;

        const growthGroup: string = hiringActivity.unitGrowthGroup;

        acc[growthGroup] = hiringActivity.growth;

        return acc;
      }, {} as Record<string, number>);

    this.unitsAvailableMap = hiringBuildings.reduce((acc, hiringBuilding) => {
      const activity = hiringBuilding.currentBuilding.activity as HiringActivity;

      acc[activity.unitGrowthGroup] = activity.growth;
      return acc;
    }, {} as Record<string, number>);
  }
}
