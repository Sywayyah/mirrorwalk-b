import { Injectable } from "@angular/core";
import { MwCurrentPlayerStateService } from "../";
import { FightNextRoundStarts, FightStarts } from "../events";
import { Notify, StoreClient } from "../store";

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
