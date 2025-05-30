import { inject, Injectable } from '@angular/core';
import { FightNextRoundStarts, FightStarts, NextRoundStarts } from 'src/app/core/events';
import { ItemEvents } from 'src/app/core/items';
import { Notify, StoreClient, WireMethod } from 'src/app/store';
import { MwItemsService } from '../mw-items.service';

@Injectable()
export class ItemsController extends StoreClient() {
  private itemsService = inject(MwItemsService);

  @WireMethod(FightNextRoundStarts)
  public triggerEventsForItems(event: NextRoundStarts): void {
    this.itemsService.triggerEventForAllItemsHandlers(ItemEvents.NewRoundBegins({ round: event.round }));
  }

  @Notify(FightStarts)
  public trigger(): void {
    this.itemsService.triggerEventForAllItemsHandlers(ItemEvents.NewRoundBegins({ round: 0 }));
  }
}
