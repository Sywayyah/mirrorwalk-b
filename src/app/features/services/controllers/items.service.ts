import { Injectable } from '@angular/core';
import { ItemEvents } from 'src/app/core/items';
import { Notify, StoreClient, WireMethod } from 'src/app/store';
import { FightNextRoundStarts, FightStarts, NextRoundStarts } from '../events';
import { MwItemsService } from '../mw-items.service';

@Injectable()
export class ItemsController extends StoreClient() {

  constructor(
    private itemsService: MwItemsService,
  ) {
    super();
  }

  @WireMethod(FightNextRoundStarts)
  public triggerEventsForItems(event: NextRoundStarts): void {
    this.itemsService.triggerEventForAllItemsHandlers(ItemEvents.NewRoundBegins({ round: event.round }));
  }

  @Notify(FightStarts)
  public trigger(): void {
    this.itemsService.triggerEventForAllItemsHandlers(ItemEvents.NewRoundBegins({ round: 0 }));
  }
}
