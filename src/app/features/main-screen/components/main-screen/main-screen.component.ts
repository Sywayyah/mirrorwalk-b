import { Component, inject } from '@angular/core';
import { isFeatureEnabled } from 'src/app/core/config';
import { Feature } from 'src/app/core/config/types';
import {
  OpenGlossary,
  OpenMultiplayer,
  OpenNewGameScreen,
  OpenSandboxMode,
  OpenScenarioMode,
  OpenSettings,
} from 'src/app/core/events';
import { EventsService } from 'src/app/store';

@Component({
  selector: 'mw-main-screen',
  templateUrl: './main-screen.component.html',
  styleUrls: ['./main-screen.component.scss'],
  standalone: false,
})
export class MainScreenComponent {
  private readonly events = inject(EventsService);

  readonly isSandboxEnabled = isFeatureEnabled(Feature.SandboxMode);
  readonly isMultiplayerEnabled = isFeatureEnabled(Feature.MultiplayerServer);
  readonly isScenarioEditorEnabled = isFeatureEnabled(Feature.ScenarioEditor);

  public openNewGameScreen(): void {
    this.events.dispatch(OpenNewGameScreen());
  }

  public openSandboxMode(): void {
    this.events.dispatch(OpenSandboxMode());
  }

  public openScenarioMode(): void {
    this.events.dispatch(OpenScenarioMode());
  }

  public openGlossary(): void {
    this.events.dispatch(OpenGlossary());
  }

  public openSettings(): void {
    this.events.dispatch(OpenSettings());
  }

  public openMultiplayer() {
    this.events.dispatch(OpenMultiplayer());
  }
}
