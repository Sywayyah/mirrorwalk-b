import { Component, inject } from '@angular/core';
import { UnitGroup } from 'src/app/core/unit-types';
import { MwPlayersService } from 'src/app/features/services';
import { GameObjectsManager } from 'src/app/features/services/game-objects-manager.service';
import { BasicPopup } from '../popup-container';

@Component({
  selector: 'mw-split-units-popup',
  templateUrl: './split-units-popup.component.html',
})
export class SplitUnitsPopupComponent extends BasicPopup<{ unitGroup: UnitGroup }> {
  private readonly players = inject(MwPlayersService);
  private readonly gameObjects = inject(GameObjectsManager);

  toSplit = 0;

  upgadeValue(event: Event): void {
    this.toSplit = Number((event.target as HTMLInputElement).value);
  }

  split(): void {
    if (this.toSplit === 0) {
      this.close();
      return;
    }

    const unitGroup = this.data.unitGroup;

    const currentHero = this.players.getCurrentPlayer().hero;

    const newUnitGroup = this.gameObjects.createNewGameObject(UnitGroup, { count: this.toSplit, unitBase: unitGroup.type, ownerHero: currentHero });

    currentHero.addUnitGroup(newUnitGroup);

    unitGroup.addUnitsCount(-this.toSplit);
    this.close();
  }

  closePopup(): void {
    this.close();
  }
}
