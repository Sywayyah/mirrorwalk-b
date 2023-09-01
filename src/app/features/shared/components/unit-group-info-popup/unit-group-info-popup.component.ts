import { Component } from '@angular/core';
import { BasicPopup } from '../popup-container';
import { UnitGroup } from 'src/app/core/unit-types';

@Component({
  selector: 'mw-unit-group-info-popup',
  templateUrl: './unit-group-info-popup.component.html',
  styleUrls: ['./unit-group-info-popup.component.scss']
})
export class UnitGroupInfoPopupComponent extends BasicPopup<{ unitGroup: UnitGroup }>{

}
