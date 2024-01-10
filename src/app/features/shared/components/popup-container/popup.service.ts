import { Injectable, Type, inject } from '@angular/core';
import { CommonUtils } from 'src/app/core/utils';
import { InputsService } from 'src/app/features/services/inputs.service';
import { BasicPopup } from './basic-popup';

export interface PopupData {
  data: object;
  component: Type<any>;
  class?: string;
  isCloseable?: boolean;
  escape?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class PopupService {
  public popups: PopupData[] = [];

  constructor() {
    inject(InputsService).escape$.subscribe((event: KeyboardEvent) => {
      if (!this.popups.length) {
        return;
      }

      const latestPopup = this.popups[this.popups.length - 1];

      if (latestPopup.isCloseable || latestPopup.escape) {
        this.removePopup(latestPopup);
      }
    });
  }

  public createPopup(params: PopupData): void {
    this.popups.push(params);
  }

  public createBasicPopup<T extends object>(params: {
    data: T;
    component: Type<BasicPopup<T>>;
    class?: string;
    isCloseable?: boolean;
    escape?: boolean
  }): void {
    this.createPopup(params);
  }

  public removePopup(popupToRemove: PopupData): void {
    CommonUtils.removeItem(this.popups, popupToRemove);
  }
}
