import { Component } from '@angular/core';
import { PlayerLeavesTown } from 'src/app/features/services/events';
import { State } from 'src/app/features/services/state.service';
import { EventsService } from 'src/app/store';

@Component({
  selector: 'mw-town-view',
  templateUrl: './town-view.component.html',
  styleUrls: ['./town-view.component.scss']
})
export class TownViewComponent {

  public town = this.state.createdGame.town;

  constructor(
    private state: State,
    private events: EventsService,
  ) { }

  public leaveTown(): void {
    this.events.dispatch(PlayerLeavesTown({}));
  }
}
