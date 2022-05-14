import { Component, OnInit } from '@angular/core';
import { BattleEventsService, BattleEventTypeEnum, PopupTypesEnum, PrefightPopup, StructSelected } from '../../services';

enum ViewsEnum {
  Structures = 'structures',
  Battleground = 'battleground',
}

@Component({
  selector: 'mw-view-control',
  templateUrl: './mw-view-control.component.html',
  styleUrls: ['./mw-view-control.component.scss']
})
export class MwViewControlComponent implements OnInit {

  /*
    I need to complete this view logic, the logic of battle being
      initiated. Also, I need to implement some kind of rewards
      system. At least, resources and random units.
  */

  public currentView: ViewsEnum = ViewsEnum.Structures;
  public viewTypes: typeof ViewsEnum = ViewsEnum;

  constructor(
    private readonly events: BattleEventsService,
  ) {
    this.events.onEvents({
      [BattleEventTypeEnum.Struct_Selected]: (event: StructSelected) => {
        const prefightPopup: PrefightPopup = {
          type: PopupTypesEnum.Prefight,
          struct: event.struct,
        };

        this.events.dispatchEvent({ type: BattleEventTypeEnum.Display_Popup, popup: prefightPopup });
      },
      [BattleEventTypeEnum.Struct_Fight_Confirmed]: event => {
        this.currentView = ViewsEnum.Battleground;
      },
      [BattleEventTypeEnum.Struct_Completed]: (event) => {
        event.struct.isDefeated = true;
        this.currentView = ViewsEnum.Structures;
        this.events.dispatchEvent({ type: BattleEventTypeEnum.Display_Reward_Popup, struct: event.struct });
      },
    }).subscribe();
  }

  ngOnInit(): void {
  }

}
