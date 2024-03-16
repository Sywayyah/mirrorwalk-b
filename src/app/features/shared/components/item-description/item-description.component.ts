import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Item, ItemBaseModel } from 'src/app/core/items';
import { DescriptionElement } from 'src/app/core/ui/descriptions';

@Component({
  selector: 'mw-item-description',
  templateUrl: './item-description.component.html',
  styleUrls: ['./item-description.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItemDescriptionComponent implements OnInit {

  @Input()
  public item?: Item;

  @Input({ required: true })
  public itemBase!: ItemBaseModel;

  public descriptions!: DescriptionElement[];

  constructor() { }

  ngOnInit(): void {
    const baseType = this.item?.baseType || this.itemBase;

    this.descriptions = baseType.description({
      thisItem: this.item,
      thisItemBase: baseType,
    }).descriptions;
  }

}
