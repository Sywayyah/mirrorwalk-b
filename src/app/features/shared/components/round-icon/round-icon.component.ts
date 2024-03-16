import { Component, Input } from '@angular/core';

@Component({
  selector: 'mw-round-icon',
  template: '<mw-ra-icon [icon]="icon" />',
  styleUrl: './round-icon.component.scss'
})
export class RoundIconComponent {
  @Input() icon!: string;
}

@Component({
  selector: 'mw-round-icon-btn',
  template: '<mw-round-icon [icon]="icon">',
  styleUrl: './round-icon-btn.component.scss'
})
export class RoundIconBtnComponent {
  @Input() icon!: string;
}
