import { Injectable } from '@angular/core';
import { Colors } from 'src/app/core/dictionaries/colors.const';
import { GameEventsHandlers, GameEventsMapping, GameEventTypes, ItemBaseModel, ItemInstanceModel } from 'src/app/core/model/items/items.types';
import { PlayerInstanceModel } from 'src/app/core/model/main.model';
import { BattleEventsService } from './mw-battle-events.service';
import type { CombatInteractorService } from './mw-combat-interactor.service';
import { BattleEvent } from './types';

@Injectable({
  providedIn: 'root'
})
export class MwItemsService {

  private itemsHandlersMap: Map<ItemInstanceModel, GameEventsHandlers> = new Map();
  private combatInteractorRef!: CombatInteractorService;

  constructor(
    private readonly events: BattleEventsService,
  ) {
    this.events.onEvents({
      [BattleEvent.Fight_Next_Round_Starts]: event => {
        this.triggerEventForAllItemsHandlers(GameEventTypes.NewRoundBegins, { round: event.round });
      },
      [BattleEvent.Fight_Starts]: event => {
        this.triggerEventForAllItemsHandlers(GameEventTypes.NewRoundBegins, { round: 0 });
      }
    }).subscribe();
  }

  public initService(combatInteractor: CombatInteractorService): void {
    this.combatInteractorRef = combatInteractor;
  }

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
      currentDescription: itemBase.description(itemBase),
      state: itemBase.defaultState,
    } as unknown as ItemInstanceModel;
  }

  public registerItemsEventHandlers(item: ItemInstanceModel, ownerPlayer: PlayerInstanceModel): void {
    item.baseType.config.init({
      actions: this.combatInteractorRef.createActionsApiRef(),
      events: {
        on: (newEventHandlers: GameEventsHandlers) => {
          const prevEventHandlers = this.itemsHandlersMap.get(item) ?? {};

          this.itemsHandlersMap.set(item, { ...prevEventHandlers, ...newEventHandlers });
        }
      },
      ownerHero: ownerPlayer.hero,
      ownerPlayer: ownerPlayer,
      thisInstance: item,
    });
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
