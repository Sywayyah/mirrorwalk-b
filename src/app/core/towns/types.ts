import { NewDayParams, NewDayStarted } from '../events';
import { GameObject } from '../game-objects';
import { ActivityTypes, Building, BuildingDescription, HiringActivity } from './buildings';

export interface TownBase<T extends string> {
  name: string;
  availableBuildings: Record<T, BuildingDescription>;
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

      // army growth each 7-th day
      // todo: extract into a separate event, like NewWeekBegins
      if ((event.day % 7) === 0) {
        this.getHiringBuildings().forEach((building) => {
          const hiring = building.currentBuilding.activity as HiringActivity;
          this.unitsAvailableMap[hiring.unitGrowthGroup] += hiring.growth;
        });
      }
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
    const hiringBuildings = this.getHiringBuildings();

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

  private getHiringBuildings(): Building[] {
    return Object.values<Building>(this.buildings)
      .filter((building) => building.currentBuilding.activity?.type === ActivityTypes.Hiring);
  }
}
