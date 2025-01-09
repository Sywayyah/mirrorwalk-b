import { Component, Input } from '@angular/core';

@Component({
    selector: 'mw-ra-icon',
    templateUrl: './mw-ra-icon.component.html',
    styleUrls: ['./mw-ra-icon.component.scss'],
    standalone: false
})
export class MwRaIconComponent {

  @Input() public icon!: string;

  constructor() { }

}
