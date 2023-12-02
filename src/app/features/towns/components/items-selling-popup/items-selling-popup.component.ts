import { Component, inject } from '@angular/core';
import { Building, SellingBuildingData } from 'src/app/core/towns';
import { MwPlayersService } from 'src/app/features/services';
import { GameObjectsManager } from 'src/app/features/services/game-objects-manager.service';
import { BasicPopup } from 'src/app/features/shared/components';

@Component({
  selector: 'mw-items-selling-popup',
  templateUrl: './items-selling-popup.component.html',
  styleUrl: './items-selling-popup.component.scss',
})
export class ItemsSellingPopupComponent extends BasicPopup<{ building: Building }> {
  readonly gameObjects = inject(GameObjectsManager);
  readonly players = inject(MwPlayersService);

  hero = this.players.getCurrentPlayer().hero;
  items = this.gameObjects.getCustomData<SellingBuildingData>(this.data.building.id)?.items;
  allowsSelling = this.gameObjects.getCustomData<SellingBuildingData>(this.data.building.id)?.selling;
}
