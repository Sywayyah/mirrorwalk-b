import { Component, computed, ElementRef, inject, input, TemplateRef, viewChild } from '@angular/core';
import { SignalArrUtils } from 'src/app/core/utils/signals';
import { DropdownComponent } from './dropdown.component';

@Component({
  selector: 'mw-dropdown-option',
  template: `
    <ng-template #template>
      <div
        class="option"
        [class.selected]="isSelected()"
        (click)="selected()"
        #option
      >
        <ng-content />
      </div>
    </ng-template>
  `,
  styles: `
    .option {
      cursor: pointer;
      padding: 4px;

      &:hover {
        background: rgba(0, 0, 0, 0.3);
      }

      &.selected {
        background: rgba(254, 158, 40, 0.74);
      }
    }
  `,
})
export class DropdownOptionComponent<T> {
  readonly dropdownRef = inject(DropdownComponent<unknown>);

  readonly templateRef = viewChild.required<TemplateRef<null>>('template');
  readonly optionRef = viewChild<ElementRef<HTMLElement>>('option');

  readonly value = input.required<T>();

  readonly isSelected = computed(() => this.value() === this.dropdownRef.selectedItem());

  constructor() {
    this.dropdownRef.options.update(SignalArrUtils.addItem(this as any));
  }

  selected(): void {
    this.dropdownRef.selectedItem.set(this.value());
    this.dropdownRef.menuTriggerRef().close();
    this.dropdownRef.optionChanged.emit(this.value());
  }

  focusIntoView(): void {
    this.optionRef()?.nativeElement.scrollIntoView({ block: 'center' });
  }
}
