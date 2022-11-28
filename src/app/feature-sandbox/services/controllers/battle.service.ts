import { Injectable } from "@angular/core";
import { PlayerTypeEnum } from 'src/app/core/players';
import { NeutralCampStructure } from 'src/app/core/structures';
import { BattleStateService, MwCurrentPlayerStateService, MwPlayersService, MwStructuresService, PlayerState } from "..";
import { FightEnds, FightNextRoundStarts, FightStarts, GroupDamagedByGroup, GroupDamagedByGroupEvent, GroupDies, GroupSpeedChanged, GroupTakesDamage, GroupTakesDamageEvent, PlayerTurnStartEvent, RoundGroupSpendsTurn, RoundGroupSpendsTurnEvent, RoundGroupTurnEnds, RoundPlayerCountinuesAttacking, RoundPlayerTurnStarts, UnitHealed, UnitHealedEvent } from "../events";
import { Notify, StoreClient, WireMethod } from "../store";

@Injectable()
export class BattleController extends StoreClient() {
  constructor(
    private battleState: BattleStateService,
    private curPlayerState: MwCurrentPlayerStateService,
    private strucuresService: MwStructuresService,
    private playersService: MwPlayersService,
  ) {
    super();
  }

  @Notify(FightStarts)
  public prepareFightState(): void {
    this.battleState.resetCurrentPlayer();

    this.battleState.initNextTurnByQueue();
  }

  @Notify(FightNextRoundStarts)
  public recalcTurnQueue(): void {
    this.battleState.initNextTurnByQueue();
  }

  @WireMethod(RoundPlayerTurnStarts)
  public updatePlayerState({ currentPlayer }: PlayerTurnStartEvent): void {
    if (currentPlayer.type === PlayerTypeEnum.AI) {
      this.curPlayerState.setPlayerState(PlayerState.WaitsForTurn);

      this.battleState.processAiPlayer();
    } else {
      this.curPlayerState.setPlayerState(PlayerState.Normal);
    }
  }

  @Notify(RoundPlayerCountinuesAttacking)
  public processAiPlayer(): void {
    if (this.battleState.currentPlayer.type === PlayerTypeEnum.AI) {
      this.battleState.processAiPlayer();
    }
  }

  @Notify(RoundGroupTurnEnds)
  public updateQueueOnGroupTurnEnd(): void {
    this.battleState.initNextTurnByQueue(true);
  }

  @WireMethod(GroupDamagedByGroup)
  public registerDamageFromOtherGroup(event: GroupDamagedByGroupEvent): void {
    if (!event.loss) {
      return;
    }

    this.battleState.registerPlayerUnitLoss(
      event.attackedGroup,
      event.loss,
    );
  }

  @WireMethod(UnitHealed)
  public registerHealedUnits(event: UnitHealedEvent): void {
    if (!event.healedUnitsCount) {
      return;
    }

    this.battleState.registerPlayerUnitLoss(
      event.target,
      -event.healedUnitsCount,
    );
  }

  @WireMethod(GroupTakesDamage)
  public registerUnitLossOnAnyOtherDamageSources(
    { group, registerLoss, unitLoss }: GroupTakesDamageEvent,
  ): void {
    if (registerLoss && unitLoss) {
      this.battleState.registerPlayerUnitLoss(group, unitLoss);
    }
  }

  @Notify(GroupDies)
  public checkIfFightEndedOnUnitGroupDeath(): void {
    const currentStructure = this.strucuresService.currentStruct as NeutralCampStructure;

    const currentPlayer = this.playersService.getCurrentPlayer();

    const currentPlayerUnitGroups = this.battleState.getAliveUnitsOfPlayer(currentPlayer);

    if (!currentPlayerUnitGroups.length) {
      this.playersService.getCurrentPlayer().unitGroups = currentPlayerUnitGroups;

      this.events.dispatch(FightEnds({
        struct: currentStructure,
        win: false,
      }));

      return;
    }

    const enemyPlayer = this.battleState.getEnemyOfPlayer(currentPlayer);

    if (!this.battleState.getAliveUnitsOfPlayer(enemyPlayer).length) {
      this.playersService.getCurrentPlayer().unitGroups = currentPlayerUnitGroups;

      currentStructure.isInactive = true;

      this.events.dispatch(FightEnds({
        struct: currentStructure,
        win: true,
      }));

      return;
    }
  }

  @WireMethod(RoundGroupSpendsTurn)
  public checkControlWhenGroupRunsOutOfTurns({
    groupHasMoreTurns,
    groupPlayer,
    groupStillAlive,
  }: RoundGroupSpendsTurnEvent): void {
    if (groupPlayer.type === PlayerTypeEnum.AI && groupHasMoreTurns && groupStillAlive) {
      this.battleState.processAiPlayer();
    }

    if (!groupHasMoreTurns || !groupStillAlive) {
      this.events.dispatch(RoundGroupTurnEnds({
        playerEndsTurn: groupPlayer,
      }));
    }
  }

  @Notify(GroupSpeedChanged)
  public updateFightQueryDueToSpeedChange(): void {
    this.battleState.resortFightQuery();
  }
}
