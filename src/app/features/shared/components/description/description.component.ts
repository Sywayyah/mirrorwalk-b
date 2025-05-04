import { ChangeDetectionStrategy, Component, ViewEncapsulation, input } from '@angular/core';
import { DescriptionElementType, DescriptionVariants } from 'src/app/core/ui/descriptions';

const transformStringsToDescriptions = (
  val: (DescriptionVariants['variants'] | string)[],
): DescriptionVariants['variants'][] =>
  val.map((v) => (typeof v === 'string' ? { type: DescriptionElementType.FreeHtml, htmlContent: v } : v));

@Component({
  selector: 'mw-description',
  templateUrl: './description.component.html',
  styleUrls: ['./description.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class DescriptionComponent {
  readonly descriptions = input.required({ transform: transformStringsToDescriptions });

  readonly DescriptionType = DescriptionElementType;
}
