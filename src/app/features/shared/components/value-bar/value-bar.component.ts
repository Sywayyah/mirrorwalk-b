import { ChangeDetectionStrategy, Component, computed, effect, input } from '@angular/core';
import { injectHostElem, injectRenderer } from 'src/app/core/utils';

/*
  For now, I'm not sure if I want to use it for showing amount of units.
    Maybe it just needs time, or it can become useful if there will be portraits.

  For now, it still can be useful for debugging in some cases.
*/
@Component({
  selector: 'mw-value-bar',
  templateUrl: './value-bar.component.html',
  styleUrls: ['./value-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class ValueBarComponent {
  private readonly hostElem = injectHostElem();
  private readonly renderer = injectRenderer();

  readonly maxValue = input.required<number>();
  readonly diffBar = input(true);
  readonly barStyle = input<'normal' | 'static'>('normal');
  readonly showMax = input(true);
  readonly currentValue = input(0);
  readonly color = input('red');
  readonly barHeight = input(3);
  readonly side = input<'left' | 'right'>('left');
  readonly uiBarWidth = computed(() => (this.currentValue() / this.maxValue()) * 100);

  constructor() {
    effect(() => {
      this.renderer.setStyle(this.hostElem, 'height', `${this.barHeight()}px`);
    });
  }
}
