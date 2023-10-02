import { Component, inject } from '@angular/core';
import { ActionCard, ActionCardStack } from 'src/app/core/action-cards';
import { MeditateActionCard } from 'src/app/core/action-cards/player-actions';
import { RemoveActionPoints } from 'src/app/core/events';
import { CommonUtils } from 'src/app/core/utils';
import { MwPlayersService } from 'src/app/features/services';
import { ApiProvider } from 'src/app/features/services/api-provider.service';
import { State } from 'src/app/features/services/state.service';
import { UiEventFeedService } from 'src/app/features/services/ui-event-feed.service';
import { EventsService } from 'src/app/store';
import { BasicPopup } from '../popup-container';
import { VfxService } from '../vfx-layer';

const iconFn = ({ icon, iconColor, bgColor }: ActionCard) => `<i class='ra ra-${icon}' style="background: ${bgColor}; color: ${iconColor}"></i>`;

@Component({
  selector: 'mw-action-cards-popup',
  templateUrl: './action-cards-popup.component.html',
  styleUrls: ['./action-cards-popup.component.scss']
})
export class ActionCardsPopupComponent extends BasicPopup<{}> {
  private readonly state = inject(State);
  private readonly playersService = inject(MwPlayersService);
  private readonly events = inject(EventsService);
  private readonly vfx = inject(VfxService);
  private readonly apiProvider = inject(ApiProvider);
  private readonly eventFeed = inject(UiEventFeedService);

  public cards = this.playersService.getCurrentPlayer().actionCards;

  public actionPointsLeft = this.state.currentGame.actionPoints;

  public handleCardClick(cardStack: ActionCardStack): void {
    console.log(cardStack);
    const card = cardStack.card;
    this.eventFeed.pushPlainMessage(`${iconFn(card)} ${card.title} action card is used.`);

    cardStack.count--;

    if (card.actionPoints) {
      this.events.dispatch(RemoveActionPoints({ points: card.actionPoints }));
    }

    if (!cardStack.count) {
      CommonUtils.removeItem(this.cards, cardStack);
    }

    if (card === MeditateActionCard) {
      const playerApi = this.apiProvider.getPlayerApi();
      const currentPlayer = playerApi.getCurrentPlayer();
      playerApi.addManaToPlayer(currentPlayer, 4);
    }
    // add floating text somewhere

    // this.vfx.createXyVfx();

    // close for now
    this.close();
  }
}
