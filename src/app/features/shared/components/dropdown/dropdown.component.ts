import { CdkMenuTrigger } from '@angular/cdk/menu';
import { ConnectionPositionPair } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, model, output, signal, viewChild } from '@angular/core';
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

  readonly optionChanged = output<T>();

  readonly menuTriggerRef = viewChild.required<CdkMenuTrigger>('menuTrigger');
  readonly optionsRef = viewChild<ElementRef<HTMLElement>>('optionsRef');

  readonly menuPosition = [
    new ConnectionPositionPair({ originX: 'center', originY: 'bottom' }, { overlayX: 'center', overlayY: 'top' }),
  ];

  onOpen() {
    if (this.selectedItem()) {
      // give a short delay for menu items to appear
      setTimeout(() => {
        const selectedOption = this.options().find((option) => option.value() === this.selectedItem());
        selectedOption?.focusIntoView();
      }, 0);
    }
  }

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
