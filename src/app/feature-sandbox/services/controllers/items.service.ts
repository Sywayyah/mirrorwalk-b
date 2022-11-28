import { Injectable } from '@angular/core';
import { GameEventTypes } from 'src/app/core/items';
import { FightNextRoundStarts, FightStarts, NextRoundStarts } from '../events';
import { MwItemsService } from '../mw-items.service';
import { Notify, StoreClient, WireMethod } from '../store';

@Injectable()
export class ItemsController extends StoreClient() {

  constructor(
    private itemsService: MwItemsService,
  ) {
    super();
  }

  @WireMethod(FightNextRoundStarts)
  public triggerEventsForItems(event: NextRoundStarts): void {
    this.itemsService.triggerEventForAllItemsHandlers(
      GameEventTypes.NewRoundBegins,
      { round: event.round },
    );
  }

  @Notify(FightStarts)
  public trigger(): void {
    this.itemsService.triggerEventForAllItemsHandlers(
      GameEventTypes.NewRoundBegins,
      { round: 0 },
    )
  }
}
