import { Injectable } from "@angular/core";
import { MwCurrentPlayerStateService } from "../mw-current-player-state.service";
import { Notify, StoreClient } from "../state";
import { FightNextRoundStarts } from "../state-values/battle-events";
import { FightStarts } from "../state-values/game-events";

@Injectable()
export class PlayerController extends StoreClient() {

  constructor(
    private curPlayerState: MwCurrentPlayerStateService,
  ) {
    super();
  }

  @Notify(FightNextRoundStarts)
  @Notify(FightStarts)
  public resetCooldowns(): void {
    this.curPlayerState.resetSpellsCooldowns();
  }
}
