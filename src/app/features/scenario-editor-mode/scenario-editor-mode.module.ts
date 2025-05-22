import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { ScenarioEditorScreenComponent } from './components/scenario-editor-screen/scenario-editor-screen.component';
import { FormsModule } from '@angular/forms';

const components = [ScenarioEditorScreenComponent];

@NgModule({
  declarations: components,
  exports: components,
  imports: [CommonModule, SharedModule, FormsModule],
})
export class ScenarioEditorModeModule {}
