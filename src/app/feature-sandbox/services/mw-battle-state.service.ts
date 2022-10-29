import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { PlayerInstanceModel, PlayerModel, UnitGroupInstModel, UnitGroupModel, UnitTypeModel } from 'src/app/core/model/main.model';
import { BattleEventsService } from './mw-battle-events.service';
import { MwCurrentPlayerStateService } from './mw-current-player-state.service';
import { MwPlayersService } from './mw-players.service';
import { MwStructuresService } from './mw-structures.service';
import { MwUnitGroupsService } from './mw-unit-groups.service';
import { EventsService } from './state';
import { FightNextRoundStarts, GroupAttacked, RoundPlayerCountinuesAttacking, RoundPlayerTurnStarts } from './state-values/battle-events';
// import { EventsService } from './state';
// import { FightStarts } from './state-values/battle-events';
import { ActionHintModel, BattleEvent } from "./types";


@Injectable({
  providedIn: 'root',
})
export class BattleStateService {

  public currentPlayer!: PlayerInstanceModel;
  public currentUnitGroup!: UnitGroupInstModel;
  public battleEvent$: Subject<void> = new BehaviorSubject<void>(undefined);

  public heroesUnitGroupsMap: Map<PlayerModel, UnitGroupInstModel[]> = new Map();
  public currentGroupTurnsLeft: number = 0;

  public round: number = 1;

  public hintMessage$: BehaviorSubject<ActionHintModel | null> = new BehaviorSubject<ActionHintModel | null>(null);

  public playerLosses: Record<string, Map<UnitTypeModel, number>> = {};

  private playersRivalryMap: Map<PlayerModel, PlayerModel> = new Map();

  private initialUnitGroups!: UnitGroupInstModel[];
  private fightQueue!: UnitGroupInstModel[];
  private players!: PlayerInstanceModel[];


  constructor(
    private readonly battleEventsService: BattleEventsService,
    private readonly playersService: MwPlayersService,
    private readonly structuresService: MwStructuresService,
    private readonly curPlayerState: MwCurrentPlayerStateService,
    private readonly units: MwUnitGroupsService,
    private newEvents: EventsService,
  ) { }

  public resetCurrentPlayer(): void {
    this.currentPlayer = null as unknown as PlayerInstanceModel;
  }

  public initBattleState(
    unitGroups: UnitGroupInstModel[],
    players: PlayerInstanceModel[],
  ): void {
    this.initialUnitGroups = unitGroups;

    this.players = players;

    this.playersRivalryMap.set(players[0], players[1]);
    this.playersRivalryMap.set(players[1], players[0]);

    this.initPlayerLossesMap();

    this.initPlayerUnitGroupsMap(unitGroups);

    this.resetFightQueue();

    this.updateGroupsTailHpAndCombatInfo();

    this.refreshUnitGroups();

    // this.battleEventsService.onEvents({
    //   [BattleEvent.Fight_Starts]: event => {
    //     console.log('Battle starts');
    //     this.resetCurrentPlayer();

    //     this.initNextTurnByQueue();
    //   },
    //   [BattleEvent.Fight_Next_Round_Starts]: event => {
    //     console.log('Next round');
    //     this.initNextTurnByQueue();
    //   },

    //   [BattleEvent.Round_Player_Turn_Starts]: event => {
    //     console.log('Player starts turn');
    //     if (event.currentPlayer.type === PlayerTypeEnum.AI) {
    //       console.log(`AI player's Turn`)
    //       this.curPlayerState.setPlayerState(PlayerState.WaitsForTurn);
    //       this.processAiPlayer();
    //     } else {
    //       this.curPlayerState.setPlayerState(PlayerState.Normal);
    //     }
    //   },

    //   [BattleEvent.Round_Player_Continues_Attacking]: event => {
    //     if (this.currentPlayer.type === PlayerTypeEnum.AI) {
    //       this.processAiPlayer();
    //     }
    //   },

    //   [BattleEvent.Round_Group_Turn_Ends]: event => {
    //     this.initNextTurnByQueue(true);
    //   },

    //   [BattleEvent.On_Group_Damaged_By_Group]: event => {
    //     if (!event.loss) {
    //       return;
    //     }

    //     this.registerPlayerUnitLoss(event.attackedGroup, event.loss);
    //   },

    //   [BattleEvent.On_Group_Takes_Damage]: event => {
    //     if (event.registerLoss && event.unitLoss) {
    //       this.registerPlayerUnitLoss(event.group, event.unitLoss);
    //     }
    //   },

    //   [BattleEvent.On_Group_Dies]: event => {
    //     const currentStructure = this.structuresService.currentStruct as NeutralCampStructure;

    //     /* Reflect dying groups on win. This logic may be revisited later */
    //     const currentPlayerUnitGroups = this.getAliveUnitsOfPlayer(this.players[0]);

    //     if (!(currentPlayerUnitGroups).length) {
    //       this.playersService.getCurrentPlayer().unitGroups = currentPlayerUnitGroups;

    //       this.battleEventsService.dispatchEvent({
    //         type: BattleEvent.Fight_Ends,
    //         win: false,
    //         struct: currentStructure,
    //       });
    //     }

    //     if (!(this.getAliveUnitsOfPlayer(this.players[1])).length) {
    //       this.playersService.getCurrentPlayer().unitGroups = currentPlayerUnitGroups;

    //       currentStructure.isInactive = true;

    //       this.battleEventsService.dispatchEvent({
    //         type: BattleEvent.Fight_Ends,
    //         win: true,
    //         struct: currentStructure,
    //       });
    //     }

    //   },

    //   [BattleEvent.Round_Group_Spends_Turn]: event => {
    //     console.log('spends a turn');
    //     if (event.groupPlayer.type === PlayerTypeEnum.AI && event.groupHasMoreTurns && event.groupStillAlive) {
    //       this.processAiPlayer();
    //     }

    //     if (!event.groupHasMoreTurns || !event.groupStillAlive) {
    //       this.battleEventsService.dispatchEvent({
    //         type: BattleEvent.Round_Group_Turn_Ends,
    //         playerEndsTurn: event.groupPlayer,
    //       });
    //     }
    //   },

    //   [BattleEvent.Combat_Unit_Speed_Changed]: () => {
    //     this.resortFightQuery();
    //   },

    //   [BattleEvent.UI_Player_Clicks_Enemy_Group]: event => {
    //     console.log('player clicks');
    //     if (this.curPlayerState.playerCurrentState === PlayerState.Normal) {
    //       this.battleEventsService.dispatchEvent({
    //         type: BattleEvent.Combat_Group_Attacked,
    //         attackedGroup: event.attackedGroup,
    //         attackerGroup: event.attackingGroup,
    //       });
    //     }
    //     if (this.curPlayerState.playerCurrentState === PlayerState.SpellTargeting) {
    //       this.curPlayerState.onCurrentSpellCast();

    //       this.battleEventsService.dispatchEvent({
    //         type: BattleEvent.Player_Targets_Spell,
    //         player: event.attackingPlayer,
    //         spell: this.curPlayerState.currentSpell,
    //         target: event.attackedGroup,
    //       });

    //       this.curPlayerState.setSpellsOnCooldown();
    //     }
    //   },

    //   [BattleEvent.UI_Player_Clicks_Ally_Group]: (event) => {
    //     if (this.curPlayerState.playerCurrentState === PlayerState.SpellTargeting) {
    //       this.curPlayerState.onCurrentSpellCast();
    //       this.battleEventsService.dispatchEvent({
    //         type: BattleEvent.Player_Targets_Spell,
    //         player: event.unitGroup.ownerPlayerRef,
    //         spell: this.curPlayerState.currentSpell,
    //         target: event.unitGroup,
    //       });
    //       this.curPlayerState.setSpellsOnCooldown();
    //     }
    //   }

    // }).pipe(
    //   takeUntil(this.battleEventsService.onEvent(BattleEvent.Fight_Ends)),
    // ).subscribe(() => {
    //   this.battleEvent$.next();
    // });


    // this.battleEventsService.dispatchEvent({
    //   type: BattleEvent.Fight_Starts,
    // });
  }

  private initPlayerLossesMap() {
    this.players.forEach(player => {
      this.playerLosses[player.id] = new Map();
    });
  }

  public initNextTurnByQueue(removeCurrentGroupFromQueue: boolean = false): void {
    /* Simultaneous, the unit who dies on counterattack removes because of dying and initNextTurn removes one more unit */
    if (removeCurrentGroupFromQueue && this.currentUnitGroup.count) {
      this.fightQueue.shift();
    }

    if (!this.fightQueue.length) {
      this.resetFightQueue();
      this.resetGroupsTurnsLeft();

      this.round++;
      // this.battleEventsService.dispatchEvent({
      //   type: BattleEvent.Fight_Next_Round_Starts,
      //   round: this.round,
      // });
      this.newEvents.dispatch(FightNextRoundStarts({
        round: this.round,
      }));
      return;
    }

    const firstUnitGroup = this.fightQueue[0];
    const previousPlayer = this.currentPlayer;
    this.currentPlayer = firstUnitGroup.ownerPlayerRef;
    this.currentUnitGroup = firstUnitGroup;
    this.currentGroupTurnsLeft = this.currentUnitGroup.type.defaultTurnsPerRound;

    if (this.currentPlayer !== previousPlayer) {
      // this.battleEventsService.dispatchEvent({
      //   type: BattleEvent.Round_Player_Turn_Starts,
      //   currentPlayer: this.currentPlayer,
      //   previousPlayer: previousPlayer,
      // });
      this.newEvents.dispatch(RoundPlayerTurnStarts({
          currentPlayer: this.currentPlayer,
          previousPlayer: previousPlayer,
      }));
    } else {
      // this.battleEventsService.dispatchEvent({
      //   type: BattleEvent.Round_Player_Continues_Attacking,
      // });
      this.newEvents.dispatch(RoundPlayerCountinuesAttacking({}));
    }
  }

  public getFightQueue(): UnitGroupInstModel[] {
    return this.fightQueue;
  }

  public handleDefeatedUnitGroup(unitGroup: UnitGroupInstModel): void {
    const enemyPlayer = unitGroup.ownerPlayerRef;
    const enemyPlayerGroups = this.heroesUnitGroupsMap.get(enemyPlayer) as UnitGroupInstModel[];
    const indexOfUnitGroup = enemyPlayerGroups?.indexOf(unitGroup);
    unitGroup.fightInfo.isAlive = false;

    // enemyPlayerGroups.splice(indexOfUnitGroup, 1);
    this.heroesUnitGroupsMap.set(enemyPlayer, enemyPlayerGroups);

    const indexOfRemovedGroupInQueue = this.fightQueue.indexOf(unitGroup);
    if (indexOfRemovedGroupInQueue !== -1) {
      this.fightQueue.splice(indexOfRemovedGroupInQueue, 1);
    }
  }

  public getEnemyOfPlayer(player: PlayerModel): PlayerInstanceModel {
    return this.playersRivalryMap.get(player) as PlayerInstanceModel;
  }

  public processAiPlayer(): void {
    setTimeout(() => {
      const enemyUnitGroups = this.getAliveUnitsOfPlayer(this.getEnemyOfPlayer(this.currentPlayer) as PlayerInstanceModel);
      const randomGroupIndex = Math.round(Math.random() * (enemyUnitGroups.length - 1));
      const targetGroup = enemyUnitGroups[randomGroupIndex];

      // this.battleEventsService.dispatchEvent({
      //   type: BattleEvent.Combat_Group_Attacked,
      //   attackedGroup: targetGroup,
      //   attackerGroup: this.currentUnitGroup,
      // })
      this.newEvents.dispatch(GroupAttacked({
        attackedGroup: targetGroup,
        attackingGroup: this.currentUnitGroup,
      }));
    }, 1000);
  }

  public getUnitGroupTotalDamage(unitGroup: UnitGroupModel): number {
    return unitGroup.count * unitGroup.type.baseStats.damageInfo.maxDamage;
  }

  public resortFightQuery(): void {
    this.fightQueue = [this.fightQueue[0], ...this.sortUnitsBySpeed(this.fightQueue.slice(1))];
  }

  public getAliveUnitsOfPlayer(player: PlayerInstanceModel): UnitGroupInstModel[] {
    return (this.heroesUnitGroupsMap.get(player) as UnitGroupInstModel[]).filter(
      unitGroup => unitGroup.fightInfo.isAlive,
    );
  }

  public registerPlayerUnitLoss(attackedGroup: UnitGroupInstModel, unitLoss: number): void {
    /* todo: Final reward seems to not match reward preview */
    const playersLossesMap = this.playerLosses[attackedGroup.ownerPlayerRef.id];
    const attackedGroupUnitType = attackedGroup.type;
    const typeLossCount = playersLossesMap.get(attackedGroupUnitType);
    if (typeLossCount) {
      playersLossesMap.set(attackedGroupUnitType, typeLossCount + unitLoss);
    } else {
      playersLossesMap.set(attackedGroupUnitType, unitLoss);
    }
  }

  private resetGroupsTurnsLeft(): void {
    this.fightQueue.forEach((unitGroup: UnitGroupModel) => unitGroup.turnsLeft = unitGroup.type.defaultTurnsPerRound);
  }

  private sortUnitsBySpeed(units: UnitGroupInstModel[]): UnitGroupInstModel[] {
    return units.sort((a, b) => {
      return this.units.getUnitGroupSpeed(b) - this.units.getUnitGroupSpeed(a);
    });
  }

  private resetFightQueue(): void {
    this.fightQueue = this.sortUnitsBySpeed([
      ...this.getAliveUnitsOfPlayer(this.players[0]),
      ...this.getAliveUnitsOfPlayer(this.players[1]),
    ]);
  }

  private initPlayerUnitGroupsMap(unitGroups: UnitGroupInstModel[]): void {
    this.heroesUnitGroupsMap.clear();
    unitGroups.forEach(unitGroup => {
      const unitGroupPlayer = unitGroup.ownerPlayerRef;
      const playerGroups = this.heroesUnitGroupsMap.get(unitGroupPlayer);
      if (playerGroups) {
        playerGroups.push(unitGroup);
      } else {
        this.heroesUnitGroupsMap.set(unitGroupPlayer, [unitGroup]);
      }
    });
  }

  private updateGroupsTailHpAndCombatInfo(): void {
    this.players.forEach((player) => {
      player.unitGroups.forEach(unitGroup => {
        if (!unitGroup.tailUnitHp) {
          unitGroup.tailUnitHp = unitGroup.type.baseStats.health;
        }
        unitGroup.fightInfo.initialCount = unitGroup.count;
      })
    });
  }

  private refreshUnitGroups(): void {
    this.players.forEach((player) => {
      player.unitGroups.forEach(unitGroup => {
        unitGroup.turnsLeft = unitGroup.type.defaultTurnsPerRound;
      })
    });
  }


}
