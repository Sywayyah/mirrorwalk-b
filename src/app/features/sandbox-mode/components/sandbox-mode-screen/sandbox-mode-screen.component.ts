import { Component, inject } from '@angular/core';
import { GameOpenMainScreen, TestSandboxScenario } from 'src/app/core/events';
import { EventsService } from 'src/app/store';
import { SandboxModeContext } from '../../services/sandbox-mode-context.service';
import { humansFaction } from 'src/app/core/factions';

@Component({
  selector: 'mw-sandbox-mode-screen',
  templateUrl: './sandbox-mode-screen.component.html',
  styleUrl: './sandbox-mode-screen.component.scss',
  standalone: false,
})
export class SandboxModeScreenComponent {
  private readonly events = inject(EventsService);
  private readonly sandboxContext = inject(SandboxModeContext);

  readonly playerSettings = this.sandboxContext.currentPlayerSettings;
  readonly opponentSettings = this.sandboxContext.opponentPlayerSettings;

  readonly canStart = () => this.playerSettings.canStart() && this.opponentSettings.canStart();

  runScenario() {
    this.events.dispatch(
      TestSandboxScenario({
        hero: this.playerSettings.hero()!,
        faction: humansFaction,
        townBase: humansFaction.townBase!,
      }),
    );
  }

  goToMainScreen(): void {
    this.events.dispatch(GameOpenMainScreen());
  }
}
