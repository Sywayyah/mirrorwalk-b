import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ResourcesModel, ResourceType } from 'src/app/core/model/resources.types';
import { HiringReward, HiringRewardModel } from 'src/app/core/model/structures.types';
import { MwPlayersService, StructHireRewardPopup } from 'src/app/feature-sandbox/services';

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
export class HiringRewardPopupComponent implements OnInit {

  @Input() public popup!: StructHireRewardPopup;
  @Output() public close: EventEmitter<void> = new EventEmitter();

  public hiredGroups!: HireModel[];

  public canConfirm: boolean = true;

  constructor(
    private readonly playersService: MwPlayersService,
  ) {
  }

  ngOnInit(): void {
    this.hiredGroups = (this.popup.struct.reward as HiringReward).units.map(unit => {
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
        this.playersService.addUnitGroupToTypeStack(currentPlayer, {
          count: group.count,
          type: group.hire.unitType,
          ownerPlayerRef: currentPlayer,
          turnsLeft: group.hire.unitType.defaultTurnsPerRound,
        });
      }
    });

    this.close.emit();
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
