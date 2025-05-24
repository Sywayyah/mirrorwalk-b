import { CdkDrag, CdkDragHandle } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { Component, inject, Signal, TemplateRef } from '@angular/core';
import { PanelsService } from '../panels.service';
import { CommonUtils } from 'src/app/core/utils';

@Component({
  selector: 'mw-panel-container',
  imports: [CdkDrag, CdkDragHandle, CommonModule],
  templateUrl: './panel-container.component.html',
  styleUrl: './panel-container.component.scss',
  providers: [PanelsService],
})
export class PanelContainerComponent {
  readonly panels = inject(PanelsService);

  focused(panel: { templateRef: Signal<TemplateRef<object>>; title: Signal<string> }) {
    CommonUtils.removeItem(this.panels.panels, panel);
    this.panels.panels.push(panel);
  }
}
