import { inject, Injectable } from '@angular/core';
import {
  BattleCommandEvents,
  BeforeBattleInit,
  CleanUpHandlersOnFightEnd,
  FightEnds,
  FightNextRoundStarts,
  FightStarts,
  GroupDies,
  GroupSpeedChanged,
  PlayerTurnStartEvent,
  RoundGroupSpendsTurn,
  RoundGroupSpendsTurnEvent,
  RoundGroupTurnEnds,
  RoundPlayerCountinuesAttacking,
  RoundPlayerTurnStarts,
  UnitHealed,
  UnitHealedEvent,
} from 'src/app/core/events';
import { DefendAction, RegisterUnitLoss } from 'src/app/core/events/battle/commands';
import { ModsRef } from 'src/app/core/modifiers';
import { PlayerState, PlayerTypeEnum } from 'src/app/core/players';
import { messageWrapper } from 'src/app/core/vfx';
import { Notify, StoreClient, WireMethod } from 'src/app/store';
import { VfxService } from '../../shared/components';
import { GameObjectsManager } from '../game-objects-manager.service';
import { MwBattleLogService } from '../mw-battle-log.service';
import { BattleStateService } from '../mw-battle-state.service';
import { MwCurrentPlayerStateService } from '../mw-current-player-state.service';
import { MwPlayersService } from '../mw-players.service';
import { MwStructuresService } from '../mw-structures.service';
import { State } from '../state.service';
import { LossMode } from 'src/app/core/game-settings';

@Injectable()
export class BattleController extends StoreClient() {
  private readonly battleState = inject(BattleStateService);
  private readonly curPlayerState = inject(MwCurrentPlayerStateService);
  private readonly strucuresService = inject(MwStructuresService);
  private readonly playersService = inject(MwPlayersService);
  private readonly vfx = inject(VfxService);
  private readonly state = inject(State);
  private readonly historyLog = inject(MwBattleLogService);
  private readonly gameObjectsManager = inject(GameObjectsManager);

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

  @Notify(DefendAction)
  public defendAction(): void {
    const currentUnitGroup = this.battleState.state.get().currentUnitGroup!;
    currentUnitGroup.addCombatMods({ fixedSpeed: 5, heroBonusDefence: 5, defending: true });

    this.battleState.resortFightQueue(true);
    this.vfx.createDroppingMessageForContainer(
      currentUnitGroup.id,
      {
        html: messageWrapper(`Defending!`, { width: 80 }),
      },
      { duration: 1000 },
    );

    this.historyLog.logSimpleMessage(
      `${currentUnitGroup.count} ${currentUnitGroup.type.name} choose to defend. Their speed is fixed to 5, and armor is increased by 5.`,
    );
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

  @WireMethod(UnitHealed)
  public registerHealedUnits(event: UnitHealedEvent): void {
    if (!event.healedUnitsCount) {
      return;
    }

    this.battleState.registerPlayerUnitLoss(event.target, -event.healedUnitsCount);
  }

  @WireMethod(RegisterUnitLoss)
  public registerUnitLossOnAnyOtherDamageSources({ loss, unit }: BattleCommandEvents['RegisterUnitLoss']): void {
    this.battleState.registerPlayerUnitLoss(unit, loss);
  }

  @Notify(GroupDies)
  public checkIfFightEndedOnUnitGroupDeath(): void {
    const currentStructure = this.strucuresService.currentStruct;

    const currentPlayer = this.playersService.getCurrentPlayer();

    const currentPlayerAliveUnits = this.battleState.getAliveUnitsOfPlayer(currentPlayer);
    // todo: cleanup battle state on dead/fight ends

    // if current player doesn't have unit groups left
    if (!currentPlayerAliveUnits.length) {
      // todo: handle it differently, don't need to call this method
      this.playersService.getCurrentPlayer().hero.setUnitGroups(currentPlayerAliveUnits);

      this.events.dispatch(
        FightEnds({
          struct: currentStructure,
          win: false,
        }),
      );

      return;
    }

    const enemyPlayer = this.battleState.getEnemyOfPlayer(currentPlayer);
    const aliveUnitsOfEnemyPlayer = this.battleState.getAliveUnitsOfPlayer(enemyPlayer);

    // if enemy units doesn't have unit groups left
    // todo: handle the case then only summons left
    if (!aliveUnitsOfEnemyPlayer.length) {
      const deadUnitsOfCurrentPlayer = this.battleState.getDeadUnitsOfPlayer(currentPlayer);
      const summonedUnitsOfCurrentPlayer = this.battleState.getSummonsOfPlayer(currentPlayer);

      // todo: recheck later, logic for restoring losses
      const restoreLosses = this.state.gameSettings.get().lossToNeutrals === LossMode.None;

      if (restoreLosses) {
        currentPlayer.hero.unitGroups.forEach((unit) => {
          unit.restoreBattleLosses();});
      }
      const deadUnitsOfEnemyPlayer = this.battleState.getDeadUnitsOfPlayer(enemyPlayer);

      [
        ...(restoreLosses ? [] : deadUnitsOfCurrentPlayer),
        ...deadUnitsOfEnemyPlayer,
        ...summonedUnitsOfCurrentPlayer,
      ].forEach((unitGroup) => {
        this.gameObjectsManager.destroyObject(unitGroup);
      });

      const finalCurrentUnitsOfPlayer = currentPlayerAliveUnits.filter(
        (unit) => !unit.modGroup.getModValue('isSummon'),
      );
      const currentHero = this.playersService.getCurrentPlayer().hero;

      // reset hero cooldowns if any
      currentHero.spells.forEach((spell) => spell.clearCooldown());

      // remove dead units from slots
      currentHero.unitGroups
        .filter((unitGroup) => !unitGroup.isAlive)
        .forEach((unitGroup) => {
          const dyingUnitSlot = currentHero.getAllSlots().find((slot) => slot.unitGroup === unitGroup);

          if (dyingUnitSlot) {
            dyingUnitSlot.unitGroup = null;
          }
        });

      currentHero.setUnitGroups(finalCurrentUnitsOfPlayer, false);

      currentStructure.isInactive = true;

      this.events.dispatch(
        FightEnds({
          struct: currentStructure,
          win: true,
        }),
      );

      return;
    }
  }

  @Notify(RoundPlayerCountinuesAttacking)
  public processAiPlayer(): void {
    if (this.battleState.state.get().currentPlayer!.type === PlayerTypeEnum.AI && this.enemyHasAnyLivingUnits()) {
      this.battleState.processAiPlayer();
    }
  }

  @WireMethod(RoundGroupSpendsTurn)
  public checkControlWhenGroupRunsOutOfTurns({
    groupHasMoreTurns,
    groupPlayer,
    groupStillAlive,
  }: RoundGroupSpendsTurnEvent): void {
    if (
      groupPlayer.type === PlayerTypeEnum.AI &&
      groupHasMoreTurns &&
      groupStillAlive &&
      this.enemyHasAnyLivingUnits()
    ) {
      this.battleState.processAiPlayer();
    }

    if (!groupHasMoreTurns || !groupStillAlive) {
      this.events.dispatch(
        RoundGroupTurnEnds({
          playerEndsTurn: groupPlayer,
        }),
      );
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
    this.state.initializedSpells.get().spells.forEach((spell) => spell.removeCombatHandlers());
    this.state.initializedSpells.revert();

    // need to think about items, they are being initialized outside of combat
    // this.state.eventHandlers.items.removeAllHandlers();
  }

  private enemyHasAnyLivingUnits(): boolean {
    return this.battleState.playerHasAnyAliveUnits(
      this.battleState.getEnemyOfPlayer(this.battleState.state.get().currentPlayer!),
    );
  }

  private applyStaticModsFromEquippedItems(): void {
    this.playersService
      .getCurrentPlayer()
      .hero.inventory.getEquippedItems()
      .forEach((item) => {
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
