import { ElementRef, inject } from '@angular/core';

export function injectHostElem(): HTMLElement {
  return inject(ElementRef).nativeElement as HTMLElement;
}
