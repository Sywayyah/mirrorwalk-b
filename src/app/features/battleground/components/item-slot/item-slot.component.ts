import { Component, Input, OnChanges } from '@angular/core';
import { PlayerEquipsItem, PlayerUnequipsItem } from 'src/app/core/events';
import { Hero } from 'src/app/core/heroes';
import { ExtendedSlotType, InventoryItems, ItemInstanceModel, ItemSlotType } from 'src/app/core/items';
import { TypedChanges } from 'src/app/core/utils';
import { MwPlayersService } from 'src/app/features/services';
import { StoreClient } from 'src/app/store';

@Component({
  selector: 'mw-item-slot',
  templateUrl: './item-slot.component.html',
  styleUrls: ['./item-slot.component.scss']
})
export class ItemSlotComponent extends StoreClient() implements OnChanges {

  @Input()
  public itemSlot!: ItemSlotType;

  public slotInfo!: ExtendedSlotType;

  public isEquipped: boolean = false;

  public equippedItem: ItemInstanceModel | null = null;

  public availableItemsForSlot: ItemInstanceModel[] = [];

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

      this.availableItemsForSlot = InventoryItems.filterItemsForSlot(itemSlot, this.hero.items);
    }
  }

  public equipItem(item: ItemInstanceModel<object>): void {
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

    this.equippedItem = item;
    this.isEquipped = true;
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

      this.equippedItem = null;
      this.isEquipped = false;
    }
  }

}
