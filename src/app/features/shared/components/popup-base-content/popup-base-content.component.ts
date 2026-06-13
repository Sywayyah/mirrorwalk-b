import { Component, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'mw-popup-base-content',
  templateUrl: './popup-base-content.component.html',
  styleUrl: './popup-base-content.component.scss',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class PopupBaseContentComponent {}
