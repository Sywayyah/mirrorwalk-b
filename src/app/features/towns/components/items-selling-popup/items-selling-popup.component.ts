import { Component, computed, inject, signal } from '@angular/core';
import { Item, ItemBaseModel } from 'src/app/core/items';
import { Building, SellingBuildingData } from 'src/app/core/towns';
import { CommonUtils } from 'src/app/core/utils';
import { MwItemsService, MwPlayersService } from 'src/app/features/services';
import { BasicPopup } from 'src/app/features/shared/components';

@Component({
  selector: 'mw-items-selling-popup',
  templateUrl: './items-selling-popup.component.html',
  styleUrl: './items-selling-popup.component.scss',
})
export class ItemsSellingPopupComponent extends BasicPopup<{ building: Building }> {
  readonly players = inject(MwPlayersService);
  readonly itemsService = inject(MwItemsService);

  readonly hero = this.players.getCurrentPlayer().hero;

  private readonly sellingData = this.data.building.getCustomData<SellingBuildingData>();

  items = this.sellingData?.items!;
  allowsSelling = this.sellingData?.selling;

  itemToBuy = signal<ItemBaseModel | null>(null);
  itemToSell = signal<Item | null>(null);

  canBuy = computed(() => {
    const itemToBuy = this.itemToBuy();
    // todo: quick workaround, to recalculate when itemToSell changes
    this.itemToSell();

    return !!itemToBuy && this.players.playerHasResources(this.players.getCurrentPlayer(), itemToBuy.cost!);
  });

  canSell = computed(() => {
    const itemToSell = this.itemToSell();
    return !!itemToSell;
  });

  buyItem(): void {
    const itemToBuy = this.itemToBuy()!;
    const newItem = this.itemsService.createItem(itemToBuy);
    this.players.removeResourcesFromPlayer(this.players.getCurrentPlayer(), itemToBuy.cost || {});
    this.hero.addItem(newItem);
    CommonUtils.removeItem(this.items, itemToBuy);
    this.itemToBuy.set(null);
  }

  sellItem(): void {
    const item = this.itemToSell()!;
    const currentPlayer = this.players.getCurrentPlayer();
    this.players.addResourcesToPlayer(currentPlayer, item.baseType.sellingCost || {});
    this.hero.removeItem(item);
    this.itemToSell.set(null);
  }
}
