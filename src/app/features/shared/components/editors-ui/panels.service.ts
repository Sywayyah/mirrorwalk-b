import { Injectable, Signal, TemplateRef, WritableSignal } from '@angular/core';

export type PanelModel = {
  templateRef: Signal<TemplateRef<object>>;
  title: Signal<string>;
  width: WritableSignal<number>;
  height: WritableSignal<number>;
};

@Injectable()
export class PanelsService {
  panels: PanelModel[] = [];
}
