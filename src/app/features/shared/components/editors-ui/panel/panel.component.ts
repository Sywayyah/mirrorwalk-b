import { Component, computed, inject, input, model, TemplateRef, viewChild } from '@angular/core';
import { PanelsService } from '../panels.service';

@Component({
  selector: 'mw-panel',
  imports: [],
  templateUrl: './panel.component.html',
  styleUrl: './panel.component.scss',
})
export class PanelComponent {
  readonly title = input('panel_title');

  readonly width = model(100);
  readonly height = model(100);

  readonly xPosition = model(0);
  readonly yPosition = model(0);
  readonly position = computed(() => ({ x: this.xPosition(), y: this.yPosition() }));

  readonly templateRef = viewChild.required<TemplateRef<object>>('content');
  private readonly panels = inject(PanelsService);

  constructor() {
    this.panels.panels.push(this);
  }
}
