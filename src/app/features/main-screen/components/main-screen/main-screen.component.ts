import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NewGameCreation, OpenSettings } from 'src/app/features/services/events';
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
    this.events.dispatch(OpenSettings({}));
  }
}
