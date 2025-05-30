import { Component, input } from '@angular/core';
import { CustomResources } from '../../config/types';
import { FormsModule } from '@angular/forms';
import { SharedModule } from "../../../shared/shared.module";

@Component({
  selector: 'mw-scenario-resources-editor',
  imports: [FormsModule, SharedModule],
  templateUrl: './scenario-resources-editor.component.html',
  styleUrl: './scenario-resources-editor.component.scss',
})
export class ScenarioResourcesEditorComponent {
  readonly resources = input.required<CustomResources>();
}
