import { Injectable } from "@angular/core";
import { FightEnds, FightEndsEvent, FightNextRoundStarts, FightStarts, GroupDamagedByGroup, GroupDamagedByGroupEvent, NextRoundStarts, PlayerTurnStartEvent, RoundPlayerTurnStarts } from "../events";
import { MwBattleLogService } from "../";
import { Notify, StoreClient, WireMethod } from "../store";

@Injectable()
export class BattleLogController extends StoreClient() {

  constructor(
    private battleLog: MwBattleLogService,
  ) {
    super();
  }

  @Notify(FightStarts)
  public clearLogOnFightStart(): void {
    this.battleLog.history = [];
  }

  @WireMethod(GroupDamagedByGroup)
  public logGroupDamagedByGroup({
    attackingGroup,
    attackedGroup,
    damage,
    loss,
  }: GroupDamagedByGroupEvent): void {
    this.battleLog.logDealtDamageMessage({
      attacked: attackedGroup.type,
      attackedPlayer: attackedGroup.ownerPlayerRef,
      attacker: attackingGroup.type,
      attackingPlayer: attackingGroup.ownerPlayerRef,
      damage,
      losses: loss,
    });
  }

  @WireMethod(RoundPlayerTurnStarts)
  public logPlayerStartsTurn(event: PlayerTurnStartEvent): void {
    this.battleLog.logRoundInfoMessage(`Player ${event.currentPlayer.type} starts his turn`);
  }

  @WireMethod(FightEnds)
  public logFightEnds(event: FightEndsEvent): void {
    this.battleLog.logRoundInfoMessage(event.win ? 'Win!' : 'Defeat');
  }

  @WireMethod(FightNextRoundStarts)
  public logNextRoundStarts(event: NextRoundStarts): void {
    this.battleLog.logRoundInfoMessage(`Round ${event.round} starts`);
  }
}