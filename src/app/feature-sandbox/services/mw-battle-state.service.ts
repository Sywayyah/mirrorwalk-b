import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { PlayerModel, PlayerTypeEnum, UnitGroupModel } from 'src/app/core/model/main.model';


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

  public history: string[] = [];

  public hintMessage$: BehaviorSubject<string> = new BehaviorSubject('');

  private playersRivalryMap: Map<PlayerModel, PlayerModel> = new Map();

  private initialUnitGroups!: UnitGroupModel[];
  private fightQueue!: UnitGroupModel[];
  private players!: PlayerModel[];


  constructor() { }

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

    this.fightQueue = [
      ...this.heroesUnitGroupsMap.get(this.players[0]) as UnitGroupModel[],
      ...this.heroesUnitGroupsMap.get(this.players[1]) as UnitGroupModel[],
    ].sort((a, b) => {
      return b.type.baseStats.speed - a.type.baseStats.speed;
    });

    this.initNextTurn();
    this.battleEvent.next();
  }

  public initNextTurn(removeCurrentFromQueue: boolean = false): void {
    if (removeCurrentFromQueue) {
      this.fightQueue.shift();
    }

    if (!this.fightQueue.length) {
      this.fightQueue = [
        ...this.heroesUnitGroupsMap.get(this.players[0]) as UnitGroupModel[],
        ...this.heroesUnitGroupsMap.get(this.players[1]) as UnitGroupModel[],
      ].sort((a, b) => {
        return b.type.baseStats.speed - a.type.baseStats.speed;
      });

      this.round++;
      this.logHistory(`Round ${this.round} begins`);
    }

    const firstUnitGroup = this.fightQueue[0];
    this.currentPlayer = firstUnitGroup.ownerPlayerRef as PlayerModel;
    this.currentUnitGroup = firstUnitGroup;
    this.currentGroupTurnsLeft = this.currentUnitGroup.type.defaultTurnsPerRound;
    
    this.logHistory(`Player ${this.currentPlayer.type} starts his turn`);
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
    // const totalDamage = this.getPotentialUnitLossCount(this.currentUnitGroup, enemyGroup);

    const currentGroupCount = this.currentUnitGroup.count;
    const currentGroupType = this.currentUnitGroup.type;

    const minReceivedDamage = currentGroupCount * currentGroupType.baseStats.damageInfo.minDamage;
    const maxReceivedDamage = currentGroupCount * currentGroupType.baseStats.damageInfo.maxDamage;
    const rolledDamage = Math.random() * (maxReceivedDamage - minReceivedDamage);

    const finalDamage = Math.round(minReceivedDamage + rolledDamage);
    const totalUnitLoss = Math.floor(finalDamage / enemyGroup.type.baseStats.health);

    this.logHistory(`${this.currentPlayer.type}'s ${this.currentUnitGroup.type.name} attacks  ${enemyGroup.type.name} dealing ${finalDamage}, killing ${totalUnitLoss} units`);
    enemyGroup.count -= totalUnitLoss;
    if (enemyGroup.count <= 0) {
      this.removeEnemyPlayerUnitGroup(enemyGroup);
      this.logHistory(`Unit ${enemyGroup.type.name} dies, losing ${totalUnitLoss} units`);
      this.battleEvent.next();
    }

    this.currentGroupTurnsLeft--;

    if (!this.currentGroupTurnsLeft) {
      this.initNextTurn(true);

      if (!(this.heroesUnitGroupsMap.get(this.players[0]) as UnitGroupModel[]).length) {
        this.logHistory('You have been defeated!');
        return;
      } else if (!(this.heroesUnitGroupsMap.get(this.players[1]) as UnitGroupModel[]).length) {
        this.logHistory('You won!');
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

  private logHistory(log: string): void {
    this.history.push(log);
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
