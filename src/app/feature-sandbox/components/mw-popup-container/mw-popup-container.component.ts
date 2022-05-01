import { Component, ElementRef, OnInit, TemplateRef } from '@angular/core';
import { BattleEventsService, BattleEventTypeEnum } from '../../services';


interface PopupModel {
  isWin: boolean;
}

@Component({
  selector: 'mw-popup-container',
  templateUrl: './mw-popup-container.component.html',
  styleUrls: ['./mw-popup-container.component.scss']
})
export class MwPopupContainerComponent implements OnInit {

  public popups: PopupModel[] = [];

  constructor(
    private readonly battleEvents: BattleEventsService,
  ) {
    this.battleEvents.onEvent(BattleEventTypeEnum.Fight_Ends).subscribe(event => {
      this.popups.push(
        {
          isWin: event.win,
          
        }
      );
    });
  }

  ngOnInit(): void {
  }

}
