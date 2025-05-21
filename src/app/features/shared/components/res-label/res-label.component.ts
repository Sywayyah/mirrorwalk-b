import { Component, computed, HostBinding, Input, input } from '@angular/core';
import { ImgIconSize } from 'src/app/core/assets';
import { resourceDetailsMapping, ResourceType } from 'src/app/core/resources';

@Component({
  selector: 'mw-res-label',
  templateUrl: './res-label.component.html',
  styleUrl: './res-label.component.scss',
  standalone: false,
})
export class ResLabelComponent {
  readonly resType = input.required<ResourceType | string>();
  readonly amount = input<number | undefined>(0);
  readonly iconSize = input<ImgIconSize>(32);

  @Input()
  @HostBinding('class')
  display: 'horizontal' | 'vertical' = 'horizontal';

  readonly resDetails = computed(() => resourceDetailsMapping[this.resType() as ResourceType]);
}
