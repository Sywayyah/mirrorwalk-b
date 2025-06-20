import { ConnectionPositionPair } from '@angular/cdk/overlay';
import { Component, inject } from '@angular/core';
import { OpenGarrisonPopup, PlayerLeavesTown, ViewsEnum } from 'src/app/core/events';
import { ActivityTypes, Building, HiringActivity } from 'src/app/core/towns';
import { MwPlayersService } from 'src/app/features/services';
import { State } from 'src/app/features/services/state.service';
import { escapeToView } from 'src/app/features/services/utils/view.util';
import { PopupService } from 'src/app/features/shared/components';
import { EventsService } from 'src/app/store';
import { BuildPopupComponent } from '../build-popup/build-popup.component';
import { HiringPopupComponent } from '../hiring-popup/hiring-popup.component';
import { ItemsSellingPopupComponent } from '../items-selling-popup/items-selling-popup.component';
import { MarketDialogComponent } from '../market-dialog/market-dialog.component';
import { isFeatureEnabled } from 'src/app/core/config';
import { Feature } from 'src/app/core/config/types';
import { Dialog } from '@angular/cdk/dialog';
import { HallsOfFateComponent } from '../halls-of-fate/halls-of-fate.component';

@Component({
  selector: 'mw-town-view',
  templateUrl: './town-view.component.html',
  styleUrls: ['./town-view.component.scss'],
  standalone: false,
})
export class TownViewComponent {
  private readonly players = inject(MwPlayersService);
  private readonly state = inject(State);
  private readonly events = inject(EventsService);
  private readonly popupService = inject(PopupService);
  private readonly dialogsService = inject(Dialog);

  readonly newTownSystemEnabled = isFeatureEnabled(Feature.NewTownSystem);

  public readonly menuPosition = [
    new ConnectionPositionPair({ originX: 'center', originY: 'top' }, { overlayX: 'center', overlayY: 'bottom' }),
  ];
  public buildingsByTiers: Record<number, Building[]> = {};
  public readonly town = this.state.createdGame.town;
  public readonly builtColor: string = this.state.createdGame.selectedColor;

  constructor() {
    escapeToView(ViewsEnum.Structures);

    this.buildingsByTiers = Object.entries(this.town.base.availableBuildings).reduce(
      (map, [id, building]) => {
        if (!map[building.tier]) {
          map[building.tier] = [this.town.buildings[id]];
        } else {
          map[building.tier].push(this.town.buildings[id]);
        }
        return map;
      },
      {} as Record<number, Building[]>,
    );
  }

  public leaveTown(): void {
    this.events.dispatch(PlayerLeavesTown({}));
  }

  public handleBuildingClicked(building: Building): void {
    // console.log('town --->', this.town);
    // console.log('building: ', building);
    if (!building.built) {
      this.popupService.createBasicPopup({
        component: BuildPopupComponent,
        data: {
          building,
          targetLevel: 1,
        },
        class: 'dark',
      });

      return;
    }

    const activity = building.currentBuilding.activity;

    if (!activity) {
      return;
    }

    switch (activity.type) {
      case ActivityTypes.Hiring:
        const hiringActivity = activity as HiringActivity;

        this.popupService.createBasicPopup({
          component: HiringPopupComponent,
          data: { building, town: this.town, hiringActivity },
          // class: 'dark',
        });
        break;
      case ActivityTypes.ItemsSelling:
        this.popupService.createBasicPopup({
          component: ItemsSellingPopupComponent,
          data: { building },
        });
        break;
      case ActivityTypes.Garrison:
        if (this.players.getCurrentPlayer().garrisons) {
          this.events.dispatch(OpenGarrisonPopup());
        }
        break;
      case ActivityTypes.ResourceTrading:
        this.popupService.createBasicPopup({
          component: MarketDialogComponent,
          data: { town: this.town },
        });
        break;

      case ActivityTypes.HallsOfFate:
        this.dialogsService.open(HallsOfFateComponent, { data: { town: this.town, building } });
        break;
    }
  }
}
