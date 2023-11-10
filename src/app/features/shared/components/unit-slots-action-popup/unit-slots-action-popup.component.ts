import { Component } from '@angular/core';
import { BasicPopup } from '../popup-container';
import { UnitGroupSlot, swapUnitsInSlots } from 'src/app/core/heroes';

@Component({
  selector: 'mw-unit-slots-action-popup',
  templateUrl: './unit-slots-action-popup.component.html',
  styleUrl: './unit-slots-action-popup.component.scss'
})
export class UnitSlotsActionPopupComponent extends BasicPopup<{ sourceSlot: UnitGroupSlot, targetSlot: UnitGroupSlot }>{

  swap(): void {
    swapUnitsInSlots(this.data.sourceSlot, this.data.targetSlot);

    this.close();
  }

  merge(): void {
    this.close();
  }
}
