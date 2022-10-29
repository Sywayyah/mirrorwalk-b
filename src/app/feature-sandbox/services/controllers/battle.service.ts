import { Injectable } from "@angular/core";
import { PlayerTypeEnum } from "src/app/core/model/main.model";
import { NeutralCampStructure } from "src/app/core/model/structures.types";
import { BattleStateService } from "../mw-battle-state.service";
import { MwCurrentPlayerStateService, PlayerState } from "../mw-current-player-state.service";
import { MwPlayersService } from "../mw-players.service";
import { MwStructuresService } from "../mw-structures.service";
import { Notify, StoreClient, WireMethod } from "../state";
import { FightEnds, FightNextRoundStarts, GroupAttacked, GroupDamagedByGroup, GroupDies, GroupSpeedChanged, GroupTakesDamage, PlayerTargetsSpell, RoundGroupSpendsTurn, RoundGroupTurnEnds, RoundPlayerCountinuesAttacking, RoundPlayerTurnStarts } from "../state-values/battle-events";
import { GroupDamagedByGroupEvent, GroupTakesDamageEvent, PlayerTurnStartEvent, RoundGroupSpendsTurnEvent } from "../state-values/battle.types";
import { FightStarts, FightStartsEvent, PlayerStartsFight } from "../state-values/game-events";
import { PlayerClicksAllyGroup, PlayerClicksAllyGroupEvent, PlayerClicksEnemyGroup, PlayerClicksEnemyGroupEvent } from "../state-values/ui-events";

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

  @WireMethod(PlayerStartsFight)
  public fightStartInitQueue({ players, unitGroups }: FightStartsEvent): void {
    this.battleState.initBattleState(unitGroups, players);

    this.events.dispatch(FightStarts({}));
  }

  @Notify(FightStarts)
  public resetCurrentPlayer(): void {
    this.battleState.resetCurrentPlayer();

    this.battleState.initNextTurnByQueue();
  }

  @Notify(FightNextRoundStarts)
  public resetTurnQueue(): void {
    this.battleState.initNextTurnByQueue();
  }

  @WireMethod(RoundPlayerTurnStarts)
  public changePlayerState({ currentPlayer }: PlayerTurnStartEvent): void {
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
  public groupEndsTurn(): void {
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

  @WireMethod(GroupTakesDamage)
  public registerUnitLossOnDamage({ group, registerLoss, unitLoss }: GroupTakesDamageEvent): void {
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
  public onGroupSpendsTurn({
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
  public resortFightQuery(): void {
    this.battleState.resortFightQuery();
  }

  @WireMethod(PlayerClicksEnemyGroup)
  public handleEnemyCardClick(event: PlayerClicksEnemyGroupEvent): void {
    const playerCurrentState = this.curPlayerState.playerCurrentState;
    if (playerCurrentState === PlayerState.Normal) {
      this.events.dispatch(GroupAttacked({
        attackedGroup: event.attackedGroup,
        attackingGroup: event.attackingGroup,
      }));

      return;
    }

    if (playerCurrentState === PlayerState.SpellTargeting) {
      this.curPlayerState.onCurrentSpellCast();

      this.events.dispatch(PlayerTargetsSpell({
        player: event.attackingPlayer,
        spell: this.curPlayerState.currentSpell,
        target: event.attackedGroup,
      }));

      this.curPlayerState.setSpellsOnCooldown();
    }
  }

  @WireMethod(PlayerClicksAllyGroup)
  public handleAllyGroupClick(event: PlayerClicksAllyGroupEvent): void {
    if (this.curPlayerState.playerCurrentState === PlayerState.SpellTargeting) {
      this.curPlayerState.onCurrentSpellCast();

      const unitGroup = event.unitGroup;

      this.events.dispatch(PlayerTargetsSpell({
        player: unitGroup.ownerPlayerRef,
        spell: this.curPlayerState.currentSpell,
        target: unitGroup,
      }));

      this.curPlayerState.setSpellsOnCooldown();
    }
  }
}
