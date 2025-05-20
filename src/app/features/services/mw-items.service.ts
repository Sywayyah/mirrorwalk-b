import { inject, Injectable } from '@angular/core';
import { Colors } from 'src/app/core/assets';
import { InitItem } from 'src/app/core/events';
import { ItemBaseType, Item } from 'src/app/core/items';
import { Player } from 'src/app/core/players';
import { EventData, EventsService } from 'src/app/store';
import { State } from './state.service';
import { GameObjectsManager } from './game-objects-manager.service';

/* Unregister All items and spell handlers when Game was over... */
/*  And not only when game is over, but also when fight is over/item gets unregistered, something like that */

@Injectable({
  providedIn: 'root',
})
export class MwItemsService {
  private readonly events = inject(EventsService);
  private readonly state = inject(State);
  private readonly gameObjectsManager = inject(GameObjectsManager);

  public createItem<T extends object>(itemBase: ItemBaseType<T>): Item<T> {
    const itemIcon = itemBase.icon;

    if (!itemIcon.bgClr) {
      itemIcon.bgClr = Colors.DefaultItemIconBg;
    }

    if (!itemIcon.iconClr) {
      itemIcon.iconClr = Colors.DefaultItemIconClr;
    }

    return this.gameObjectsManager.createNewGameObject(Item<T>, {
      itemBase: itemBase,
      state: itemBase.defaultState,
    });
  }

  public registerItemsEventHandlers(item: Item, ownerPlayer: Player): void {
    this.events.dispatch(
      InitItem({
        item,
        ownerPlayer,
      }),
    );
  }

  // Later may limit events only to item events
  public triggerEventForAllItemsHandlers(event: EventData): void {
    this.state.eventHandlers.items.triggerAllHandlersByEvent(event);
  }

  public triggerEventForItemHandlers(item: Item, event: EventData): void {
    this.state.eventHandlers.items.triggerRefEventHandlers(item, event);
  }
}
