import { CdkDrag, CdkDragHandle } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { CommonUtils } from 'src/app/core/utils';
import { PanelModel, PanelsService } from '../panels.service';

@Component({
  selector: 'mw-panel-container',
  imports: [CdkDrag, CdkDragHandle, CommonModule],
  templateUrl: './panel-container.component.html',
  styleUrl: './panel-container.component.scss',
  providers: [PanelsService],
})
export class PanelContainerComponent {
  readonly panels = inject(PanelsService);

  focused(panel: PanelModel) {
    CommonUtils.removeItem(this.panels.panels, panel);
    this.panels.panels.push(panel);
  }
}
