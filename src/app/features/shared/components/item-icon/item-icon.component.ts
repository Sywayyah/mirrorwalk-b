import { Component, Input } from '@angular/core';
import { Item, ItemBaseType } from 'src/app/core/items';
import { HintAttachment } from 'src/app/features/shared/components';

@Component({
    selector: 'mw-item-icon',
    templateUrl: './item-icon.component.html',
    styleUrls: ['./item-icon.component.scss'],
    standalone: false
})
export class ItemIconComponent {
  // todo: getters?
  @Input() public set item(item: Item) {
    this._itemBase = item.baseType;
    this._item = item;
  };

  @Input() public set itemBase(itemBase: ItemBaseType) {
    this._itemBase = itemBase;
  };

  @Input() public hintPos: HintAttachment = 'above';

  _item?: Item;
  _itemBase!: ItemBaseType;
}
