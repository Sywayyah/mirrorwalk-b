import { Component, inject, input, TemplateRef, viewChild } from '@angular/core';
import { PanelsService } from '../panels.service';

@Component({
  selector: 'mw-panel',
  imports: [],
  templateUrl: './panel.component.html',
  styleUrl: './panel.component.scss',
})
export class PanelComponent {
  readonly title = input('panel_title');

  readonly templateRef = viewChild.required<TemplateRef<object>>('content');
  private readonly panels = inject(PanelsService);

  constructor() {
    this.panels.panels.push(this);
  }
}
