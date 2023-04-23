import { Directive, ElementRef, Input, OnChanges, OnDestroy, Renderer2 } from '@angular/core';

@Directive({
  selector: '[mwNumberModifier]'
})
export class NumberModifierDirective implements OnDestroy, OnChanges {

  @Input('mwNumberModifier')
  public value!: number;

  constructor(
    private hostElem: ElementRef,
    private renderer: Renderer2,
  ) {
    this.renderer.addClass(this.hostElem.nativeElement, 'mod-text');
  }

  public ngOnDestroy(): void {
    this.renderer.removeClass(this.hostElem.nativeElement, 'mod-text');
  }

  public ngOnChanges(): void {
    const elem = this.hostElem.nativeElement as HTMLElement;
    if (!this.value) {
      elem.innerHTML = '';
      return;
    }

    elem.innerHTML = String((this.value > 0 ? '+' : '') + this.value);

    this.renderer.setStyle(elem, 'color', this.value < 0 ? 'red' : 'lime');
  }
}
