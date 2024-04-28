import { Component, inject } from '@angular/core';
import { UnitGroupSlot, swapUnitsInSlots } from 'src/app/core/heroes';
import { MwPlayersService } from 'src/app/features/services';
import { GameObjectsManager } from 'src/app/features/services/game-objects-manager.service';
import { BasicPopup } from '../popup-container';

@Component({
  selector: 'mw-unit-slots-action-popup',
  templateUrl: './unit-slots-action-popup.component.html',
})
export class UnitSlotsActionPopupComponent extends BasicPopup<{ sourceSlot: UnitGroupSlot, targetSlot: UnitGroupSlot, postAction: () => void }>{
  private readonly players = inject(MwPlayersService);
  private readonly gameObjects = inject(GameObjectsManager);

  swap(): void {
    swapUnitsInSlots(this.data.sourceSlot, this.data.targetSlot);

    this.data.postAction();
    this.close();
  }

  merge(): void {
    const currentHero = this.players.getCurrentPlayer().hero;

    this.data.targetSlot.unitGroup!.addUnitsCount(this.data.sourceSlot.unitGroup!.count);
    this.gameObjects.destroyObject(this.data.sourceSlot.unitGroup!);
    this.data.sourceSlot.unitGroup = null;
    currentHero.removeUnitGroup(this.data.sourceSlot.unitGroup!);

    this.data.postAction();
    this.close();
  }
}
