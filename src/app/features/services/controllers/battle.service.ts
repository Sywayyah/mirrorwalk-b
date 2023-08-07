import { Injectable } from '@angular/core';
import { BeforeBattleInit, CleanUpHandlersOnFightEnd, FightEnds, FightNextRoundStarts, FightStarts, GroupDamagedByGroup, GroupDamagedByGroupEvent, GroupDies, GroupSpeedChanged, GroupTakesDamage, GroupTakesDamageEvent, PlayerTurnStartEvent, RoundGroupSpendsTurn, RoundGroupSpendsTurnEvent, RoundGroupTurnEnds, RoundPlayerCountinuesAttacking, RoundPlayerTurnStarts, UnitHealed, UnitHealedEvent } from 'src/app/core/events';
import { PlayerState, PlayerTypeEnum } from 'src/app/core/players';
import { Notify, StoreClient, WireMethod } from 'src/app/store';
import { BattleStateService } from '../mw-battle-state.service';
import { MwCurrentPlayerStateService } from '../mw-current-player-state.service';
import { MwPlayersService } from '../mw-players.service';
import { MwStructuresService } from '../mw-structures.service';
import { State } from '../state.service';
import { ModsRef } from 'src/app/core/modifiers';

@Injectable()
export class BattleController extends StoreClient() {
  constructor(
    private battleState: BattleStateService,
    private curPlayerState: MwCurrentPlayerStateService,
    private strucuresService: MwStructuresService,
    private playersService: MwPlayersService,
    private state: State,
  ) {
    super();
  }

  @Notify(BeforeBattleInit)
  public beforeBattleInit(): void {
    // apply static mods before battle init, so speed calc will be included
    this.applyStaticModsFromEquippedItems();
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
    const currentStructure = this.strucuresService.currentStruct;

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

  @Notify(RoundPlayerCountinuesAttacking)
  public processAiPlayer(): void {
    if (this.battleState.currentPlayer.type === PlayerTypeEnum.AI && this.enemyHasAnyLivingUnits()) {
      this.battleState.processAiPlayer();
    }
  }

  @WireMethod(RoundGroupSpendsTurn)
  public checkControlWhenGroupRunsOutOfTurns({
    groupHasMoreTurns,
    groupPlayer,
    groupStillAlive,
  }: RoundGroupSpendsTurnEvent): void {
    if (groupPlayer.type === PlayerTypeEnum.AI && groupHasMoreTurns && groupStillAlive && this.enemyHasAnyLivingUnits()) {
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
    this.battleState.resortFightQueue();
  }

  @Notify(FightEnds)
  public cleanUpHandlersOnFightEnd(): void {
    this.cleanupStaticModsFromEquippedItems();

    this.events.dispatch(CleanUpHandlersOnFightEnd());
  }

  @Notify(CleanUpHandlersOnFightEnd)
  public cleanUpHandlers(): void {
    this.state.eventHandlers.spells.removeAllHandlers();
    // need to think about items, they are being initialized outsize of combat
    // this.state.eventHandlers.items.removeAllHandlers();
  }

  private enemyHasAnyLivingUnits(): boolean {
    return this.battleState.playerHasAnyAliveUnits(this.battleState.getEnemyOfPlayer(this.battleState.currentPlayer));
  }

  private applyStaticModsFromEquippedItems(): void {
    this.playersService.getCurrentPlayer().hero.inventory.getEquippedItems().forEach((item) => {
      console.log(item);
      const itemStaticEnemyMods = item.baseType.staticEnemyMods;

      if (itemStaticEnemyMods) {
        this.playersService.getEnemyPlayer().hero.addCommonCombatMods(ModsRef.fromMods(itemStaticEnemyMods));
      }
    });
  }

  private cleanupStaticModsFromEquippedItems(): void {
    this.playersService.getCurrentPlayer().hero.clearCommonCombatMods();
    this.playersService.getEnemyPlayer().hero.clearCommonCombatMods();
  }
}
