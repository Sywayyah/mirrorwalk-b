import { Injectable } from '@angular/core';
import { Colors } from 'src/app/core/assets';
import { InitItem } from 'src/app/core/events';
import { ItemBaseModel, ItemObject } from 'src/app/core/items';
import { Player } from 'src/app/core/players';
import { EventData, EventsService } from 'src/app/store';
import { State } from './state.service';
import { GameObjectsManager } from './game-objects-manager.service';

/* Unregister All items and spell handlers when Game was over... */
/*  And not only when game is over, but also when fight is over/item gets unregistered, something like that */

@Injectable({
  providedIn: 'root'
})
export class MwItemsService {


  constructor(
    private events: EventsService,
    private state: State,
    private gameObjectsManager: GameObjectsManager,
  ) { }

  public createItem<T extends object>(itemBase: ItemBaseModel<T>): ItemObject<T> {
    const itemIcon = itemBase.icon;

    if (!itemIcon.bgClr) {
      itemIcon.bgClr = Colors.DefaultItemIconBg;
    }

    if (!itemIcon.iconClr) {
      itemIcon.iconClr = Colors.DefaultItemIconClr;
    }

    return this.gameObjectsManager.createNewGameObject(ItemObject<T>, {
      itemBase: itemBase,
      state: itemBase.defaultState,
    });
  }

  public registerItemsEventHandlers(item: ItemObject, ownerPlayer: Player): void {
    this.events.dispatch(InitItem({
      item,
      ownerPlayer,
    }));
  }

  // Later may limit events only to item events
  public triggerEventForAllItemsHandlers(event: EventData): void {
    this.state.eventHandlers.items.triggerAllHandlersByEvent(event);
  }

  public triggerEventForItemHandlers(
    item: ItemObject,
    event: EventData,
  ): void {
    this.state.eventHandlers.items.triggerRefEventHandlers(item, event);
  }
}
