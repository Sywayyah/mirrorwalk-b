import { Component, inject } from '@angular/core';
import { ScenarioEditorContextService } from '../../services/scenario-editor-context.service';

@Component({
  selector: 'mw-scenario-area-editor',
  imports: [],
  templateUrl: './scenario-area-editor.component.html',
  styleUrl: './scenario-area-editor.component.scss',
})
export class ScenarioAreaEditorComponent {
  private readonly context = inject(ScenarioEditorContextService);

  readonly rootArea = this.context.areaEditor.currentArea;
}
