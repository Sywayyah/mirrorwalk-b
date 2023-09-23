import { Component, inject } from '@angular/core';
import { MwPlayersService } from 'src/app/features/services';
import { State } from 'src/app/features/services/state.service';
import { BasicPopup } from '../popup-container';
import { ActionCardStack } from 'src/app/core/action-cards';

@Component({
  selector: 'mw-action-cards-popup',
  templateUrl: './action-cards-popup.component.html',
  styleUrls: ['./action-cards-popup.component.scss']
})
export class ActionCardsPopupComponent extends BasicPopup<{}> {
  private readonly state = inject(State);
  private readonly playersService = inject(MwPlayersService);

  public cards = this.playersService.getCurrentPlayer().actionCards;

  public actionPointsLeft = this.state.currentGame.actionPoints;

  public handleCardClick(actionCard: ActionCardStack): void {
    console.log(actionCard);
    // close for now
    this.close();
  }
}
