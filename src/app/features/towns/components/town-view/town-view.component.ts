import { Component } from '@angular/core';
import { PlayerLeavesTown } from 'src/app/core/events';
import { ActivityTypes, Building, HiringActivity } from 'src/app/core/towns';
import { State } from 'src/app/features/services/state.service';
import { PopupService } from 'src/app/features/shared/components';
import { EventsService } from 'src/app/store';
import { BuildPopupComponent } from '../build-popup/build-popup.component';
import { HiringPopupComponent } from '../hiring-popup/hiring-popup.component';
import { ItemsSellingPopupComponent } from '../items-selling-popup/items-selling-popup.component';

@Component({
  selector: 'mw-town-view',
  templateUrl: './town-view.component.html',
  styleUrls: ['./town-view.component.scss'],
})
export class TownViewComponent {
  public buildingsByTiers: Record<number, Building[]> = {};
  public town = this.state.createdGame.town;
  public builtColor: string = this.state.createdGame.selectedColor;

  constructor(
    private state: State,
    private events: EventsService,
    private popupService: PopupService
  ) {
    this.buildingsByTiers = Object.entries(
      this.town.base.availableBuildings
    ).reduce((map, [id, building]) => {
      if (!map[building.tier]) {
        map[building.tier] = [this.town.buildings[id]];
      } else {
        map[building.tier].push(this.town.buildings[id]);
      }
      return map;
    }, {} as Record<number, Building[]>);
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

    if (activity) {
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
      }
    }
  }
}
