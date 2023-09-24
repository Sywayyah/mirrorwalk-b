import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';
import { DescriptionElement } from 'src/app/core/ui/descriptions';

@Component({
  selector: 'mw-description',
  templateUrl: './description.component.html',
  styleUrls: ['./description.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DescriptionComponent {
  @Input()
  public descriptions!: DescriptionElement[];
}
