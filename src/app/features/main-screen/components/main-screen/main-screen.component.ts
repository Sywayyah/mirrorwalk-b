import { Component, OnInit } from '@angular/core';
import { NewGameCreation } from 'src/app/features/services/events';
import { EventsService } from 'src/app/store';

@Component({
  selector: 'mw-main-screen',
  templateUrl: './main-screen.component.html',
  styleUrls: ['./main-screen.component.scss']
})
export class MainScreenComponent implements OnInit {

  constructor(
    private events: EventsService,
  ) { }

  ngOnInit(): void {
  }

  public newGame(): void {
    this.events.dispatch(NewGameCreation({}));
  }

  public openSettings(): void {
    console.log('open settings');
  }

  public loadScript(): void {
    /* Basic implementation for scripts loading! With that, there can be mods and resource packs. */
    import('src/app/mods/mod').then((data) => {
      console.log('loaded script successfully!', data);
    });
  }
}
