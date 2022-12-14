import { Component } from '@angular/core';
import { Building } from 'src/app/core/towns';
import { BasicPopup } from 'src/app/features/shared/components';

@Component({
  selector: 'mw-build-popup',
  templateUrl: './build-popup.component.html',
  styleUrls: ['./build-popup.component.scss']
})
export class BuildPopupComponent extends BasicPopup<{ building: Building }> {

  constructor() {
    super();
    console.log(this.data.building.base.description);
  }


  public build(): void {
    this.data.building.built = true;
    this.close();
  }
}
