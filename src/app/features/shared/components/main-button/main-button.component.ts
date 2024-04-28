import { Component } from '@angular/core';

@Component({
  selector: 'button[mw-main-button]',
  template: '<ng-content />',
  styleUrls: ['./main-button.component.scss']
})
export class MainButtonComponent {
}
