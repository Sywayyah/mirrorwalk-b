import { Component, OnInit } from '@angular/core';
import { UnitTypeId } from 'src/app/core/entities';
import { ResourceType, ResourcesModel } from 'src/app/core/resources';
import { HiringRewardModel, UnitUpgradeReward } from 'src/app/core/structures';
import { StructPopupData } from 'src/app/core/ui';
import { UnitGroup } from 'src/app/core/unit-types';
import { MwPlayersService, MwUnitGroupsService } from 'src/app/features/services';
import { ApiProvider } from 'src/app/features/services/api-provider.service';
import { BasicPopup } from 'src/app/features/shared/components';

interface UpgradeModel {
  hire: HiringRewardModel,
  count: number;

  baseCost: Partial<ResourcesModel>;
  currentCost: Partial<ResourcesModel>;

  originalGroup: UnitGroup;
}

@Component({
  selector: 'mw-upgrade-reward-popup',
  templateUrl: './upgrade-reward-popup.component.html',
  styleUrls: ['./upgrade-reward-popup.component.scss']
})
export class UpgradeRewardPopupComponent extends BasicPopup<StructPopupData> implements OnInit {

  public hiredGroups!: UpgradeModel[];

  public canConfirm: boolean = true;

  constructor(
    private apiProvider: ApiProvider,
    private playersService: MwPlayersService,
    private unitGroups: MwUnitGroupsService,
  ) {
    super();
  }

  // todo: definitely will require rethinking, a lot in common with hiring popup.
  //  will probably require to extract common models/components/logic

  public ngOnInit(): void {
    this.hiredGroups = (this.data.struct.reward as UnitUpgradeReward)
      .getUnits(this.apiProvider.getPlayerApi())
      .map(unit => {
        const baseCost: Partial<ResourcesModel> = {};
        const currentCost: Partial<ResourcesModel> = {};

        const unitReqs = unit.type.upgradeDetails?.upgradeCost as ResourcesModel;

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
            maxCount: unit.count,
            unitTypeId: unit.type.upgradeDetails?.target as UnitTypeId,
          },
          count: 0,
          baseCost: baseCost,
          currentCost: currentCost,

          originalGroup: unit,
        };
      });
  }

  public updateCountForGroup(unit: UpgradeModel, event: Event): void {
    unit.count = Number((event.target as HTMLInputElement).value);
    const playerResources = this.playersService.getCurrentPlayer().resources;

    this.canConfirm = true;

    Object.entries(unit.baseCost).forEach(([resource, baseCost]: [string, number]) => {
      unit.currentCost[resource as keyof ResourcesModel] = baseCost * unit.count;
    });

    this.updateCanConfirm();
  }

  public cancel(): void {
    this.close();
  }

  public confirmHire(): void {
    // this.popup.struct.isCompleted = true;
    // this.popup.struct.isInactive = true;

    const currentPlayer = this.playersService.getCurrentPlayer();
    const playerResources = currentPlayer.resources;

    const totalCosts = this.calcTotalCosts();

    Object.entries(totalCosts).forEach(([res, amount]) => {
      playerResources[res as keyof ResourcesModel] -= amount;
    });

    this.hiredGroups.forEach(group => {
      if (group.count) {
        this.playersService.removeNUnitsFromGroup(currentPlayer, group.originalGroup, group.count);

        const unitGroup = this.unitGroups.createUnitGroup(
          group.hire.unitTypeId,
          { count: group.count },
          currentPlayer.hero
        );

        this.playersService.addUnitGroupToTypeStack(currentPlayer, unitGroup);
      }
    });

    this.close();
  }

  private calcTotalCosts(): Partial<ResourcesModel> {
    return this.hiredGroups.reduce((totalCosts, unit) => {

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
    const playerResources = this.playersService.getCurrentPlayer().resources;

    const totalCosts = this.calcTotalCosts();

    this.canConfirm = Object.entries(totalCosts).every(([res, amount]) => {
      return playerResources[res as keyof ResourcesModel] >= amount;
    });
  }
}
