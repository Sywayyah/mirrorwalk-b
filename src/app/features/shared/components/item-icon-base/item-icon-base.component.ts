import { Component, Input } from '@angular/core';

@Component({
  selector: 'mw-item-icon-base',
  templateUrl: './item-icon-base.component.html',
  styleUrls: ['./item-icon-base.component.scss']
})
export class ItemIconBaseComponent {
  @Input()
  public icon!: string;

  @Input()
  public itemColor?: string;

  @Input()
  public bgColor?: string;

  constructor() { }
}
