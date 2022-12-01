import { Component } from '@angular/core';
import { NeutralCampStructure, NeutralSite, StructureTypeEnum } from 'src/app/core/structures';
import { PrefightPopup, PreviewPopup, UpgradingPopup } from 'src/app/core/ui';
import { PreFightPopupComponent, PreviewPopupComponent, UpgradeRewardPopup } from 'src/app/features/battleground/components';
import { DisplayPopup, DisplayReward, NeutralStructParams, StructCompleted, StructFightConfirmed, StructSelected, StructSelectedEvent } from 'src/app/features/services/events';
import { Notify, StoreClient, WireMethod } from 'src/app/store';

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
  public currentView: ViewsEnum = ViewsEnum.Structures;
  public viewTypes: typeof ViewsEnum = ViewsEnum;

  @WireMethod(StructSelected)
  public playerSelectsStructure(event: StructSelectedEvent): void {
    if (event.struct.type === StructureTypeEnum.NeutralCamp) {
      const prefightPopup: PrefightPopup = {
        struct: event.struct as NeutralCampStructure,
      };


      this.events.dispatch(DisplayPopup({
        component: PreFightPopupComponent,
        popup: prefightPopup
      }));
      return;
    }

    if (event.struct.type === StructureTypeEnum.NeutralSite) {
      if (event.struct.generator.onVisited) {
        const previewPopup: PreviewPopup = {
          struct: event.struct as NeutralSite,
        };

        this.events.dispatch(DisplayPopup({
          component: PreviewPopupComponent,
          popup: previewPopup
        }));

        return;
      }

      const upgradingPopup: UpgradingPopup = {
        struct: event.struct as NeutralSite,
      };

      this.events.dispatch(DisplayPopup({
        component: UpgradeRewardPopup,
        popup: upgradingPopup,
      }));

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

    this.events.dispatch(DisplayReward({
      struct: event.struct
    }));
  }
}
