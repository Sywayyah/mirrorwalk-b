import { Component, computed, input } from '@angular/core';
import { ImgIconSize } from 'src/app/core/assets';
import { resourceDetails, ResourceType } from 'src/app/core/resources';

@Component({
  selector: 'mw-res-label',
  templateUrl: './res-label.component.html',
  styleUrl: './res-label.component.scss',
  standalone: false,
})
export class ResLabelComponent {
  readonly resType = input.required<ResourceType>();
  readonly amount = input<number>(0);
  readonly iconSize = input<ImgIconSize>(32);

  readonly resDetails = computed(() => resourceDetails[this.resType()]);
}
