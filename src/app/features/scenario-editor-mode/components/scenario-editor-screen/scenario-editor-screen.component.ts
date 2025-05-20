import { Component, inject } from '@angular/core';
import { GameOpenMainScreen } from 'src/app/core/events';
import { EventsService } from 'src/app/store';

@Component({
  selector: 'mw-scenario-editor-screen',
  standalone: false,

  templateUrl: './scenario-editor-screen.component.html',
  styleUrl: './scenario-editor-screen.component.scss',
})
export class ScenarioEditorScreenComponent {
  private readonly events = inject(EventsService);

  goToMainScreen() {
    this.events.dispatch(GameOpenMainScreen());
  }
}
