import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { PlayerInstanceModel, PlayerModel, PlayerTypeEnum, UnitGroupInstModel, UnitGroupModel, UnitTypeModel } from 'src/app/core/model/main.model';
import { NeutralCampStructure } from 'src/app/core/model/structures.types';
import { BattleEventsService } from './mw-battle-events.service';
import { MwCurrentPlayerStateService, PlayerState } from './mw-current-player-state.service';
import { MwPlayersService } from './mw-players.service';
import { MwStructuresService } from './mw-structures.service';
import { BattleEventTypeEnum, ActionHintModel } from "./types";


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
  ) { }

  public initBattle(
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

    this.updateGroupsTailHp();


    this.battleEventsService.onEvents({
      [BattleEventTypeEnum.Fight_Starts]: event => {
        console.log('Battle starts');
        this.currentPlayer = null as unknown as PlayerInstanceModel;
        this.initNextTurnByQueue();
      },
      [BattleEventTypeEnum.Fight_Next_Round_Starts]: event => {
        console.log('Next round');
        this.initNextTurnByQueue();
      },

      [BattleEventTypeEnum.Round_Player_Turn_Starts]: event => {
        console.log('Player starts turn');
        if (event.currentPlayer.type === PlayerTypeEnum.AI) {
          console.log(`AI player's Turn`)
          this.curPlayerState.playerCurrentState = PlayerState.WaitsForTurn;
          this.processAiPlayer();
        } else {
          this.curPlayerState.playerCurrentState = PlayerState.Normal;
        }
      },

      [BattleEventTypeEnum.Round_Player_Continues_Attacking]: event => {
        if (this.currentPlayer.type === PlayerTypeEnum.AI) {
          this.processAiPlayer();
        }
      },

      [BattleEventTypeEnum.Round_Group_Turn_Ends]: event => {
        this.initNextTurnByQueue(true);
      },

      [BattleEventTypeEnum.On_Group_Damaged_By_Group]: event => {
        if (!event.loss) {
          return;
        }

        this.registerPlayerUnitLoss(event.attackedGroup, event.loss);
      },

      [BattleEventTypeEnum.On_Group_Takes_Damage]: event => {
        if (event.registerLoss && event.unitLoss) {
          this.registerPlayerUnitLoss(event.group, event.unitLoss);
        }
      },

      [BattleEventTypeEnum.On_Group_Dies]: event => {
        const currentStructure = this.structuresService.currentStruct as NeutralCampStructure;

        /* Reflect dying groups on win. This logic may be revisited later */
        const currentPlayerUnitGroups = this.heroesUnitGroupsMap.get(this.players[0]) as UnitGroupInstModel[];

        if (!(currentPlayerUnitGroups).length) {
          this.playersService.getCurrentPlayer().unitGroups = currentPlayerUnitGroups;

          this.battleEventsService.dispatchEvent({
            type: BattleEventTypeEnum.Fight_Ends,
            win: false,
            struct: currentStructure,
          });
        }

        if (!(this.heroesUnitGroupsMap.get(this.players[1]) as UnitGroupModel[]).length) {
          this.playersService.getCurrentPlayer().unitGroups = currentPlayerUnitGroups;

          currentStructure.isDefeated = true;

          this.battleEventsService.dispatchEvent({
            type: BattleEventTypeEnum.Fight_Ends,
            win: true,
            struct: currentStructure,
          });
        }

      },

      [BattleEventTypeEnum.Round_Group_Spends_Turn]: event => {
        console.log('spends a turn');
        if (event.groupPlayer.type === PlayerTypeEnum.AI && event.groupHasMoreTurns && event.groupStillAlive) {
          this.processAiPlayer();
        }

        if (!event.groupHasMoreTurns || !event.groupStillAlive) {
          this.battleEventsService.dispatchEvent({
            type: BattleEventTypeEnum.Round_Group_Turn_Ends,
            playerEndsTurn: event.groupPlayer,
          });
        }
      },

      [BattleEventTypeEnum.UI_Player_Clicks_Enemy_Group]: event => {
        console.log('player clicks');
        if (this.curPlayerState.playerCurrentState === PlayerState.Normal) {
          this.battleEventsService.dispatchEvent({
            type: BattleEventTypeEnum.Combat_Group_Attacked,
            attackedGroup: event.attackedGroup,
            attackerGroup: event.attackingGroup,
          });
        }
        if (this.curPlayerState.playerCurrentState === PlayerState.SpellTargeting) {
          this.battleEventsService.dispatchEvent({
            type: BattleEventTypeEnum.Player_Targets_Spell,
            player: event.attackingPlayer,
            spell: this.curPlayerState.currentSpell,
            target: event.attackedGroup,
          });
        }
      },

    }).pipe(
      takeUntil(this.battleEventsService.onEvent(BattleEventTypeEnum.Fight_Ends)),
    ).subscribe(() => {
      this.battleEvent$.next();
    });


    this.battleEventsService.dispatchEvent({
      type: BattleEventTypeEnum.Fight_Starts,
    });
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
      this.battleEventsService.dispatchEvent({
        type: BattleEventTypeEnum.Fight_Next_Round_Starts,
        round: this.round,
      });
      return;
    }

    const firstUnitGroup = this.fightQueue[0];
    const previousPlayer = this.currentPlayer;
    this.currentPlayer = firstUnitGroup.ownerPlayerRef;
    this.currentUnitGroup = firstUnitGroup;
    this.currentGroupTurnsLeft = this.currentUnitGroup.type.defaultTurnsPerRound;

    if (this.currentPlayer !== previousPlayer) {
      this.battleEventsService.dispatchEvent({
        type: BattleEventTypeEnum.Round_Player_Turn_Starts,
        currentPlayer: this.currentPlayer,
        previousPlayer: previousPlayer,
      });
    } else {
      this.battleEventsService.dispatchEvent({
        type: BattleEventTypeEnum.Round_Player_Continues_Attacking,
      });
    }
  }

  public getFightQueue(): UnitGroupInstModel[] {
    return this.fightQueue;
  }

  public handleDefeatedUnitGroup(unitGroup: UnitGroupInstModel): void {
    const enemyPlayer = unitGroup.ownerPlayerRef;
    const enemyPlayerGroups = this.heroesUnitGroupsMap.get(enemyPlayer) as UnitGroupInstModel[];
    const indexOfUnitGroup = enemyPlayerGroups?.indexOf(unitGroup);

    enemyPlayerGroups.splice(indexOfUnitGroup, 1);
    this.heroesUnitGroupsMap.set(enemyPlayer, enemyPlayerGroups);

    const indexOfRemovedGroupInQueue = this.fightQueue.indexOf(unitGroup);
    if (indexOfRemovedGroupInQueue !== -1) {
      this.fightQueue.splice(indexOfRemovedGroupInQueue, 1);
    }
  }

  public getEnemyOfPlayer(player: PlayerModel): PlayerModel {
    return this.playersRivalryMap.get(player) as PlayerModel;
  }

  private processAiPlayer(): void {
    setTimeout(() => {
      const enemyUnitGroups = this.heroesUnitGroupsMap.get(this.getEnemyOfPlayer(this.currentPlayer)) as UnitGroupInstModel[];
      const randomGroupIndex = Math.round(Math.random() * (enemyUnitGroups.length - 1));
      const targetGroup = enemyUnitGroups[randomGroupIndex];

      this.battleEventsService.dispatchEvent({
        type: BattleEventTypeEnum.Combat_Group_Attacked,
        attackedGroup: targetGroup,
        attackerGroup: this.currentUnitGroup,
      })
    }, 1000);
  }

  public getUnitGroupTotalDamage(unitGroup: UnitGroupModel): number {
    return unitGroup.count * unitGroup.type.baseStats.damageInfo.maxDamage;
  }

  private resetGroupsTurnsLeft(): void {
    this.fightQueue.forEach((unitGroup: UnitGroupModel) => unitGroup.turnsLeft = unitGroup.type.defaultTurnsPerRound);
  }

  private resetFightQueue() {
    this.fightQueue = [
      ...this.heroesUnitGroupsMap.get(this.players[0]) as UnitGroupInstModel[],
      ...this.heroesUnitGroupsMap.get(this.players[1]) as UnitGroupInstModel[],
    ].sort((a, b) => {
      return b.type.baseStats.speed - a.type.baseStats.speed;
    });
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

  private updateGroupsTailHp(): void {
    this.players.forEach((player) => {
      player.unitGroups.forEach(unitGroup => {
        if (!unitGroup.tailUnitHp) {
          unitGroup.tailUnitHp = unitGroup.type.baseStats.health;
        }
      })
    });
  }

  private registerPlayerUnitLoss(attackedGroup: UnitGroupInstModel, unitLoss: number): void {
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
}
