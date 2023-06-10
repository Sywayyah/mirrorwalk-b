import { Component, Input } from '@angular/core';
import { ItemObject } from 'src/app/core/items';
import { HintAttachment } from 'src/app/features/shared/components';

@Component({
  selector: 'mw-item-icon',
  templateUrl: './item-icon.component.html',
  styleUrls: ['./item-icon.component.scss']
})
export class ItemIconComponent {

  @Input() public item!: ItemObject;
  @Input() public hintPos!: HintAttachment;

  constructor() { }

}
