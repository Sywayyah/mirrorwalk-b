import { Component, Input } from '@angular/core';
import { Item, ItemBaseModel } from 'src/app/core/items';
import { HintAttachment } from 'src/app/features/shared/components';

@Component({
  selector: 'mw-item-icon',
  templateUrl: './item-icon.component.html',
  styleUrls: ['./item-icon.component.scss'],
})
export class ItemIconComponent {
  // todo: getters?
  @Input() public set item(item: Item) {
    this._itemBase = item.baseType;
    this._item = item;
  };

  @Input() public set itemBase(itemBase: ItemBaseModel) {
    this._itemBase = itemBase;
  };

  @Input() public hintPos: HintAttachment = 'above';

  _item?: Item;
  _itemBase!: ItemBaseModel;
}
