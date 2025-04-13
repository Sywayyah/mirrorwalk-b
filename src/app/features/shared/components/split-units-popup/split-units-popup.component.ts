import { Component, inject } from '@angular/core';
import { DisplayUnitGroupInfo } from 'src/app/core/events';
import { UnitGroup } from 'src/app/core/unit-types';
import { MwPlayersService } from 'src/app/features/services';
import { GameObjectsManager } from 'src/app/features/services/game-objects-manager.service';
import { EventsService } from 'src/app/store';
import { BasicPopup } from '../popup-container';

@Component({
  selector: 'mw-split-units-popup',
  templateUrl: './split-units-popup.component.html',
  standalone: false
})
export class SplitUnitsPopupComponent extends BasicPopup<{ unitGroup: UnitGroup }> {
  private readonly players = inject(MwPlayersService);
  private readonly gameObjects = inject(GameObjectsManager);
  private readonly events = inject(EventsService);

  toSplit = 0;

  upgadeValue(event: Event): void {
    this.toSplit = Number((event.target as HTMLInputElement).value);
  }

  displayUnitGroupInfo(): void {
    // recheck later migrate to cdk dialogs
    this.close();

    setTimeout(() => {
      this.events.dispatch(DisplayUnitGroupInfo({ unitGroup: this.data.unitGroup }));
    }, 0);
  }

  split(): void {
    if (this.toSplit === 0) {
      this.close();
      return;
    }

    const unitGroup = this.data.unitGroup;

    const currentHero = this.players.getCurrentPlayer().hero;

    const newUnitGroup = this.gameObjects.createNewGameObject(UnitGroup, { count: this.toSplit, unitBase: unitGroup.type, ownerHero: currentHero, isSplitted: true });

    currentHero.addUnitGroup(newUnitGroup);

    unitGroup.addUnitsCount(-this.toSplit);
    this.close();
  }

  closePopup(): void {
    this.close();
  }
}
