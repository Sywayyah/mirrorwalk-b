import { inject } from '@angular/core';
import { PopupRef, POPUP_REF } from './injection-tokens';

export abstract class BasicPopup<T> {
  protected popup: PopupRef<T> = inject(POPUP_REF);

  protected data: T = this.popup.data;

  protected close(): void {
    this.popup.close();
  }
}
