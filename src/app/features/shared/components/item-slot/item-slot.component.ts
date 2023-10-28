import { Component, Input, OnChanges } from '@angular/core';
import { GameEventsTypes, PlayerEquipsItem, PlayerReceivesItem, PlayerUnequipsItem } from 'src/app/core/events';
import { Hero } from 'src/app/core/heroes';
import { ExtendedSlotType, InventoryItems, Item, ItemSlotType } from 'src/app/core/items';
import { TypedChanges } from 'src/app/core/utils';
import { MwPlayersService } from 'src/app/features/services';
import { StoreClient, WireMethod } from 'src/app/store';
import { HintAttachment } from '../hints-container/hints-container.component';

@Component({
  selector: 'mw-item-slot',
  templateUrl: './item-slot.component.html',
  styleUrls: ['./item-slot.component.scss']
})
export class ItemSlotComponent extends StoreClient() implements OnChanges {

  @Input()
  public itemSlot!: ItemSlotType;

  @Input()
  public hintPos: HintAttachment = 'after';

  public slotInfo!: ExtendedSlotType;

  public isEquipped: boolean = false;

  public equippedItem: Item | null = null;

  public availableItemsForSlot: Item[] = [];

  private hero: Hero = this.playersService.getCurrentPlayer().hero;

  constructor(
    private playersService: MwPlayersService,
  ) {
    super();
  }

  public ngOnChanges(changes: TypedChanges<this>): void {
    const itemSlotChange = changes.itemSlot;

    if (itemSlotChange) {
      const itemSlot = itemSlotChange.currentValue;

      this.slotInfo = InventoryItems.getSlotExtendedInfo(itemSlot);

      const equippedItems = this.hero.inventory;

      this.isEquipped = equippedItems.isSlotEquipped(itemSlot);
      this.equippedItem = equippedItems.getItemInSlot(itemSlot);

      this.availableItemsForSlot = InventoryItems.filterItemsForSlot(itemSlot, this.hero.itemsBackpack);
    }
  }

  @WireMethod(PlayerReceivesItem)
  public updateItems(event: GameEventsTypes['PlayerReceivesItem']): void {
    if (event.item.baseType.slotType === this.itemSlot) {
      this.availableItemsForSlot = InventoryItems.filterItemsForSlot(this.itemSlot, this.hero.itemsBackpack);
    }
  }

  @WireMethod(PlayerEquipsItem)
  public updateSlotOnEquip(params: GameEventsTypes['PlayerEquipsItem']): void {
    if (params.item.baseType.slotType === this.itemSlot) {
      this.equippedItem = params.item;
      this.isEquipped = true;
    }
  }

  @WireMethod(PlayerUnequipsItem)
  public updateSlotOnUnequip(params: GameEventsTypes['PlayerUnequipsItem']): void {
    if (params.item.baseType.slotType === this.itemSlot) {
      this.equippedItem = null;
      this.isEquipped = false;
    }
  }

  public equipItem(item: Item<object>): void {
    if (this.equippedItem === item) {
      return;
    }

    if (this.equippedItem) {
      this.unequipSlot();
    }

    this.events.dispatch(PlayerEquipsItem({
      item: item,
      player: this.playersService.getCurrentPlayer(),
    }));
  }

  public unequipSlot(): void {
    if (!this.isEquipped) {
      return;
    }

    if (this.equippedItem) {
      this.events.dispatch(PlayerUnequipsItem({
        item: this.equippedItem,
        player: this.playersService.getCurrentPlayer(),
      }));
    }
  }

}
