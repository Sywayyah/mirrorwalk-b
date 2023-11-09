import { Component, OnInit } from '@angular/core';
import { ResourceType, Resources, ResourcesModel } from 'src/app/core/resources';
import { HiringReward, HiringRewardModel } from 'src/app/core/structures';
import { StructPopupData } from 'src/app/core/ui';
import { MwPlayersService, MwUnitGroupsService } from 'src/app/features/services';
import { BasicPopup } from 'src/app/features/shared/components';

interface HireModel {
  hire: HiringRewardModel,
  count: number;

  baseCost: Resources;
  currentCost: Resources;
}

@Component({
  selector: 'mw-hiring-reward-popup',
  templateUrl: './hiring-reward-popup.component.html',
  styleUrls: ['./hiring-reward-popup.component.scss']
})
export class HiringRewardPopupComponent extends BasicPopup<StructPopupData> implements OnInit {

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

    this.hiredGroups.forEach(group => {
      if (group.count) {
        const unitGroup = this.unitGroups.createUnitGroup(
          group.hire.unitType,
          { count: group.count },
          currentPlayer.hero,
        );

        this.playersService.addUnitGroupToTypeStack(currentPlayer, unitGroup);
      }
    });

    this.close();
  }

  private calcTotalCosts(): Resources {
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

    }, {} as Resources);
  }

  private updateCanConfirm(): void {
    const totalCosts = this.calcTotalCosts();

    this.canConfirm = this.playersService.playerHasResources(this.playersService.getCurrentPlayer(), totalCosts);
  }
}
