import { Component, Input } from '@angular/core';

@Component({
  selector: 'mw-icon-btn',
  templateUrl: './icon-btn.component.html',
  styleUrls: ['./icon-btn.component.scss']
})
export class IconBtnComponent {
  @Input()
  public icon!: string;

  constructor() { }
}
