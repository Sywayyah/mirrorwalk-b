import { Injectable } from '@angular/core';
import { Colors } from 'src/app/core/assets';
import { InitItem } from 'src/app/core/events';
import { ItemBaseModel, ItemInstanceModel } from 'src/app/core/items';
import { PlayerInstanceModel } from 'src/app/core/players';
import { EventData, EventsService } from 'src/app/store';
import { State } from './state.service';

/* Unregister All items and spell handlers when Game was over... */
/*  And not only when game is over, but also when fight is over/item gets unregistered, something like that */

@Injectable({
  providedIn: 'root'
})
export class MwItemsService {


  constructor(
    private events: EventsService,
    private state: State,
  ) { }

  public createItem<T extends object>(itemBase: ItemBaseModel<T>): ItemInstanceModel {
    const itemIcon = itemBase.icon;

    if (!itemIcon.bgClr) {
      itemIcon.bgClr = Colors.DefaultItemIconBg;
    }

    if (!itemIcon.iconClr) {
      itemIcon.iconClr = Colors.DefaultItemIconClr;
    }

    return {
      baseType: itemBase,
      currentDescription: '',
      state: itemBase.defaultState,
    } as unknown as ItemInstanceModel;
  }

  public registerItemsEventHandlers(item: ItemInstanceModel, ownerPlayer: PlayerInstanceModel): void {
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
    item: ItemInstanceModel,
    event: EventData,
  ): void {
    this.state.eventHandlers.items.triggerRefEventHandlers(item, event);
  }
}
