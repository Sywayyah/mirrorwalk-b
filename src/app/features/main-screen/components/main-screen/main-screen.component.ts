import { Component, inject } from '@angular/core';
import { CONFIG } from 'src/app/core/config';
import { OpenGlossary, OpenNewGameScreen, OpenSandboxMode, OpenSettings } from 'src/app/core/events';
import { EventsService } from 'src/app/store';

@Component({
  selector: 'mw-main-screen',
  templateUrl: './main-screen.component.html',
  styleUrls: ['./main-screen.component.scss'],
  standalone: false,
})
export class MainScreenComponent {
  private readonly events = inject(EventsService);

  readonly isSandboxEnabled = CONFIG.sandboxMode;

  public openNewGameScreen(): void {
    this.events.dispatch(OpenNewGameScreen());
  }

  public openSandboxMode(): void {
    this.events.dispatch(OpenSandboxMode());
  }

  public openGlossary(): void {
    this.events.dispatch(OpenGlossary());
  }

  public openSettings(): void {
    this.events.dispatch(OpenSettings());
  }
}
