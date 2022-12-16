import { Component, OnInit } from '@angular/core';
import { ResourcesModel, ResourceType } from 'src/app/core/resources';
import { HiringReward, HiringRewardModel } from 'src/app/core/structures';
import { StructHireRewardPopup } from 'src/app/core/ui';
import { MwPlayersService, MwUnitGroupsService } from 'src/app/features/services';
import { BasicPopup } from 'src/app/features/shared/components';

interface HireModel {
  hire: HiringRewardModel,
  count: number;

  baseCost: Partial<ResourcesModel>;
  currentCost: Partial<ResourcesModel>;
}

@Component({
  selector: 'mw-hiring-reward-popup',
  templateUrl: './hiring-reward-popup.component.html',
  styleUrls: ['./hiring-reward-popup.component.scss']
})
export class HiringRewardPopupComponent extends BasicPopup<StructHireRewardPopup> implements OnInit {

  public hiredGroups!: HireModel[];

  public canConfirm: boolean = true;

  constructor(
    private readonly playersService: MwPlayersService,
    private readonly unitGroups: MwUnitGroupsService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.hiredGroups = (this.data.struct.reward as HiringReward).units.map(unit => {
      const baseCost: Partial<ResourcesModel> = {};
      const currentCost: Partial<ResourcesModel> = {};

      const unitReqs = unit.unitType.baseRequirements;

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
        hire: unit,
        count: 0,
        baseCost: baseCost,
        currentCost: currentCost,
      };
    });
  }

  public updateCountForGroup(unit: HireModel, event: Event): void {
    unit.count = Number((event.target as HTMLInputElement).value);
    const playerResources = this.playersService.getCurrentPlayer().resources;

    this.canConfirm = true;

    Object.entries(unit.baseCost).forEach(([resource, baseCost]: [string, number]) => {
      unit.currentCost[resource as keyof ResourcesModel] = baseCost * unit.count;
    });

    this.updateCanConfirm();
  }

  public confirmHire(): void {
    const currentPlayer = this.playersService.getCurrentPlayer();
    const playerResources = currentPlayer.resources;

    const totalCosts = this.calcTotalCosts();

    Object.entries(totalCosts).forEach(([res, amount]) => {
      playerResources[res as keyof ResourcesModel] -= amount;
    });

    this.hiredGroups.forEach(group => {
      if (group.count) {
        const unitGroup = this.unitGroups.createUnitGroup(
          group.hire.unitType,
          { count: group.count },
          currentPlayer
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