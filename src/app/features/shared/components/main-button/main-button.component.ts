import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'button[mw-main-button]',
  template: '<ng-content />',
  styleUrls: ['./main-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class MainButtonComponent {}
