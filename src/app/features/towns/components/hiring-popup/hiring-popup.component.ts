import { Component, OnInit } from '@angular/core';
import { resolveEntity } from 'src/app/core/registries';
import { ResourceType, Resources, ResourcesModel } from 'src/app/core/resources';
import { BuidlingBase, Building, HiringActivity, HiringDetails, Town } from 'src/app/core/towns';
import { UnitBaseType } from 'src/app/core/unit-types';
import { MwPlayersService, MwUnitGroupsService } from 'src/app/features/services';
import { GameObjectsManager } from 'src/app/features/services/game-objects-manager.service';
import { BasicPopup, PopupService } from 'src/app/features/shared/components';
import { BuildPopupComponent } from '../build-popup/build-popup.component';

interface HiringPopupData {
  building: Building;
  town: Town<any>;
  hiringActivity: HiringActivity;
}

interface UnitHiringModel {
  unitType: UnitBaseType;
  maxCount: number;
}

interface UnitGroupHireModel {
  hire: UnitHiringModel;
  count: number;

  baseCost: Resources;
  currentCost: Resources;
}

type HireMode = 'hire' | 'upgrade';

@Component({
  selector: 'mw-hiring-popup',
  templateUrl: './hiring-popup.component.html',
  styleUrls: ['./hiring-popup.component.scss']
})
export class HiringPopupComponent extends BasicPopup<HiringPopupData> implements OnInit {

  public hirableGroups: UnitGroupHireModel[] = [];

  public canConfirm: boolean = true;

  public originalCountToHire!: number;
  public countToHire!: number;
  public countToUpgrade!: number;

  public plannedToHire: number = 0;
  public plannedToUpgrade: number = 0;

  public currentMode: HireMode = 'hire';

  public unitType: UnitBaseType;

  public currentBuilding: BuidlingBase;

  public activity: HiringActivity;

  public canBeUpgraded: boolean;

  constructor(
    private playersService: MwPlayersService,
    private unitsService: MwUnitGroupsService,
    private popupService: PopupService,
    private gameObjectsManager: GameObjectsManager,
  ) {
    super();
    this.unitType = this.data.hiringActivity.hiring.type;
    this.activity = this.data.hiringActivity;
    this.currentBuilding = this.data.building.currentBuilding;
    this.canBeUpgraded = this.data.building.base.levels.length - 1 > this.data.building.currentLevel;
  }

  ngOnInit(): void {
    console.log(this.data);

    const activity = this.data.building.currentBuilding.activity as HiringActivity;

    this.originalCountToHire = this.data.town.unitsAvailableMap[activity.unitGrowthGroup];
    this.countToHire = this.originalCountToHire;

    if (this.activity.upgrade) {
      this.countToUpgrade = this.playersService.getPlayerUnitsCountOfType(
        this.playersService.getCurrentPlayer(),
        this.activity.hiring.type,
      );
    }

    this.hirableGroups = this.getGroupsToHire().map(unit => {
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

  public setMode(mode: HireMode): void {
    if (this.currentMode === mode) {
      return;
    }

    if (mode === 'hire') {
      this.plannedToUpgrade = 0;
    } else {
      this.plannedToHire = 0;
    }

    this.currentMode = mode;

    const activity = this.data.building.currentBuilding.activity as HiringActivity;

    this.hirableGroups = this.getGroupsToHire().map(unit => {
      const baseCost: Resources = {};
      const currentCost: Resources = {};


      const baseUnitType = this.activity.hiring.type;

      const unitReqs = this.currentMode === 'hire'
        ? unit.type.baseRequirements : baseUnitType.upgradeDetails!.upgradeCost!;

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
          maxCount: this.currentMode === 'hire'
            ? this.data.town.unitsAvailableMap[activity.unitGrowthGroup]
            : this.countToUpgrade,
          unitType: unit.type,
        },
        count: 0,
        baseCost: baseCost,
        currentCost: currentCost,
      } as UnitGroupHireModel;
    })
  }

  private getGroupsToHire(): HiringDetails[] {
    const activity = this.data.building.currentBuilding.activity as HiringActivity;

    if (this.currentMode === 'hire') {
      return !activity.upgrade
        ? [activity.hiring]
        : [activity.hiring, ...
          (activity.hiring.type.upgradeDetails?.target
            ? [{
              growth: 0,
              type: resolveEntity<UnitBaseType>(activity.hiring.type.upgradeDetails.target),
            }]
            : [])
        ];
    } else {
      return [...(activity.hiring.type.upgradeDetails?.target
        ? [{
          growth: 0,
          type: resolveEntity<UnitBaseType>(activity.hiring.type.upgradeDetails.target),
        }]
        : [])];
    }

  }

  public updateCountForGroup(unit: UnitGroupHireModel, event: Event): void {
    unit.count = Number((event.target as HTMLInputElement).value);

    this.canConfirm = true;

    Object.entries(unit.baseCost).forEach(([resource, baseCost]: [string, number]) => {
      unit.currentCost[resource as keyof ResourcesModel] = baseCost * unit.count;
    });

    if (this.currentMode === 'hire') {
      this.plannedToHire = this.hirableGroups.reduce((acc, next) => acc + next.count, 0);
    } else {
      this.plannedToUpgrade = this.hirableGroups.reduce((acc, next) => acc + next.count, 0);
    }
    this.updateCanConfirm();
  }

  public confirmHire(): void {
    const currentPlayer = this.playersService.getCurrentPlayer();

    const totalCosts = this.calcTotalCosts();

    this.playersService.removeResourcesFromPlayer(currentPlayer, totalCosts);

    if (this.currentMode === 'hire') {
      this.hirableGroups.forEach(group => {
        if (group.count) {
          const unitGroup = this.unitsService.createUnitGroup(
            group.hire.unitType,
            { count: group.count },
            currentPlayer.hero,
          );

          const activity = this.data.building.currentBuilding.activity as HiringActivity;

          this.data.town.unitsAvailableMap[activity.unitGrowthGroup] -= group.count;

          this.playersService.addUnitGroupToTypeStack(currentPlayer, unitGroup);
        }
      });
    } else {
      this.hirableGroups.forEach(group => {
        if (group.count) {
          const stackOfType = currentPlayer.hero.unitGroups.find(unitGroup => unitGroup.type === this.activity.hiring.type)!;

          this.playersService.removeNUnitsFromGroup(currentPlayer, stackOfType, group.count);
          const unitGroup = this.unitsService.createUnitGroup(
            group.hire.unitType,
            { count: group.count },
            currentPlayer.hero
          );

          this.playersService.addUnitGroupToTypeStack(currentPlayer, unitGroup);
        }
      });
    }


    this.close();
  }

  public upgradeBuilding(): void {
    this.close();
    this.popupService.createBasicPopup({
      component: BuildPopupComponent,
      data: {
        building: this.data.building,
        targetLevel: 2,
      },
      class: 'dark',
    });
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
