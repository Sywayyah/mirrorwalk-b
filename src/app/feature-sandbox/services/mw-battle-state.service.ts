import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { PlayerModel, PlayerTypeEnum, UnitGroupModel } from 'src/app/core/model/main.model';
import { BattleEventsService, BattleEventTypeEnum } from './mw-battle-events.service';
import { MwPlayersService } from './mw-players.service';

@Injectable({
  providedIn: 'root',
})
export class BattleStateService {

  public currentPlayer!: PlayerModel;
  public currentUnitGroup!: UnitGroupModel;
  public battleEvent$: Subject<void> = new BehaviorSubject<void>(undefined);

  public heroesUnitGroupsMap: Map<PlayerModel, UnitGroupModel[]> = new Map();
  public currentGroupTurnsLeft: number = 0;

  public round: number = 1;

  public hintMessage$: BehaviorSubject<string> = new BehaviorSubject('');

  private playersRivalryMap: Map<PlayerModel, PlayerModel> = new Map();

  private initialUnitGroups!: UnitGroupModel[];
  private fightQueue!: UnitGroupModel[];
  private players!: PlayerModel[];


  constructor(
    private readonly battleEventsService: BattleEventsService,
    private readonly playersService: MwPlayersService,
  ) { }

  /* until turns are out. */
  public initBattle(
    unitGroups: UnitGroupModel[],
    players: PlayerModel[],
  ): void {
    this.initialUnitGroups = unitGroups;

    this.players = players;

    this.playersRivalryMap.set(players[0], players[1]);
    this.playersRivalryMap.set(players[1], players[0]);

    this.initPlayerUnitGroupsMap(unitGroups);

    this.resetFightQueue();

    this.battleEventsService
      .listenEventsOfTypes([
        BattleEventTypeEnum.Round_Player_Turn_Starts,
        BattleEventTypeEnum.Round_Group_Spends_Turn,
        BattleEventTypeEnum.Round_Group_Turn_Ends,
        BattleEventTypeEnum.Round_Player_Continues_Attacking,

        BattleEventTypeEnum.On_Group_Dies,

        BattleEventTypeEnum.Fight_Starts,
        BattleEventTypeEnum.Fight_Next_Round_Starts,
      ])
      .pipe(
        this.battleEventsService.untilEvent(BattleEventTypeEnum.Fight_Ends),
      )
      .subscribe((event) => {
        switch (event.type) {
          case BattleEventTypeEnum.Fight_Starts:
            console.log('Battle starts');
            this.initNextTurnByQueue();
            break;

          case BattleEventTypeEnum.Fight_Next_Round_Starts:
            console.log('Next round');
            this.initNextTurnByQueue();

            break;

          case BattleEventTypeEnum.Round_Player_Turn_Starts:
            if (event.currentPlayer.type === PlayerTypeEnum.AI) {
              console.log(`AI player's Turn`)
              this.processAiPlayer();
            }
            break;

          case BattleEventTypeEnum.Round_Player_Continues_Attacking:
            if (this.currentPlayer.type === PlayerTypeEnum.AI) {
              this.processAiPlayer();
            }
            break;
          case BattleEventTypeEnum.Round_Group_Turn_Ends:
            this.initNextTurnByQueue(true);
            break;

          case BattleEventTypeEnum.On_Group_Dies:

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

            break;

          case BattleEventTypeEnum.Round_Group_Spends_Turn:
            console.log('spends a turn');
            if (event.groupPlayer.type === PlayerTypeEnum.AI && event.groupHasMoreTurns) {
              this.processAiPlayer();
            }

            if (!event.groupHasMoreTurns) {
              this.battleEventsService.dispatchEvent({
                type: BattleEventTypeEnum.Round_Group_Turn_Ends,
                playerEndsTurn: event.groupPlayer,
              });
            }
        }
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


  public getFightQueue(): UnitGroupModel[] {
    return this.fightQueue;
  }

  public removeEnemyPlayerUnitGroup(unitGroup: UnitGroupModel): void {
    const enemyPlayer = this.getEnemyOfPlayer(this.currentPlayer);
    const enemyPlayerGroups = this.heroesUnitGroupsMap.get(enemyPlayer) as UnitGroupModel[];
    const indexOfUnitGroup = enemyPlayerGroups?.indexOf(unitGroup);

    enemyPlayerGroups.splice(indexOfUnitGroup, 1);
    this.heroesUnitGroupsMap.set(enemyPlayer, enemyPlayerGroups);

    const indexOfRemovedGroupInQueue = this.fightQueue.indexOf(unitGroup);
    this.fightQueue.splice(indexOfRemovedGroupInQueue, 1);
  }

  public getEnemyOfPlayer(player: PlayerModel): PlayerModel {
    return this.playersRivalryMap.get(player) as PlayerModel;
  }

  public attackEnemyGroup(enemyGroup: UnitGroupModel): void {
    const attackingGroup = this.currentUnitGroup;
    const currentGroupCount = attackingGroup.count;
    const currentGroupType = this.currentUnitGroup.type;

    const minReceivedDamage = currentGroupCount * currentGroupType.baseStats.damageInfo.minDamage;
    const maxReceivedDamage = currentGroupCount * currentGroupType.baseStats.damageInfo.maxDamage;
    const rolledDamage = Math.random() * (maxReceivedDamage - minReceivedDamage);

    const finalDamage = Math.round(minReceivedDamage + rolledDamage);
    const totalUnitLoss = Math.floor(finalDamage / enemyGroup.type.baseStats.health);

    const finalTotalUnitLoss = totalUnitLoss > enemyGroup.count ? enemyGroup.count : totalUnitLoss;

    this.battleEventsService.dispatchEvent({
      type: BattleEventTypeEnum.On_Group_Damaged,
      attackedGroup: enemyGroup,
      attackerGroup: this.currentUnitGroup,
      loss: finalTotalUnitLoss,
      damage: finalDamage,
    });

    enemyGroup.count -= finalTotalUnitLoss;

    if (enemyGroup.count <= 0) {
      this.removeEnemyPlayerUnitGroup(enemyGroup);
      this.battleEventsService.dispatchEvent({
        type: BattleEventTypeEnum.On_Group_Dies,
        target: enemyGroup,
        targetPlayer: enemyGroup.ownerPlayerRef as PlayerModel,
        loss: finalTotalUnitLoss,
      })
    }

    this.currentGroupTurnsLeft--;
    this.currentUnitGroup.turnsLeft = this.currentGroupTurnsLeft;

    this.battleEventsService.dispatchEvent({
      type: BattleEventTypeEnum.Round_Group_Spends_Turn,
      groupPlayer: attackingGroup.ownerPlayerRef as PlayerModel,
      groupHasMoreTurns: Boolean(attackingGroup.turnsLeft),
    });
  }

  public setHintAttackMessage(enemyGroup: UnitGroupModel): void {
    const currentGroupCount = this.currentUnitGroup.count;
    const currentGroupType = this.currentUnitGroup.type;

    const minReceivedDamage = currentGroupCount * currentGroupType.baseStats.damageInfo.minDamage;
    const maxReceivedDamage = currentGroupCount * currentGroupType.baseStats.damageInfo.maxDamage;
    const rolledDamage = Math.random() * (maxReceivedDamage - minReceivedDamage);

    let minUnitLossCount = Math.round(minReceivedDamage / enemyGroup.type.baseStats.health);
    let maxUnitLossCount = Math.floor(maxReceivedDamage / enemyGroup.type.baseStats.health);

    minUnitLossCount = enemyGroup.count <= minUnitLossCount ? enemyGroup.count : minUnitLossCount;
    maxUnitLossCount = enemyGroup.count <= maxUnitLossCount ? enemyGroup.count : maxUnitLossCount;

    if (minUnitLossCount === maxUnitLossCount) {
      this.hintMessage$.next(`Attack ${enemyGroup.type.name} dealing ${minReceivedDamage}-${maxReceivedDamage} damage, killing ${maxUnitLossCount} units`);
    } else {
      this.hintMessage$.next(`Attack ${enemyGroup.type.name} dealing ${minReceivedDamage}-${maxReceivedDamage} damage, killing ${minUnitLossCount}-${maxUnitLossCount} units`);
    }
  }

  public clearHintMessage(): void {
    this.hintMessage$.next('');
  }

  private processAiPlayer(): void {
    setTimeout(() => {
      const enemyUnitGroups = this.heroesUnitGroupsMap.get(this.getEnemyOfPlayer(this.currentPlayer)) as UnitGroupModel[];
      const randomGroupIndex = Math.round(Math.random() * (enemyUnitGroups.length - 1));
      const targetGroup = enemyUnitGroups[randomGroupIndex];

      this.attackEnemyGroup(targetGroup);
    }, 1000);
  }

  public getPotentialUnitLossCount(attackingGroup: UnitGroupModel, attackedGroup: UnitGroupModel): number {
    return Math.floor(attackingGroup.count * attackingGroup.type.baseStats.damageInfo.maxDamage / attackedGroup.type.baseStats.health);
  }

  public getUnitGroupTotalDamage(unitGroup: UnitGroupModel): number {
    return unitGroup.count * unitGroup.type.baseStats.damageInfo.maxDamage;
  }

  private resetGroupsTurnsLeft(): void {
    this.fightQueue.forEach((unitGroup: UnitGroupModel) => unitGroup.turnsLeft = unitGroup.type.defaultTurnsPerRound);
  }

  private resetFightQueue() {
    this.fightQueue = [
      ...this.heroesUnitGroupsMap.get(this.players[0]) as UnitGroupModel[],
      ...this.heroesUnitGroupsMap.get(this.players[1]) as UnitGroupModel[],
    ].sort((a, b) => {
      return b.type.baseStats.speed - a.type.baseStats.speed;
    });
  }

  private initPlayerUnitGroupsMap(unitGroups: UnitGroupModel[]): void {
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
