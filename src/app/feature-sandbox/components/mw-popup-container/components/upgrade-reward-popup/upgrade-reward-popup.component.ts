import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PlayersApi } from 'src/app/core/model/game-api/game-apis.types';
import { UnitGroupInstModel, UnitTypeModel } from 'src/app/core/model/main.model';
import { ResourcesModel, ResourceType } from 'src/app/core/model/resources.types';
import { HiringRewardModel, UnitUpgradeReward } from 'src/app/core/model/structures.types';
import { MwPlayersService, UpgradingPopup } from 'src/app/feature-sandbox/services';
import { MwHeroesService } from 'src/app/feature-sandbox/services/mw-heroes.service';
import { MwUnitGroupsService } from 'src/app/feature-sandbox/services/mw-unit-groups.service';

interface UpgradeModel {
  hire: HiringRewardModel,
  count: number;

  baseCost: Partial<ResourcesModel>;
  currentCost: Partial<ResourcesModel>;

  originalGroup: UnitGroupInstModel;
}

@Component({
  selector: 'mw-upgrade-reward-popup',
  templateUrl: './upgrade-reward-popup.component.html',
  styleUrls: ['./upgrade-reward-popup.component.scss']
})
export class UpgradeRewardPopup implements OnInit {

  @Input() public popup!: UpgradingPopup;
  @Output() public close: EventEmitter<void> = new EventEmitter();

  public hiredGroups!: UpgradeModel[];

  public canConfirm: boolean = true;

  constructor(
    private readonly playersService: MwPlayersService,
    private readonly heroes: MwHeroesService,
    private readonly unitGroups: MwUnitGroupsService,
    private readonly players: MwPlayersService,
  ) {
  }

  // todo: definitely will require rethinking, a lot in common with hiring popup.
  //  will probably require to extract common models/components/logic

  public ngOnInit(): void {
    this.hiredGroups = (this.popup.struct.reward as UnitUpgradeReward)
      .getUnits(this.getPlayerApi())
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
            unitType: unit.type.upgradeDetails?.target as UnitTypeModel,
          },
          count: 0,
          baseCost: baseCost,
          currentCost: currentCost,

          originalGroup: unit,
        };
      });
  }

  private getPlayerApi(): PlayersApi {
    return {
      addExperienceToPlayer: (player, xpAmount) => {
        this.players.addExperienceToPlayer(player.id, xpAmount);
      },
      addUnitGroupToPlayer: (player, unitType, count) => {
        const unitGroup = this.unitGroups.createUnitGroup(unitType, { count }, player);
        this.players.addUnitGroupToTypeStack(player, unitGroup);
      },
      addManaToPlayer: (player, mana) => {
        this.heroes.addManaToHero(player.hero, mana);
      },
      addMaxManaToPlayer: (player, mana) => {
        this.heroes.addMaxManaToHero(player.hero, mana);
      },
      addSpellToPlayerHero: (player, spell) => {
        this.heroes.addSpellToHero(player.hero, spell);
      },
      getCurrentPlayer: () => this.playersService.getCurrentPlayer(),
      getCurrentPlayerUnitGroups: () => this.playersService.getUnitGroupsOfPlayer(this.playersService.getCurrentPlayer().id),
    };
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
    this.close.emit();
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
          group.hire.unitType,
          { count: group.count },
          currentPlayer
        );

        this.playersService.addUnitGroupToTypeStack(currentPlayer, unitGroup);
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
