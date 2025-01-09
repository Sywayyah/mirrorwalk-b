import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { Item, ItemBaseModel } from 'src/app/core/items';

@Component({
  selector: 'mw-item-description',
  templateUrl: './item-description.component.html',
  styleUrls: ['./item-description.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class ItemDescriptionComponent {
  public readonly item = input<Item>();

  public readonly itemBase = input.required<ItemBaseModel>();

  public readonly descriptions = computed(() => {
    const baseType = this.item()?.baseType || this.itemBase();

    return baseType.description({
      thisItem: this.item(),
      thisItemBase: baseType,
    }).descriptions;
  });
}
