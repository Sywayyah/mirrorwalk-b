import { Component, computed, inject, signal } from '@angular/core';
import { resolveEntities } from 'src/app/core/entities';
import { PlayerLosesItem, PlayerReceivesItem } from 'src/app/core/events';
import { Item, ItemBaseModel } from 'src/app/core/items';
import { Building, SellingBuildingData } from 'src/app/core/towns';
import { CommonUtils } from 'src/app/core/utils';
import { MwItemsService, MwPlayersService } from 'src/app/features/services';
import { BasicPopup } from 'src/app/features/shared/components';
import { EventsService } from 'src/app/store';

@Component({
    selector: 'mw-items-selling-popup',
    templateUrl: './items-selling-popup.component.html',
    styleUrl: './items-selling-popup.component.scss',
    standalone: false
})
export class ItemsSellingPopupComponent extends BasicPopup<{ building: Building }> {
  readonly players = inject(MwPlayersService);
  readonly itemsService = inject(MwItemsService);
  readonly events = inject(EventsService);

  readonly currentPlayer = this.players.getCurrentPlayer();
  readonly hero = this.currentPlayer.hero;

  private readonly sellingData = this.data.building.getCustomData<SellingBuildingData>();

  items = resolveEntities<ItemBaseModel>(this.sellingData?.items!);
  allowsSelling = this.sellingData?.selling;

  itemToBuy = signal<ItemBaseModel | null>(null);
  itemToSell = signal<Item | null>(null);

  canBuy = computed(() => {
    const itemToBuy = this.itemToBuy();
    // todo: quick workaround, to recalculate when itemToSell changes
    this.itemToSell();

    return !!itemToBuy && this.players.playerHasResources(this.currentPlayer, itemToBuy.cost!);
  });

  canSell = computed(() => {
    const itemToSell = this.itemToSell();
    return !!itemToSell;
  });

  buyItem(): void {
    const itemToBuy = this.itemToBuy()!;
    const newItem = this.itemsService.createItem(itemToBuy);

    this.players.removeResourcesFromPlayer(this.currentPlayer, itemToBuy.cost || {});
    this.events.dispatch(PlayerReceivesItem({ item: newItem, player: this.currentPlayer }));

    CommonUtils.removeItem(this.items, itemToBuy);
    this.itemToBuy.set(null);
  }

  sellItem(): void {
    const item = this.itemToSell()!;

    this.players.addResourcesToPlayer(this.currentPlayer, item.baseType.sellingCost || {});
    this.events.dispatch(PlayerLosesItem({ item: item, player: this.currentPlayer }));

    this.itemToSell.set(null);
  }
}
