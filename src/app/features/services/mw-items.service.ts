import { Injectable } from '@angular/core';
import { Colors } from 'src/app/core/assets';
import { GameEventsHandlers, GameEventsMapping, ItemBaseModel, ItemInstanceModel } from 'src/app/core/items';
import { PlayerInstanceModel } from 'src/app/core/players';
import { EventsService } from 'src/app/store';
import { InitItem } from './events';

@Injectable({
  providedIn: 'root'
})
export class MwItemsService {

  public itemsHandlersMap: Map<ItemInstanceModel, GameEventsHandlers> = new Map();

  constructor(
    private events: EventsService,
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

  public triggerEventForAllItemsHandlers<T extends keyof GameEventsHandlers>(
    eventType: T,
    data: GameEventsMapping[T],
  ): void {
    this.itemsHandlersMap.forEach(spellHandlers => {
      (spellHandlers?.[eventType] as (arg: GameEventsMapping[T]) => void)?.(data);
    });
  }

  public triggerEventForItemHandlers<T extends keyof GameEventsHandlers>(
    spell: ItemInstanceModel,
    eventType: T,
    data: GameEventsMapping[T],
  ): void {
    (this.itemsHandlersMap.get(spell)?.[eventType] as (arg: GameEventsMapping[T]) => void)?.(data);
  }
}
