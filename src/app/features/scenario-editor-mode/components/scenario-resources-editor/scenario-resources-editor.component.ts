import { Component, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SharedModule } from "../../../shared/shared.module";
import { CustomResources } from '../../config/resources';

@Component({
  selector: 'mw-scenario-resources-editor',
  imports: [FormsModule, SharedModule],
  templateUrl: './scenario-resources-editor.component.html',
  styleUrl: './scenario-resources-editor.component.scss',
})
export class ScenarioResourcesEditorComponent {
  readonly resources = input.required<CustomResources>();
}
