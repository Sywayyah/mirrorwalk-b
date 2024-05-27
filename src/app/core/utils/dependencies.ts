import { ElementRef, Renderer2, inject } from '@angular/core';

export function injectHostElem(): HTMLElement {
  return inject(ElementRef).nativeElement as HTMLElement;
}

export function injectRenderer(): Renderer2 {
  return inject(Renderer2);
}
