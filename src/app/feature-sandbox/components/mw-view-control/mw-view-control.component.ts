import { Component } from '@angular/core';
import { NeutralCampStructure, NeutralSite, StructureTypeEnum } from 'src/app/core/model/structures.types';
import { PrefightPopup, PopupTypesEnum, PreviewPopup, UpgradingPopup } from '../../services';
// import { PrefightPopup, PopupTypesEnum, BattleEvent, PreviewPopup, UpgradingPopup, StructureFightConfirmed, StructCompleted } from '../../services';
// import { BattleEvent, PopupTypesEnum, PrefightPopup, PreviewPopup, StructCompleted, StructSelected, StructureFightConfirmed, UpgradingPopup } from '../../services';
import { EventsService, Notify, StoreClient, WireMethod } from '../../services/state';
import { GameStoreClient } from '../../services/state-old/game-state.service';
import { WireEvent } from '../../services/state-old/store-decorators.config';
import { DisplayPopup, DisplayReward, NeutralStructParams, StructCompleted, StructFightConfirmed, StructSelected, StructSelectedEvent } from '../../services/state-values/game-events';
// import { StructSelected, StructSelected, StructSelected } from '../../services/state-values/game-events';

enum ViewsEnum {
  Structures = 'structures',
  Battleground = 'battleground',
}

@Component({
  selector: 'mw-view-control',
  templateUrl: './mw-view-control.component.html',
  styleUrls: ['./mw-view-control.component.scss'],
})
export class MwViewControlComponent extends StoreClient() {

  /*
    I need to complete this view logic, the logic of battle being
      initiated. Also, I need to implement some kind of rewards
      system. At least, resources and random units.
  */

  public currentView: ViewsEnum = ViewsEnum.Structures;
  public viewTypes: typeof ViewsEnum = ViewsEnum;

  constructor(
    private newEvents: EventsService,
  ) {
    super();
  }
  // @WireEvent(BattleEvent.Struct_Selected)
  // public playerSelectsStructure(event: StructSelected): void {
  //   if (event.struct.type === StructureTypeEnum.NeutralCamp) {
  //     const prefightPopup: PrefightPopup = {
  //       type: PopupTypesEnum.Prefight,
  //       struct: event.struct as NeutralCampStructure,
  //     };

  //     this.events().dispatchEvent({ type: BattleEvent.Display_Popup, popup: prefightPopup });
  //     return;
  //   }

  //   if (event.struct.type === StructureTypeEnum.NeutralSite) {
  //     if (event.struct.generator.onVisited) {
  //       const previewPopup: PreviewPopup = {
  //         type: PopupTypesEnum.Preview,
  //         struct: event.struct as NeutralSite,
  //       };

  //       this.events().dispatchEvent({ type: BattleEvent.Display_Popup, popup: previewPopup });
  //     } else {
  //       const upgradingPopup: UpgradingPopup = {
  //         type: PopupTypesEnum.UpgradingReward,
  //         struct: event.struct as NeutralSite,
  //       };

  //       this.events().dispatchEvent({ type: BattleEvent.Display_Popup, popup: upgradingPopup });
  //     }
  //   }
  // }

  // @WireEvent(BattleEvent.Struct_Fight_Confirmed)
  // public playerAcceptsFight(event: StructureFightConfirmed): void {
  //   this.currentView = ViewsEnum.Battleground;
  // }

  // @WireEvent(BattleEvent.Struct_Completed)
  // public structIsCompleted(event: StructCompleted): void {
  //   event.struct.isInactive = true;
  //   this.currentView = ViewsEnum.Structures;
  //   this.events().dispatchEvent({ type: BattleEvent.Display_Reward_Popup, struct: event.struct });
  // }

  @WireMethod(StructSelected)
  public playerSelectsStructure(event: StructSelectedEvent): void {
    if (event.struct.type === StructureTypeEnum.NeutralCamp) {
      const prefightPopup: PrefightPopup = {
        type: PopupTypesEnum.Prefight,
        struct: event.struct as NeutralCampStructure,
      };

      // this.events().dispatchEvent({ type: BattleEvent.Display_Popup, popup: prefightPopup });
      this.newEvents.dispatch(DisplayPopup({
        popup: prefightPopup
      }));
      return;
    }

    if (event.struct.type === StructureTypeEnum.NeutralSite) {
      if (event.struct.generator.onVisited) {
        const previewPopup: PreviewPopup = {
          type: PopupTypesEnum.Preview,
          struct: event.struct as NeutralSite,
        };

        // this.events().dispatchEvent({ type: BattleEvent.Display_Popup, popup: previewPopup });
        this.newEvents.dispatch(DisplayPopup({
          popup: previewPopup
        }));
      } else {
        const upgradingPopup: UpgradingPopup = {
          type: PopupTypesEnum.UpgradingReward,
          struct: event.struct as NeutralSite,
        };

        // this.events().dispatchEvent({ type: BattleEvent.Display_Popup, popup: upgradingPopup });
        this.newEvents.dispatch(DisplayPopup({
          popup: upgradingPopup,
        }));
      }
    }
  }

  @Notify(StructFightConfirmed)
  public playerAcceptsFight(): void {
    this.currentView = ViewsEnum.Battleground;
  }

  @WireMethod(StructCompleted)
  public structIsCompleted(event: NeutralStructParams): void {
    event.struct.isInactive = true;
    this.currentView = ViewsEnum.Structures;
    // this.events().dispatchEvent({ type: BattleEvent.Display_Reward_Popup, struct: event.struct });
    this.newEvents.dispatch(DisplayReward({
      struct: event.struct
    }));
  }
}
