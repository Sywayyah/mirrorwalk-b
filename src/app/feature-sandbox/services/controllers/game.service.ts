import { Injectable } from '@angular/core';
import { FightStarts, FightStartsEvent, PlayerStartsFight, StructSelected, StructSelectedEvent } from '../events';
import { BattleStateService } from '../mw-battle-state.service';
import { MwStructuresService } from '../mw-structures.service';
import { StoreClient, WireMethod } from '../store';


@Injectable()
export class GameController extends StoreClient() {

  constructor(
    private battleState: BattleStateService,
    private structuresService: MwStructuresService,
  ) {
    super();
  }

  @WireMethod(PlayerStartsFight)
  public fightStartInitQueue({ players, unitGroups }: FightStartsEvent): void {
    this.battleState.initBattleState(unitGroups, players);

    this.events.dispatch(FightStarts({}));
  }


  @WireMethod(StructSelected)
  public onStructSelected(event: StructSelectedEvent): void {
    this.structuresService.currentStruct = event.struct;
  }
}
