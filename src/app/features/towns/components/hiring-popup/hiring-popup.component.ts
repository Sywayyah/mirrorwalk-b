import { Component, OnInit } from '@angular/core';
import { Resources, ResourcesModel, ResourceType } from 'src/app/core/resources';
import { Building, HiringActivity, Town } from 'src/app/core/towns';
import { UnitBase } from 'src/app/core/unit-types';
import { MwPlayersService, MwUnitGroupsService } from 'src/app/features/services';
import { BasicPopup } from 'src/app/features/shared/components';

interface HiringPopupData {
  building: Building;
  town: Town<any>;
  hiringActivity: HiringActivity;
}

interface UnitHiringModel {
  unitType: UnitBase;
  maxCount: number;
}

interface UnitGroupHireModel {
  hire: UnitHiringModel;
  count: number;

  baseCost: Resources;
  currentCost: Resources;
}

@Component({
  selector: 'mw-hiring-popup',
  templateUrl: './hiring-popup.component.html',
  styleUrls: ['./hiring-popup.component.scss']
})
export class HiringPopupComponent extends BasicPopup<HiringPopupData> implements OnInit {

  public hirableGroups: UnitGroupHireModel[] = [];

  public canConfirm: boolean = true;

  constructor(
    private playersService: MwPlayersService,
    private unitsService: MwUnitGroupsService,
  ) {
    super();
  }

  ngOnInit(): void {
    console.log(this.data);

    const activity = this.data.building.currentBuilding.activity as HiringActivity;

    this.hirableGroups = (activity.hiring).map(unit => {
      const baseCost: Partial<ResourcesModel> = {};
      const currentCost: Partial<ResourcesModel> = {};

      const unitReqs = unit.type.baseRequirements;

      const resourceTypes: ResourceType[] = [
        ResourceType.Gems,
        ResourceType.Gold,
        ResourceType.RedCrystals,
        ResourceType.Wood,
      ];

      resourceTypes.forEach(resType => {
        if (unitReqs[resType]) {
          baseCost[resType] = unitReqs[resType];
          currentCost[resType] = 0;
        }
      })

      return {
        hire: {
          maxCount: this.data.town.unitsAvailableMap[activity.unitGrowthGroup],
          unitType: unit.type,
        },
        count: 0,
        baseCost: baseCost,
        currentCost: currentCost,
      } as UnitGroupHireModel;
    })
  }


  public updateCountForGroup(unit: UnitGroupHireModel, event: Event): void {
    unit.count = Number((event.target as HTMLInputElement).value);

    this.canConfirm = true;

    Object.entries(unit.baseCost).forEach(([resource, baseCost]: [string, number]) => {
      unit.currentCost[resource as keyof ResourcesModel] = baseCost * unit.count;
    });

    this.updateCanConfirm();
  }

  public confirmHire(): void {
    const currentPlayer = this.playersService.getCurrentPlayer();

    const totalCosts = this.calcTotalCosts();

    this.playersService.removeResourcesFromPlayer(currentPlayer, totalCosts);

    this.hirableGroups.forEach(group => {
      if (group.count) {
        const unitGroup = this.unitsService.createUnitGroup(
          group.hire.unitType,
          { count: group.count },
          currentPlayer
        );

        const activity = this.data.building.currentBuilding.activity as HiringActivity;

        this.data.town.unitsAvailableMap[activity.unitGrowthGroup] -= group.count;

        this.playersService.addUnitGroupToTypeStack(currentPlayer, unitGroup);
      }
    });

    this.close();
  }

  private calcTotalCosts(): Resources {
    return this.hirableGroups.reduce((totalCosts, unit) => {

      Object.entries(unit.currentCost).forEach(([resource, baseCost]: [string, number]) => {
        const resourceType = resource as keyof ResourcesModel;
        if (totalCosts[resourceType]) {
          /* todo: recheck it */
          (totalCosts[resourceType] as number) += unit.currentCost[resourceType] as number;
        } else {
          totalCosts[resourceType] = unit.currentCost[resourceType];
        }
      });
      return totalCosts;

    }, {} as Partial<ResourcesModel>);
  }

  private updateCanConfirm(): void {
    const totalCosts = this.calcTotalCosts();

    this.canConfirm = this.playersService.playerHasResources(this.playersService.getCurrentPlayer(), totalCosts);
  }
}
