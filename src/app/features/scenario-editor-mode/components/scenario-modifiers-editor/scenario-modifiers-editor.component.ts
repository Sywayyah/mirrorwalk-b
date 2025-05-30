import { Component, input } from '@angular/core';
import { CustomModifiers } from '../../config/types';
import { DropdownComponent } from '../../../shared/components/dropdown/dropdown.component';
import { DropdownOptionComponent } from '../../../shared/components/dropdown/dropdown-option.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'mw-scenario-modifiers-editor',
  imports: [DropdownComponent, DropdownOptionComponent, FormsModule],
  templateUrl: './scenario-modifiers-editor.component.html',
  styleUrl: './scenario-modifiers-editor.component.scss',
})
export class ScenarioModifiersEditorComponent {
  readonly modifiers = input.required<CustomModifiers>();
}
