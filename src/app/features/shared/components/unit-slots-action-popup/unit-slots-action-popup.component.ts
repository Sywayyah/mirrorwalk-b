import { Component, inject } from '@angular/core';
import { UnitGroupSlot, swapUnitsInSlots } from 'src/app/core/heroes';
import { MwPlayersService } from 'src/app/features/services';
import { GameObjectsManager } from 'src/app/features/services/game-objects-manager.service';
import { BasicPopup } from '../popup-container';

@Component({
    selector: 'mw-unit-slots-action-popup',
    templateUrl: './unit-slots-action-popup.component.html',
    standalone: false
})
export class UnitSlotsActionPopupComponent extends BasicPopup<{
  sourceSlot: UnitGroupSlot;
  targetSlot: UnitGroupSlot;
  postAction: () => void;
}> {
  private readonly players = inject(MwPlayersService);
  private readonly gameObjects = inject(GameObjectsManager);

  swap(): void {
    swapUnitsInSlots(this.data.sourceSlot, this.data.targetSlot);

    this.data.postAction();
    this.close();
  }

  merge(): void {
    const currentHero = this.players.getCurrentPlayer().hero;

    const targetUnitGroup = this.data.targetSlot.unitGroup!;
    const sourceUnitGroup = this.data.sourceSlot.unitGroup!;

    // when unit groups are merged - take max mana and assign to target group
    const maxMana = Math.max(
      targetUnitGroup.getMana(),
      sourceUnitGroup.getMana()
    );

    targetUnitGroup.addUnitsCount(this.data.sourceSlot.unitGroup!.count);

    this.gameObjects.destroyObject(sourceUnitGroup);
    this.data.sourceSlot.unitGroup = null;
    currentHero.removeUnitGroup(sourceUnitGroup);
    targetUnitGroup.setMana(maxMana);

    this.data.postAction();
    this.close();
  }
}
