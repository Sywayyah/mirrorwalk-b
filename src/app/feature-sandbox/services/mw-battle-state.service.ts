import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { PlayerInstanceModel, PlayerModel } from 'src/app/core/players';
import { ActionHintModel } from 'src/app/core/ui';
import { UnitGroupInstModel, UnitGroupModel, UnitBase } from 'src/app/core/unit-types';
import { EventsService } from 'src/app/store';
import { FightNextRoundStarts, GroupAttacked, RoundPlayerCountinuesAttacking, RoundPlayerTurnStarts } from './events';
import { MwUnitGroupsService } from './mw-unit-groups.service';


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

  public playerLosses: Record<string, Map<UnitBase, number>> = {};

  private playersRivalryMap: Map<PlayerModel, PlayerModel> = new Map();

  private initialUnitGroups!: UnitGroupInstModel[];
  private fightQueue!: UnitGroupInstModel[];
  private players!: PlayerInstanceModel[];


  constructor(
    private readonly units: MwUnitGroupsService,
    private events: EventsService,
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
      this.events.dispatch(FightNextRoundStarts({
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
      this.events.dispatch(RoundPlayerTurnStarts({
        currentPlayer: this.currentPlayer,
        previousPlayer: previousPlayer,
      }));
    } else {
      this.events.dispatch(RoundPlayerCountinuesAttacking({}));
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

      this.events.dispatch(GroupAttacked({
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
      const finalLossCount = typeLossCount + unitLoss;

      if (finalLossCount > 0) {
        playersLossesMap.set(attackedGroupUnitType, finalLossCount);
      } else {
        /* Remove loss record when units got fully healed. */
        playersLossesMap.delete(attackedGroupUnitType);
      }
    } else {
      playersLossesMap.set(attackedGroupUnitType, unitLoss);
    }
  }

  private initPlayerLossesMap() {
    this.players.forEach(player => {
      this.playerLosses[player.id] = new Map();
    });
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
