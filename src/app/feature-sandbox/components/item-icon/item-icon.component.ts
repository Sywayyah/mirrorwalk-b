import { Component, Input, OnInit } from '@angular/core';
import { ItemInstanceModel } from 'src/app/core/model/items/items.types';
import { HintAttachment } from '../ui-elements';

@Component({
  selector: 'mw-item-icon',
  templateUrl: './item-icon.component.html',
  styleUrls: ['./item-icon.component.scss']
})
export class ItemIconComponent implements OnInit {

  @Input() public item!: ItemInstanceModel;
  @Input() public hintPos!: HintAttachment;

  constructor() { }

  ngOnInit(): void {
  }

}
