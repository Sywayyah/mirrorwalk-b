import { Component } from '@angular/core';
import { FormattedResource, formattedResources } from 'src/app/core/resources';
import { Building } from 'src/app/core/towns';
import { MwPlayersService } from 'src/app/features/services';
import { BasicPopup } from 'src/app/features/shared/components';

@Component({
  selector: 'mw-build-popup',
  templateUrl: './build-popup.component.html',
  styleUrls: ['./build-popup.component.scss']
})
export class BuildPopupComponent extends BasicPopup<{ building: Building }> {

  public cost: FormattedResource[];
  public missingCost: FormattedResource[];

  public canBuild: boolean;

  constructor(
    private players: MwPlayersService,
  ) {
    super();
    const building = this.data.building;

    const buildingCost = building.base.levels[building.currentLevel].cost;
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
    this.data.building.built = true;
    this.close();
  }
}
