import { Injectable } from "@angular/core";
import { GameEventTypes } from "src/app/core/model/items/items.types";
import { MwItemsService } from "../mw-items-service.service";
import { Notify, StoreClient, WireMethod } from "../state";
import { FightNextRoundStarts } from "../state-values/battle-events";
import { NextRoundStarts } from "../state-values/battle.types";
import { FightStarts } from "../state-values/game-events";

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
