import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { ScenarioEditorScreenComponent } from './components/scenario-editor-screen/scenario-editor-screen.component';

const components = [ScenarioEditorScreenComponent];

@NgModule({
  declarations: components,
  exports: components,
  imports: [CommonModule, SharedModule],
})
export class ScenarioEditorModeModule {}
