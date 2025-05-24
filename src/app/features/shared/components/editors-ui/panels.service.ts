import { Injectable, Signal, TemplateRef } from '@angular/core';

@Injectable()
export class PanelsService {
  panels: { templateRef: Signal<TemplateRef<object>>; title: Signal<string> }[] = [];
}
