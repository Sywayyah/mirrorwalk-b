import { Component } from '@angular/core';
import { NeutralCampStructure, NeutralSite, StructureTypeEnum } from 'src/app/core/model/structures.types';
import { BattleEvent, PopupTypesEnum, PrefightPopup, PreviewPopup, StructCompleted, StructSelected, StructureFightConfirmed, UpgradingPopup } from '../../services';
import { GameStoreClient } from '../../services/state/game-state.service';
import { WireEvent } from '../../services/state/store-decorators.config';

enum ViewsEnum {
  Structures = 'structures',
  Battleground = 'battleground',
}

@Component({
  selector: 'mw-view-control',
  templateUrl: './mw-view-control.component.html',
  styleUrls: ['./mw-view-control.component.scss']
})
export class MwViewControlComponent extends GameStoreClient() {

  /*
    I need to complete this view logic, the logic of battle being
      initiated. Also, I need to implement some kind of rewards
      system. At least, resources and random units.
  */

  public currentView: ViewsEnum = ViewsEnum.Structures;
  public viewTypes: typeof ViewsEnum = ViewsEnum;


  @WireEvent(BattleEvent.Struct_Selected)
  public playerSelectsStructure(event: StructSelected): void {
    if (event.struct.type === StructureTypeEnum.NeutralCamp) {
      const prefightPopup: PrefightPopup = {
        type: PopupTypesEnum.Prefight,
        struct: event.struct as NeutralCampStructure,
      };

      this.events().dispatchEvent({ type: BattleEvent.Display_Popup, popup: prefightPopup });
      return;
    }

    if (event.struct.type === StructureTypeEnum.NeutralSite) {
      if (event.struct.generator.onVisited) {
        const previewPopup: PreviewPopup = {
          type: PopupTypesEnum.Preview,
          struct: event.struct as NeutralSite,
        };

        this.events().dispatchEvent({ type: BattleEvent.Display_Popup, popup: previewPopup });
      } else {
        const upgradingPopup: UpgradingPopup = {
          type: PopupTypesEnum.UpgradingReward,
          struct: event.struct as NeutralSite,
        };

        this.events().dispatchEvent({ type: BattleEvent.Display_Popup, popup: upgradingPopup });
      }
    }
  }

  @WireEvent(BattleEvent.Struct_Fight_Confirmed)
  public playerAcceptsFight(event: StructureFightConfirmed): void {
    this.currentView = ViewsEnum.Battleground;
  }

  @WireEvent(BattleEvent.Struct_Completed)
  public structIsCompleted(event: StructCompleted): void {
    event.struct.isInactive = true;
    this.currentView = ViewsEnum.Structures;
    this.events().dispatchEvent({ type: BattleEvent.Display_Reward_Popup, struct: event.struct });

  }
}
