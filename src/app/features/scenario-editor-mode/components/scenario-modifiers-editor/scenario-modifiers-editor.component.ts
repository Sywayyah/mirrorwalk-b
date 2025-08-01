import { Component, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DropdownOptionComponent } from '../../../shared/components/dropdown/dropdown-option.component';
import { DropdownComponent } from '../../../shared/components/dropdown/dropdown.component';
import { CustomModifiers } from '../../config/modifiers';
import { EditorTypedSignalInputComponent } from "../../../shared/components/editors-ui/editor-typed-signal-input/editor-typed-signal-input.component";

@Component({
  selector: 'mw-scenario-modifiers-editor',
  imports: [DropdownComponent, DropdownOptionComponent, FormsModule, EditorTypedSignalInputComponent],
  templateUrl: './scenario-modifiers-editor.component.html',
  styleUrl: './scenario-modifiers-editor.component.scss',
})
export class ScenarioModifiersEditorComponent {
  readonly modifiers = input.required<CustomModifiers>();
}
