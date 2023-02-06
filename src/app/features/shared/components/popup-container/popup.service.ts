import { Injectable, Type } from '@angular/core';
import { BasicPopup } from './basic-popup';

export interface PopupData {
  data: object;
  component: Type<any>;
  class?: string;
}

@Injectable({
  providedIn: 'root',
})
export class PopupService {

  public popups: PopupData[] = [];

  public createPopup(params: PopupData): void {
    this.popups.push(params);
  }

  public createBasicPopup<T extends object>(params: {
    data: T;
    component: Type<BasicPopup<T>>;
    class?: string;
  }): void {
    this.createPopup(params);
  }

  public removePopup(popupToRemove: PopupData): void {
    this.popups = this.popups.filter(popup => popup !== popupToRemove);
  }
}
