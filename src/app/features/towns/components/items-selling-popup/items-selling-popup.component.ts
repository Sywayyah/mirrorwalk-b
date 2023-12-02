import { Component, inject } from '@angular/core';
import { ItemBaseModel } from 'src/app/core/items';
import { Building } from 'src/app/core/towns';
import { GameObjectsManager } from 'src/app/features/services/game-objects-manager.service';
import { BasicPopup } from 'src/app/features/shared/components';

@Component({
  selector: 'mw-items-selling-popup',
  templateUrl: './items-selling-popup.component.html',
  styleUrl: './items-selling-popup.component.scss',
})
export class ItemsSellingPopupComponent extends BasicPopup<{ building: Building }> {
  readonly gameObjects = inject(GameObjectsManager);

  items = this.gameObjects.getCustomData<{ items: ItemBaseModel[] }>(this.data.building.id)?.items;
}
