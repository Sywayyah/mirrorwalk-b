import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SandboxModeScreenComponent } from './components/sandbox-mode-screen/sandbox-mode-screen.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [SandboxModeScreenComponent],
  exports: [SandboxModeScreenComponent],
  imports: [CommonModule, SharedModule],
})
export class SandboxModeModule {}
