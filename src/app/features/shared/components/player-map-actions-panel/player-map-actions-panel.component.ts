import { Component, inject } from '@angular/core';
import { PlayerEntersTown, PlayerOpensActionCards, PlayerOpensHeroInfo } from 'src/app/core/events';
import { State } from 'src/app/features/services/state.service';
import { EventsService } from 'src/app/store';

@Component({
  selector: 'mw-player-map-actions-panel',
  templateUrl: './player-map-actions-panel.component.html',
  styleUrls: ['./player-map-actions-panel.component.scss']
})
export class PlayerMapActionsPanelComponent {
  public state = inject(State);
  public events = inject(EventsService);

  public goToTown(): void {
    this.events.dispatch(PlayerEntersTown());
  }

  public openPlayerInfo(): void {
    this.events.dispatch(PlayerOpensHeroInfo());
  }

  public openActionCards(): void {
    this.events.dispatch(PlayerOpensActionCards());
  }
}
