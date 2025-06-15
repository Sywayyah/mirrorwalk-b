import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SandboxModeScreenComponent } from './components/sandbox-mode-screen/sandbox-mode-screen.component';
import { SharedModule } from '../shared/shared.module';
import { PlayerSettingsComponent } from "./components/player-settings/player-settings.component";

@NgModule({
  declarations: [SandboxModeScreenComponent],
  exports: [SandboxModeScreenComponent],
  imports: [CommonModule, SharedModule, PlayerSettingsComponent],
})
export class SandboxModeModule {}
