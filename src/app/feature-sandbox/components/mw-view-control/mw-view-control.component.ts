import { Component, OnInit } from '@angular/core';
import { NeutralCampStructure, NeutralSite, StructureTypeEnum } from 'src/app/core/model/structures.types';
import { BattleEventsService, BattleEvent, PopupTypesEnum, PrefightPopup, PreviewPopup, StructSelected } from '../../services';

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
      [BattleEvent.Struct_Selected]: (event: StructSelected) => {

        if (event.struct.type === StructureTypeEnum.NeutralCamp) {
          const prefightPopup: PrefightPopup = {
            type: PopupTypesEnum.Prefight,
            struct: event.struct as NeutralCampStructure,
          };

          this.events.dispatchEvent({ type: BattleEvent.Display_Popup, popup: prefightPopup });
          return;
        }

        if (event.struct.type === StructureTypeEnum.NeutralSite) {
          const previewPopup: PreviewPopup = {
            type: PopupTypesEnum.Preview,
            struct: event.struct as NeutralSite,
          };

          this.events.dispatchEvent({ type: BattleEvent.Display_Popup, popup: previewPopup });
        }
      },

      [BattleEvent.Struct_Fight_Confirmed]: (event) => {
        this.currentView = ViewsEnum.Battleground;
      },

      [BattleEvent.Struct_Completed]: (event) => {
        event.struct.isInactive = true;
        this.currentView = ViewsEnum.Structures;
        this.events.dispatchEvent({ type: BattleEvent.Display_Reward_Popup, struct: event.struct });
      },
    }).subscribe();
  }

  ngOnInit(): void {
  }

}
