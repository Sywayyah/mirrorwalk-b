import { Component, OnInit } from '@angular/core';
import { BasicPopup } from 'src/app/features/shared/components';

@Component({
  selector: 'mw-hiring-popup',
  templateUrl: './hiring-popup.component.html',
  styleUrls: ['./hiring-popup.component.scss']
})
export class HiringPopupComponent extends BasicPopup<{}> implements OnInit {

  constructor() {
    super();
  }

  ngOnInit(): void {
  }

}
