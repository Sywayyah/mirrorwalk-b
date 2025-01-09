import { Component, HostBinding, HostListener, Input } from '@angular/core';

@Component({
    selector: 'mw-icon-btn',
    templateUrl: './icon-btn.component.html',
    styleUrls: ['./icon-btn.component.scss'],
    standalone: false
})
export class IconBtnComponent {
  @Input()
  public icon!: string;

  @Input()
  @HostBinding('class.disabled')
  disabled: boolean | null = false;

  constructor() { }

  @HostListener('click')
  click(): boolean {
    return !this.disabled;
  }
}
