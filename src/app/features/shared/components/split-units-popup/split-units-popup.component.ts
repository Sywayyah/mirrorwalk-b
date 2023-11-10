import { Component } from '@angular/core';
import { UnitGroup } from 'src/app/core/unit-types';
import { BasicPopup } from '../popup-container';

@Component({
  selector: 'mw-split-units-popup',
  templateUrl: './split-units-popup.component.html',
  styleUrl: './split-units-popup.component.scss'
})
export class SplitUnitsPopupComponent extends BasicPopup<{ unitGroup: UnitGroup }> {

  toSplit = 0;

  upgadeValue(event: Event): void {
    this.toSplit = Number((event.target as HTMLInputElement).value);
  }

  closePopup(): void {
    this.close();
  }
}
