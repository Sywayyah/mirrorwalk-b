import { Component, inject } from '@angular/core';
import { GameOpenMainScreen } from 'src/app/core/events';
import { EventsService } from 'src/app/store';

@Component({
  selector: 'mw-sandbox-mode-screen',
  templateUrl: './sandbox-mode-screen.component.html',
  styleUrl: './sandbox-mode-screen.component.scss',
  standalone: false,
})
export class SandboxModeScreenComponent {
  private readonly events = inject(EventsService);

  goToMainScreen(): void {
    this.events.dispatch(GameOpenMainScreen());
  }
}
