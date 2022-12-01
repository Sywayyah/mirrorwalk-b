import { InjectionToken } from '@angular/core';


export const POPUP_REF = new InjectionToken<PopupRef<any>>('Popup Reference');

export interface PopupRef<T> {
  data: T;
  close(): void;
}
