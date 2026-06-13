import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'mw-shared-templates',
  templateUrl: './shared-templates.component.html',
  styleUrls: ['./shared-templates.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class SharedTemplatesComponent {
  constructor() {}
}
