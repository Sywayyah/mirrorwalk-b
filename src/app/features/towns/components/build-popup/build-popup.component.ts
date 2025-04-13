import { Component, inject } from '@angular/core';
import { InitBuilding } from 'src/app/core/events';
import { FormattedResource, Resources, formattedResources, getFactoredResources } from 'src/app/core/resources';
import { Building, BuildingLevel, TownEvents } from 'src/app/core/towns';
import { MwPlayersService } from 'src/app/features/services';
import { State } from 'src/app/features/services/state.service';
import { BasicPopup } from 'src/app/features/shared/components';
import { EventsService } from 'src/app/store';

@Component({
  selector: 'mw-build-popup',
  templateUrl: './build-popup.component.html',
  styleUrls: ['./build-popup.component.scss'],
  standalone: false
})
export class BuildPopupComponent extends BasicPopup<{ building: Building, targetLevel: number }> {
  private players = inject(MwPlayersService);
  private events = inject(EventsService);
  private state = inject(State);

  public cost: FormattedResource[];
  // public missingCost: FormattedResource[];

  public canBuild: boolean;

  public buildingLevel: BuildingLevel;
  public missingCostMap: Resources;

  private readonly costFactor = this.players.getCurrentPlayer().hero.modGroup.getCalcNumModValueOrZero('townBuildingCostFactor');

  constructor() {
    super();

    const building = this.data.building;

    this.buildingLevel = building.base.levels[this.data.targetLevel - 1];

    const buildingCost = this.getBuildingCost();
    this.cost = formattedResources(buildingCost);

    this.missingCostMap = this.players.getMissingResources(this.players.getCurrentPlayer(), buildingCost);

    this.canBuild = this.players.playerHasResources(
      this.players.getCurrentPlayer(),
      buildingCost,
    );
  }

  public build(): void {
    const building = this.data.building;

    if (this.data.targetLevel === 1) {
      building.built = true;
    } else {
      building.currentLevel = this.data.targetLevel - 1;
      building.currentBuilding = building.base.levels[this.data.targetLevel - 1].building;
    }

    this.events.dispatch(InitBuilding({
      building,
      player: this.players.getCurrentPlayer(),
    }));

    this.players.removeResourcesFromPlayer(
      this.players.getCurrentPlayer(),
      this.getBuildingCost(),
    );
    this.state.eventHandlers.buildings.triggerRefEventHandlers(this.data.building, TownEvents.Built());

    this.close();
  }

  private getBuildingCost(): Resources {
    // const building = this.data.building;

    return getFactoredResources(this.buildingLevel.cost, this.costFactor);
  }
}
