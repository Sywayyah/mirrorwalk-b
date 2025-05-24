import { CdkMenuTrigger } from '@angular/cdk/menu';
import { ConnectionPositionPair } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, inject, model, signal, viewChild } from '@angular/core';
import { injectHostElem } from 'src/app/core/utils';
import { isNotNullish } from 'src/app/core/utils/common';
import type { DropdownOptionComponent } from './dropdown-option.component';

@Component({
  selector: 'mw-dropdown',
  imports: [CdkMenuTrigger, CommonModule],
  templateUrl: './dropdown.component.html',
  styleUrl: './dropdown.component.scss',
})
export class DropdownComponent<T> {
  readonly hostElem = injectHostElem();

  readonly selectedItem = model.required<T>();
  readonly options = signal<DropdownOptionComponent<T>[]>([]);

  readonly menuTriggerRef = viewChild.required<CdkMenuTrigger>('menuTrigger');
  readonly optionsRef = viewChild<ElementRef<HTMLElement>>('optionsRef');

  readonly menuPosition = [
    new ConnectionPositionPair({ originX: 'center', originY: 'bottom' }, { overlayX: 'center', overlayY: 'top' }),
  ];

  @HostListener('document:mousedown', ['$event'])
  onClick(event: MouseEvent): void {
    // simple "click-outside" check
    if (!this.menuTriggerRef().opened) {
      return;
    }

    if (
      ![this.optionsRef()?.nativeElement, this.hostElem]
        .filter(isNotNullish)
        .some((elem) => elem.contains(event.target as HTMLElement))
    ) {
      this.menuTriggerRef().close();
    }
  }
}
