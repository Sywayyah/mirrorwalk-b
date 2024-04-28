import { Component, inject } from '@angular/core';
import { GarrisonHirableGroup, GarrisonModel } from 'src/app/core/garrisons/types';
import { CommonUtils } from 'src/app/core/utils';
import { MwPlayersService, MwUnitGroupsService } from 'src/app/features/services';
import { BasicPopup } from 'src/app/features/shared/components';

@Component({
  selector: 'mw-garrison-popup',
  templateUrl: './garrison-popup.component.html',
  styleUrl: './garrison-popup.component.scss'
})
export class GarrisonPopupComponent extends BasicPopup<{}> {
  private readonly players = inject(MwPlayersService);
  private readonly unitsService = inject(MwUnitGroupsService);

  readonly currentPlayer = this.players.getCurrentPlayer();

  selectedGroup?: GarrisonHirableGroup;
  selectedGarrison?: GarrisonModel;

  canHire: boolean = true;

  selectItem(hirableGroup: GarrisonHirableGroup, garrison: GarrisonModel): void {
    this.selectedGroup = hirableGroup;
    this.selectedGarrison = garrison;

    this.canHire = this.players.playerHasResources(this.currentPlayer, hirableGroup.cost);
  }

  hire(): void {
    if (!this.selectedGroup || !this.selectedGarrison || !this.canHire) {
      return;
    }
    const group = this.selectedGroup;

    CommonUtils.removeItem(this.selectedGarrison.groups, group);
    this.players.removeResourcesFromPlayer(this.currentPlayer, group.cost);

    const newUnitGroup = this.unitsService.createUnitGroup(
      group.type.id,
      { count: group.count },
      this.currentPlayer.hero,
    );

    this.players.addUnitGroupToTypeStack(this.currentPlayer, newUnitGroup);

    this.selectedGarrison = undefined;
    this.selectedGroup = undefined;
  }
}
