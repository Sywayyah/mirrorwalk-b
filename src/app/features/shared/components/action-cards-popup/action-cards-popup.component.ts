import { Component, inject } from '@angular/core';
import { ActionCardStack, ActionCardTypes } from 'src/app/core/action-cards';
import { RemoveActionPoints } from 'src/app/core/events';
import { CommonUtils } from 'src/app/core/utils';
import { actionCardEvent } from 'src/app/core/vfx';
import { MwPlayersService } from 'src/app/features/services';
import { ApiProvider } from 'src/app/features/services/api-provider.service';
import { State } from 'src/app/features/services/state.service';
import { UiEventFeedService } from 'src/app/features/services/ui-event-feed.service';
import { EventsService } from 'src/app/store';
import { BasicPopup } from '../popup-container';
import { VfxService } from '../vfx-layer';

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

    cardStack.count--;

    if (card.actionPoints) {
      this.events.dispatch(RemoveActionPoints({ points: card.actionPoints }));
    }

    if (!cardStack.count) {
      CommonUtils.removeItem(this.cards, cardStack);
    }

    if (card.type === ActionCardTypes.PlayerAction) {
      card.config?.onUsedInstantly?.(this.apiProvider.getGameApi());
    }

    this.eventFeed.pushPlainMessage(`${actionCardEvent(card)} is used. Left: ${cardStack.count}`);

    // close for now
    this.close();
  }
}