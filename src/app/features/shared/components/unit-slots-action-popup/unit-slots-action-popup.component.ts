import { Component, inject } from '@angular/core';
import { UnitGroupSlot, swapUnitsInSlots } from 'src/app/core/heroes';
import { MwPlayersService } from 'src/app/features/services';
import { BasicPopup } from '../popup-container';

@Component({
  selector: 'mw-unit-slots-action-popup',
  templateUrl: './unit-slots-action-popup.component.html',
  styleUrl: './unit-slots-action-popup.component.scss'
})
export class UnitSlotsActionPopupComponent extends BasicPopup<{ sourceSlot: UnitGroupSlot, targetSlot: UnitGroupSlot }>{

  private readonly players = inject(MwPlayersService);

  swap(): void {
    swapUnitsInSlots(this.data.sourceSlot, this.data.targetSlot);

    this.close();
  }

  merge(): void {
    const currentHero = this.players.getCurrentPlayer().hero;

    this.data.targetSlot.unitGroup!.addUnitsCount(this.data.sourceSlot.unitGroup!.count);
    this.data.sourceSlot.unitGroup = null;
    currentHero.removeUnitGroup(this.data.sourceSlot.unitGroup!);
    this.close();
  }
}
