import { Component, inject } from '@angular/core';
import { ActionCardStack } from 'src/app/core/action-cards';
import { ActivateActionCard } from 'src/app/core/events';
import { MwPlayersService } from 'src/app/features/services';
import { State } from 'src/app/features/services/state.service';
import { EventsService } from 'src/app/store';
import { BasicPopup } from '../popup-container';

@Component({
    selector: 'mw-action-cards-popup',
    templateUrl: './action-cards-popup.component.html',
    styleUrls: ['./action-cards-popup.component.scss'],
    standalone: false
})
export class ActionCardsPopupComponent extends BasicPopup<{}> {
  private readonly state = inject(State);
  private readonly playersService = inject(MwPlayersService);
  private readonly events = inject(EventsService);

  public cards = this.playersService.getCurrentPlayer().actionCards;

  public actionPointsLeft = this.state.currentGame.actionPoints;

  public handleCardClick(cardStack: ActionCardStack): void {
    this.events.dispatch(ActivateActionCard({ player: this.playersService.getCurrentPlayer(), cardStack: cardStack }));

    // close for now
    this.close();
  }
}
