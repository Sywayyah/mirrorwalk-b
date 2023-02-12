import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { ItemInstanceModel } from 'src/app/core/items';
import { DescriptionElement } from 'src/app/core/ui/descriptions';

@Component({
  selector: 'mw-item-description',
  templateUrl: './item-description.component.html',
  styleUrls: ['./item-description.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItemDescriptionComponent implements OnInit {

  @Input()
  public item!: ItemInstanceModel;

  public descriptions!: DescriptionElement[];

  constructor() { }

  ngOnInit(): void {
    this.descriptions = [];
  }

}
