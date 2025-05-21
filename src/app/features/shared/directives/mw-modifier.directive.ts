import { Directive, inject, input, OnChanges, OnDestroy, Renderer2 } from '@angular/core';
import { injectHostElem } from 'src/app/core/utils';

@Directive({
  selector: '[mwNumberModifier]',
  standalone: false,
})
export class NumberModifierDirective implements OnDestroy, OnChanges {
  private readonly hostElem = injectHostElem();
  private readonly renderer = inject(Renderer2);

  readonly value = input.required<number>({ alias: 'mwNumberModifier' });
  readonly format = input<'shortPercent' | 'normal'>('normal', { alias: 'mwNumberModifierFormat' });

  public hideEmpty = input(true);

  constructor() {
    this.renderer.addClass(this.hostElem, 'mod-text');
  }

  public ngOnDestroy(): void {
    this.renderer.removeClass(this.hostElem, 'mod-text');
  }

  public ngOnChanges(): void {
    const elem = this.hostElem;
    const value = this.value();

    if (this.hideEmpty() && !value) {
      elem.innerHTML = '';
      return;
    }

    if (typeof value !== 'number') {
      elem.innerHTML = '';
      return;
    }

    let strValue = String(value);

    if (this.format() === 'shortPercent') {
      strValue = (value * 100).toFixed(0) + '%';
    }

    strValue = (value > 0 ? '+' : '') + strValue;

    elem.innerHTML = String(strValue);

    this.renderer.setStyle(elem, 'color', value < 0 ? 'red' : 'lime');
  }
}
