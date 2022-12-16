import { Component } from '@angular/core';
import { BuidlingBase, Building } from 'src/app/core/towns';
import { PlayerLeavesTown } from 'src/app/features/services/events';
import { State } from 'src/app/features/services/state.service';
import { PopupService } from 'src/app/features/shared/components';
import { EventsService } from 'src/app/store';
import { BuildPopupComponent } from '../build-popup/build-popup.component';

@Component({
  selector: 'mw-town-view',
  templateUrl: './town-view.component.html',
  styleUrls: ['./town-view.component.scss']
})
export class TownViewComponent {

  public buildingsByTiers: Record<number, Building[]> = {};
  public town = this.state.createdGame.town;
  public builtColor: string = this.state.createdGame.selectedColor;

  constructor(
    private state: State,
    private events: EventsService,
    private popupService: PopupService,
  ) {
    this.buildingsByTiers = Object.entries(this.town.base.availableBuildings).reduce((map, [id, building]) => {
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
    console.log('building: ', building);
    if (!building.built) {
      this.popupService.createBasicPopup({
        component: BuildPopupComponent,
        popup: {
          building,
        },
      });
    }

  }
}