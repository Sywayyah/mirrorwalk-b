import { Component } from '@angular/core';
import { UnitGroup } from 'src/app/core/unit-types';
import { BasicPopup } from '../popup-container';

@Component({
    selector: 'mw-unit-group-info-popup',
    templateUrl: './unit-group-info-popup.component.html',
    standalone: false
})
export class UnitGroupInfoPopupComponent extends BasicPopup<{ unitGroup: UnitGroup }> {

}
