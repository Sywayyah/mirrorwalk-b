import { Component, inject } from '@angular/core';
import { ActionCardStack } from 'src/app/core/action-cards';
import { SetupCampActionCard } from 'src/app/core/action-cards/player-actions';
import { ActivateActionCard, PlayerEntersTown, PlayerOpensActionCards, PlayerOpensHeroInfo } from 'src/app/core/events';
import { MwPlayersService } from 'src/app/features/services';
import { State } from 'src/app/features/services/state.service';
import { EventsService } from 'src/app/store';

@Component({
  selector: 'mw-player-map-actions-panel',
  templateUrl: './player-map-actions-panel.component.html',
  styleUrls: ['./player-map-actions-panel.component.scss']
})
export class PlayerMapActionsPanelComponent {
  readonly state = inject(State);
  readonly events = inject(EventsService);

  private readonly players = inject(MwPlayersService);

  goToTown(): void {
    this.events.dispatch(PlayerEntersTown());
  }

  openPlayerInfo(): void {
    this.events.dispatch(PlayerOpensHeroInfo());
  }

  openActionCards(): void {
    this.events.dispatch(PlayerOpensActionCards());
  }

  setupCampAction(): void {
    const currentPlayer = this.players.getCurrentPlayer();
    this.events.dispatch(ActivateActionCard({
      player: currentPlayer,
      cardStack: currentPlayer.actionCards.find(card => card.card === SetupCampActionCard) as ActionCardStack
    }));
  }
}
