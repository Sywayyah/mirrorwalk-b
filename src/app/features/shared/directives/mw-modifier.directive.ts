import { Directive, inject, input, Input, OnChanges, OnDestroy, Renderer2 } from '@angular/core';
import { injectHostElem } from 'src/app/core/utils';

@Directive({
  selector: '[mwNumberModifier]',
  standalone: false
})
export class NumberModifierDirective implements OnDestroy, OnChanges {
  private hostElem = injectHostElem();
  private renderer = inject(Renderer2);

  readonly value = input.required<number>({ alias: 'mwNumberModifier' });

  @Input()
  public hideEmpty: boolean = true;

  constructor(
  ) {
    this.renderer.addClass(this.hostElem, 'mod-text');
  }

  public ngOnDestroy(): void {
    this.renderer.removeClass(this.hostElem, 'mod-text');
  }

  public ngOnChanges(): void {
    const elem = this.hostElem as HTMLElement;
    const value = this.value();

    if (this.hideEmpty && !value) {
      elem.innerHTML = '';
      return;
    }

    if (typeof value !== 'number') {
      elem.innerHTML = '';
      return;
    }

    elem.innerHTML = String((value > 0 ? '+' : '') + value);

    this.renderer.setStyle(elem, 'color', value < 0 ? 'red' : 'lime');
  }
}
