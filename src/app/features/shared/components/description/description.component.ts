import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation, input } from '@angular/core';
import { DescriptionElement } from 'src/app/core/ui/descriptions';

const transformStringsToDescriptions = (val: (DescriptionElement | string)[]) => val
  .map(v => (typeof v === 'string') ? { htmlContent: v } : v);

@Component({
    selector: 'mw-description',
    templateUrl: './description.component.html',
    styleUrls: ['./description.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class DescriptionComponent {
  public descriptions = input.required({ transform: transformStringsToDescriptions });
}
