import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { PlayerInstanceModel, PlayerModel, PlayerTypeEnum, UnitGroupInstModel, UnitGroupModel, UnitTypeModel } from 'src/app/core/model/main.model';
import { BattleEventsService } from './mw-battle-events.service';
import { BattleEventTypeEnum } from "./types";
import { MwPlayersService } from './mw-players.service';
import { ActionHintModel } from './types/action-hint.types';


@Injectable({
  providedIn: 'root',
})
export class BattleStateService {

  public currentPlayer!: PlayerModel;
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
  ) { }

  public initBattle(
    unitGroups: UnitGroupInstModel[],
    players: PlayerInstanceModel[],
  ): void {
    this.initialUnitGroups = unitGroups;

    this.players = players;

    this.playersRivalryMap.set(players[0], players[1]);
    this.playersRivalryMap.set(players[1], players[0]);

    this.players.forEach(player => {
      this.playerLosses[player.id] = new Map();
    });

    this.initPlayerUnitGroupsMap(unitGroups);

    this.resetFightQueue();

    this.battleEventsService.onEvents({
      [BattleEventTypeEnum.Fight_Starts]: event => {
        console.log('Battle starts');
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
          this.processAiPlayer();
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

      [BattleEventTypeEnum.On_Group_Damaged]: event => {
        if (!event.loss) {
          return;
        }
        const playersLossesMap = this.playerLosses[event.attackedGroup.ownerPlayerRef.id];
        const attackedGroupUnitType = event.attackedGroup.type;
        const typeLossCount = playersLossesMap.get(attackedGroupUnitType);
        if (typeLossCount) {
          playersLossesMap.set(attackedGroupUnitType, typeLossCount + event.loss);
        } else {
          playersLossesMap.set(attackedGroupUnitType, event.loss);
        }
      },

      [BattleEventTypeEnum.On_Group_Dies]: event => {

        if (!(this.heroesUnitGroupsMap.get(this.players[0]) as UnitGroupModel[]).length) {
          this.battleEventsService.dispatchEvent({
            type: BattleEventTypeEnum.Fight_Ends,
            win: false,
          });
        }

        if (!(this.heroesUnitGroupsMap.get(this.players[1]) as UnitGroupModel[]).length) {
          this.battleEventsService.dispatchEvent({
            type: BattleEventTypeEnum.Fight_Ends,
            win: true,
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
        this.battleEventsService.dispatchEvent({
          type: BattleEventTypeEnum.Combat_Group_Attacked,
          attackedGroup: event.attackedGroup,
          attackerGroup: event.attackingGroup,
        });
      },

    }).subscribe(() => {
      this.battleEvent$.next();
    });


    this.battleEventsService.dispatchEvent({
      type: BattleEventTypeEnum.Fight_Starts,
    });
  }

  public initNextTurnByQueue(removeCurrentGroupFromQueue: boolean = false): void {
    if (removeCurrentGroupFromQueue) {
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
    this.currentPlayer = firstUnitGroup.ownerPlayerRef as PlayerModel;
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
    const enemyPlayer = unitGroup.ownerPlayerRef as PlayerModel;
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
    unitGroups.forEach(unitGroup => {
      const unitGroupPlayer = unitGroup.ownerPlayerRef as PlayerModel;
      const playerGroups = this.heroesUnitGroupsMap.get(unitGroupPlayer);
      if (playerGroups) {
        playerGroups.push(unitGroup);
      } else {
        this.heroesUnitGroupsMap.set(unitGroupPlayer, [unitGroup]);
      }
    });
  }

}
