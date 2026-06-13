import { Component, HostBinding, Input, ChangeDetectionStrategy } from '@angular/core';
import { Resources } from 'src/app/core/resources';

@Component({
  selector: 'mw-resources-cost',
  templateUrl: './resources-cost.component.html',
  styleUrl: './resources-cost.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class ResourcesCostComponent {
  @Input() cost?: Resources;

  @HostBinding('class.capitalize')
  @Input()
  capitalize = true;
}
