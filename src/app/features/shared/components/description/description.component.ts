import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';
import { DescriptionElement } from 'src/app/core/ui/descriptions';

const transformStringsToDescriptions = (val: (DescriptionElement | string)[]) => val.map(v => (typeof v === 'string') ? { htmlContent: v } : v);

@Component({
  selector: 'mw-description',
  templateUrl: './description.component.html',
  styleUrls: ['./description.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DescriptionComponent {
  @Input({
    transform: (val: (DescriptionElement | string)[]) => transformStringsToDescriptions(val),
    required: true,
  })
  public descriptions!: (DescriptionElement | string)[];
}
