import { Component } from '@angular/core';
import { FormattedResource, formattedResources, Resources } from 'src/app/core/resources';
import { BuidlingBase, Building, BuildingLevel } from 'src/app/core/towns';
import { MwPlayersService } from 'src/app/features/services';
import { BasicPopup } from 'src/app/features/shared/components';

@Component({
  selector: 'mw-build-popup',
  templateUrl: './build-popup.component.html',
  styleUrls: ['./build-popup.component.scss']
})
export class BuildPopupComponent extends BasicPopup<{ building: Building, targetLevel: number }> {

  public cost: FormattedResource[];
  public missingCost: FormattedResource[];

  public canBuild: boolean;

  public buildingLevel: BuildingLevel;

  constructor(
    private players: MwPlayersService,
  ) {
    super();
    const building = this.data.building;

    this.buildingLevel = building.base.levels[this.data.targetLevel - 1];

    const buildingCost = this.getBuildingCost();
    this.cost = formattedResources(buildingCost);

    this.missingCost = formattedResources(
      this.players.getMissingResources(this.players.getCurrentPlayer(), buildingCost)
    );

    this.canBuild = this.players.playerHasResources(
      this.players.getCurrentPlayer(),
      buildingCost,
    );
  }

  public build(): void {
    if (this.data.targetLevel === 1) {
      this.data.building.built = true;
    } else {
      this.data.building.currentLevel = this.data.targetLevel - 1;
      this.data.building.currentBuilding = this.data.building.base.levels[this.data.targetLevel - 1].building;
    }

    this.players.removeResourcesFromPlayer(
      this.players.getCurrentPlayer(),
      this.getBuildingCost(),
    )
    this.close();
  }

  private getBuildingCost(): Resources {
    // const building = this.data.building;

    return this.buildingLevel.cost;
  }
}
