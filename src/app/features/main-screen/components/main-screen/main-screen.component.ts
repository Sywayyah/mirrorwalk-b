import { Component } from '@angular/core';
import { OpenNewGameScreen, OpenSettings } from 'src/app/features/services/events';
import { EventsService } from 'src/app/store';

@Component({
  selector: 'mw-main-screen',
  templateUrl: './main-screen.component.html',
  styleUrls: ['./main-screen.component.scss']
})
export class MainScreenComponent {
  constructor(
    private events: EventsService,
  ) { }

  public openNewGameScreen(): void {
    this.events.dispatch(OpenNewGameScreen({}));
  }

  public openSettings(): void {
    this.events.dispatch(OpenSettings({}));
  }
}
