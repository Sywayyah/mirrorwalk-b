import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { PlayerModel, PlayerTypeEnum, UnitGroupModel } from 'src/app/core/model/main.model';
import { MwBattleLogService } from './mw-battle-log.service';

@Injectable({
  providedIn: 'root',
})
export class BattleStateService {

  public currentPlayer!: PlayerModel;
  public currentUnitGroup!: UnitGroupModel;
  public battleEvent: Subject<void> = new BehaviorSubject<void>(undefined);

  public heroesUnitGroupsMap: Map<PlayerModel, UnitGroupModel[]> = new Map();
  public currentGroupTurnsLeft: number = 0;

  public round: number = 1;

  public hintMessage$: BehaviorSubject<string> = new BehaviorSubject('');

  private playersRivalryMap: Map<PlayerModel, PlayerModel> = new Map();

  private initialUnitGroups!: UnitGroupModel[];
  private fightQueue!: UnitGroupModel[];
  private players!: PlayerModel[];


  constructor(
    private readonly battleLogService: MwBattleLogService,
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

    this.initNextTurn();
    this.battleEvent.next();
    
    if (this.currentPlayer.type === PlayerTypeEnum.AI) {
      this.processAiPlayer();
    }
  }

  public initNextTurn(removeCurrentFromQueue: boolean = false): void {
    if (removeCurrentFromQueue) {
      this.fightQueue.shift();
    }

    if (!this.fightQueue.length) {
      this.resetFightQueue();
      this.resetGroupsTurnsLeft();

      this.round++;
      this.battleLogService.logRoundInfoMessage(`Round ${this.round} begins`);
    }

    const firstUnitGroup = this.fightQueue[0];
    const previousPlayer = this.currentPlayer;
    this.currentPlayer = firstUnitGroup.ownerPlayerRef as PlayerModel;
    this.currentUnitGroup = firstUnitGroup;
    this.currentGroupTurnsLeft = this.currentUnitGroup.type.defaultTurnsPerRound;

    if (this.currentPlayer !== previousPlayer) {
      this.battleLogService.logRoundInfoMessage(`Player ${this.currentPlayer.type} starts his turn`);
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
    const currentGroupCount = this.currentUnitGroup.count;
    const currentGroupType = this.currentUnitGroup.type;

    const minReceivedDamage = currentGroupCount * currentGroupType.baseStats.damageInfo.minDamage;
    const maxReceivedDamage = currentGroupCount * currentGroupType.baseStats.damageInfo.maxDamage;
    const rolledDamage = Math.random() * (maxReceivedDamage - minReceivedDamage);

    const finalDamage = Math.round(minReceivedDamage + rolledDamage);
    const totalUnitLoss = Math.floor(finalDamage / enemyGroup.type.baseStats.health);

    const finalTotalUnitLoss = totalUnitLoss > enemyGroup.count ? enemyGroup.count : totalUnitLoss;

    this.battleLogService.logDealtDamageMessage({
      attacker: this.currentUnitGroup.type,
      attacked: enemyGroup.type,
      attackingPlayer: this.currentUnitGroup.ownerPlayerRef as PlayerModel,
      attackedPlayer: enemyGroup.ownerPlayerRef as PlayerModel,
      damage: finalDamage,
      losses: finalTotalUnitLoss,
    });

    enemyGroup.count -= finalTotalUnitLoss;
    if (enemyGroup.count <= 0) {
      this.removeEnemyPlayerUnitGroup(enemyGroup);
      this.battleLogService.logSimpleMessage(`Group of ${enemyGroup.type.name} dies, losing ${finalTotalUnitLoss} units`);
      this.battleEvent.next();
    }

    this.currentGroupTurnsLeft--;
    this.currentUnitGroup.turnsLeft--;

    if (!this.currentGroupTurnsLeft) {
      this.initNextTurn(true);

      if (!(this.heroesUnitGroupsMap.get(this.players[0]) as UnitGroupModel[]).length) {
        this.battleLogService.logRoundInfoMessage('Defeat!');
        return;
      } else if (!(this.heroesUnitGroupsMap.get(this.players[1]) as UnitGroupModel[]).length) {
        this.battleLogService.logRoundInfoMessage('Win!');
        return;
      }

      this.battleEvent.next();
    }

    if (this.currentGroupTurnsLeft) {
      if (this.currentPlayer.type === PlayerTypeEnum.AI) {
        this.processAiPlayer();
      }
    }
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
