import { Component, OnInit } from '@angular/core';
import { Building, HiringActivity, Town } from 'src/app/core/towns';
import { BasicPopup } from 'src/app/features/shared/components';

interface HiringPopupData {
  building: Building;
  town: Town<any>;
  hiringActivity: HiringActivity;
}

@Component({
  selector: 'mw-hiring-popup',
  templateUrl: './hiring-popup.component.html',
  styleUrls: ['./hiring-popup.component.scss']
})
export class HiringPopupComponent extends BasicPopup<HiringPopupData> implements OnInit {

  constructor() {
    super();
  }

  ngOnInit(): void {
    console.log(this.data);
  }

}
