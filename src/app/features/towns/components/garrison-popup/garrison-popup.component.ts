import { Component, inject } from '@angular/core';
import { GarrisonHirableGroup, GarrisonModel } from 'src/app/core/garrisons/types';
import { CommonUtils } from 'src/app/core/utils';
import { MwPlayersService } from 'src/app/features/services';
import { BasicPopup } from 'src/app/features/shared/components';

@Component({
  selector: 'mw-garrison-popup',
  templateUrl: './garrison-popup.component.html',
  styleUrl: './garrison-popup.component.scss'
})
export class GarrisonPopupComponent extends BasicPopup<{}> {
  private readonly players = inject(MwPlayersService);

  readonly currentPlayer = this.players.getCurrentPlayer();

  selectedGroup?: GarrisonHirableGroup;
  selectedGarrison?: GarrisonModel;

  selectItem(hirableGroup: GarrisonHirableGroup, garrison: GarrisonModel): void {
    this.selectedGroup = hirableGroup;
    this.selectedGarrison = garrison;
  }

  hire(): void {
    if (!this.selectedGroup || !this.selectedGarrison) {
      return;
    }

    CommonUtils.removeItem(this.selectedGarrison.groups, this.selectedGroup);

    this.selectedGarrison = undefined;
    this.selectedGroup = undefined;
  }
}
