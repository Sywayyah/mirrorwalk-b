import { signal } from '@angular/core';
import { Entity, ItemId, TownId } from '../entities';
import { NewWeekStarted } from '../events';
import { GameObject } from '../game-objects';
import { addResources, Resources, ResourcesModel } from '../resources';
import {
  ActivityTypes,
  Building,
  BuildingDescription,
  HiringActivity,
} from './buildings';

export interface TownBase<T extends string> extends Entity {
  id: TownId;
  name: string;
  availableBuildings: Record<T, BuildingDescription>;
}

export interface SellingBuildingData {
  items: ItemId[];
  selling?: boolean;
}

interface TownCreationParams<T extends string> {
  townBase: TownBase<T>;
}

interface TownMarketModel {
  resources: ResourcesModel;
}

export class Town<T extends string> extends GameObject<TownCreationParams<T>> {
  public static readonly categoryId: string = 'town';

  public base!: TownBase<T>;
  public buildings!: Record<T, Building>;
  public growthMap!: Record<string, number>;
  public unitsAvailableMap!: Record<string, number>;
  public marketState = signal<TownMarketModel>({
    resources: {
      gems: 0,
      gold: 0,
      redCrystals: 0,
      wood: 0,
    },
  });
  // todo: Market resources growth can be added, to determine growth/availability of resources
  // also, need to create a table for resources trading

  create({ townBase }: TownCreationParams<T>): void {
    this.base = townBase;

    this.initTownBuildings();
    this.initUnitGrowthAndAvailability();

    // extract icon into a separate message type
    // disable for now
    // this.getApi().eventFeed.pushPlainMessage(`<i class="ra ra-sword"></i> Objective: Defeat Devastator`);
    // the basic use of global events listening from GameObjects
    this.getApi()
      .events.on(NewWeekStarted)
      .subscribe((event) => {
        // army growth each week
        this.updateAvailableUnitsByWeeklyGrowth();
        this.getApi().eventFeed.pushPlainMessage(
          `The army of ${this.base.name} has grown`,
        );
      });

    this.setMarketResources({
      gold: 500,
      wood: 5,
    });
  }

  addMarketResources(resources: Resources): void {
    const marketResources = this.marketState().resources;

    this.setMarketResources(
      addResources({ ...marketResources }, resources),
    );
  }
  setMarketResources(resources: Resources): void {
    this.marketState.update((val) => ({
      ...val,
      resources: { ...val.resources, ...resources },
    }));
  }

  private updateAvailableUnitsByWeeklyGrowth(): void {
    this.getHiringBuildings().forEach((building) => {
      const hiring = building.currentBuilding.activity as HiringActivity;
      this.unitsAvailableMap[hiring.unitGrowthGroup] += hiring.growth;
    });
  }

  private initTownBuildings(): void {
    this.buildings = Object.keys(this.base.availableBuildings).reduce(
      (acc, buildingId) => {
        return {
          ...acc,
          [buildingId]: this.getApi().gameObjects.createNewGameObject(
            Building,
            {
              base: this.base.availableBuildings[buildingId as T],
            },
          ),
        };
      },
      {} as Record<T, Building>,
    );
  }

  private initUnitGrowthAndAvailability(): void {
    const hiringBuildings = this.getHiringBuildings();

    this.growthMap = hiringBuildings.reduce(
      (acc, hiringBuilding) => {
        const hiringActivity = hiringBuilding.currentBuilding
          .activity as HiringActivity;

        const growthGroup: string = hiringActivity.unitGrowthGroup;

        acc[growthGroup] = hiringActivity.growth;

        return acc;
      },
      {} as Record<string, number>,
    );

    this.unitsAvailableMap = hiringBuildings.reduce(
      (acc, hiringBuilding) => {
        const activity = hiringBuilding.currentBuilding
          .activity as HiringActivity;

        acc[activity.unitGrowthGroup] = activity.growth;
        return acc;
      },
      {} as Record<string, number>,
    );
  }

  private getHiringBuildings(): Building[] {
    return Object.values<Building>(this.buildings).filter(
      (building) =>
        building.currentBuilding.activity?.type === ActivityTypes.Hiring,
    );
  }
}
