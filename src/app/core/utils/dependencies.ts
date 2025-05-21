import { ChangeDetectorRef, DestroyRef, ElementRef, Renderer2, inject } from '@angular/core';

export function injectHostElem(): HTMLElement {
  return inject(ElementRef).nativeElement as HTMLElement;
}

export function injectRenderer(): Renderer2 {
  return inject(Renderer2);
}

export function onDestroy(action: () => void): DestroyRef {
  const destroyRef = inject(DestroyRef);
  destroyRef.onDestroy(action);
  return destroyRef;
}

export function injectCdr(): ChangeDetectorRef {
  return inject(ChangeDetectorRef);
}
