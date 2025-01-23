import { Component } from '@angular/core';
import { OpenGlossary, OpenNewGameScreen, OpenSettings } from 'src/app/core/events';
import { EventsService } from 'src/app/store';

@Component({
    selector: 'mw-main-screen',
    templateUrl: './main-screen.component.html',
    styleUrls: ['./main-screen.component.scss'],
    standalone: false
})
export class MainScreenComponent {
  constructor(
    private events: EventsService,
  ) { }

  public openNewGameScreen(): void {
    this.events.dispatch(OpenNewGameScreen());
  }

  public openGlossary(): void {
    this.events.dispatch(OpenGlossary());
  }

  public openSettings(): void {
    this.events.dispatch(OpenSettings());
  }
}
