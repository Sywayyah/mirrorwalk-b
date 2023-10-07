import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { FightNextRoundStarts, GroupAttacked, RoundPlayerCountinuesAttacking, RoundPlayerTurnStarts } from 'src/app/core/events';
import { Player } from 'src/app/core/players';
import { UnitBaseType, UnitGroup } from 'src/app/core/unit-types';
import { EventsService } from 'src/app/store';
import { MwUnitGroupsService } from './mw-unit-groups.service';


@Injectable({
  providedIn: 'root',
})
export class BattleStateService {

  public currentPlayer!: Player;
  public currentUnitGroup!: UnitGroup;
  public battleEvent$: Subject<void> = new BehaviorSubject<void>(undefined);

  public heroesUnitGroupsMap: Map<Player, UnitGroup[]> = new Map();

  public currentGroupTurnsLeft: number = 0;
  public round: number = 1;
  public playerLosses: Record<string, Map<UnitBaseType, number>> = {};

  private playersRivalryMap: Map<Player, Player> = new Map();

  private initialUnitGroups!: UnitGroup[];
  private fightQueue!: UnitGroup[];
  private players!: Player[];


  constructor(
    private readonly units: MwUnitGroupsService,
    private events: EventsService,
  ) { }

  public resetCurrentPlayer(): void {
    this.currentPlayer = null as unknown as Player;
  }

  public initBattleState(
    unitGroups: UnitGroup[],
    players: Player[],
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
      /* Review this event order later */
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
      this.events.dispatch(RoundPlayerCountinuesAttacking());
    }
  }

  public getFightQueue(): UnitGroup[] {
    return this.fightQueue;
  }

  public handleDefeatedUnitGroup(unitGroup: UnitGroup): void {
    const enemyPlayer = unitGroup.ownerPlayerRef;
    const enemyPlayerGroups = this.heroesUnitGroupsMap.get(enemyPlayer) as UnitGroup[];
    const indexOfUnitGroup = enemyPlayerGroups?.indexOf(unitGroup);
    unitGroup.fightInfo.isAlive = false;

    // enemyPlayerGroups.splice(indexOfUnitGroup, 1);
    this.heroesUnitGroupsMap.set(enemyPlayer, enemyPlayerGroups);

    const indexOfRemovedGroupInQueue = this.fightQueue.indexOf(unitGroup);
    if (indexOfRemovedGroupInQueue !== -1) {
      this.fightQueue.splice(indexOfRemovedGroupInQueue, 1);
    }
  }

  public getEnemyOfPlayer(player: Player): Player {
    return this.playersRivalryMap.get(player)!;
  }

  public processAiPlayer(): void {
    setTimeout(() => {
      const enemyUnitGroups = this.getAliveUnitsOfPlayer(this.getEnemyOfPlayer(this.currentPlayer) as Player);
      const randomGroupIndex = Math.round(Math.random() * (enemyUnitGroups.length - 1));
      const targetGroup = enemyUnitGroups[randomGroupIndex];

      this.events.dispatch(GroupAttacked({
        attackedGroup: targetGroup,
        attackingGroup: this.currentUnitGroup,
      }));
    }, 1000);
  }

  public getUnitGroupTotalDamage(unitGroup: UnitGroup): number {
    return unitGroup.count * unitGroup.type.baseStats.damageInfo.maxDamage;
  }

  public resortFightQueue(): void {
    this.fightQueue = [this.fightQueue[0], ...this.sortUnitsBySpeed(this.fightQueue.slice(1))];
  }


  public getAliveUnitsOfPlayer(player: Player): UnitGroup[] {
    return (this.heroesUnitGroupsMap.get(player) as UnitGroup[]).filter(
      unitGroup => unitGroup.fightInfo.isAlive,
    );
  }

  public getDeadUnitsOfPlayer(player: Player): UnitGroup[] {
    return (this.heroesUnitGroupsMap.get(player) as UnitGroup[]).filter(
      unitGroup => !unitGroup.fightInfo.isAlive,
    );
  }

  public getSummonsOfPlayer(player: Player): UnitGroup[] {
    return (this.heroesUnitGroupsMap.get(player) as UnitGroup[]).filter(
      unitGroup => unitGroup.modGroup.getModValue('isSummon'),
    );
  }

  public playerHasAnyAliveUnits(player: Player): boolean {
    return this.getAliveUnitsOfPlayer(player).length !== 0;
  }

  public summonUnitForPlayer(ownerPlayer: Player, unitType: UnitBaseType, unitNumber: number): UnitGroup {
    const summonedUnitGroup = this.units.createUnitGroup(unitType, { count: unitNumber }, ownerPlayer) as UnitGroup;

    const playerUnitGroups = this.heroesUnitGroupsMap.get(ownerPlayer)!;

    playerUnitGroups.push(summonedUnitGroup as UnitGroup);

    this.units.addModifierToUnitGroup(summonedUnitGroup, { isSummon: true });

    this.resortFigthQueueWithNewUnits();

    return summonedUnitGroup;
  }

  public registerPlayerUnitLoss(attackedGroup: UnitGroup, unitLoss: number): void {
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
    this.fightQueue.forEach((unitGroup: UnitGroup) => unitGroup.turnsLeft = unitGroup.type.defaultTurnsPerRound);
  }

  private sortUnitsBySpeed(units: UnitGroup[]): UnitGroup[] {
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

  private initPlayerUnitGroupsMap(unitGroups: UnitGroup[]): void {
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
          unitGroup.setTailUnitHp(unitGroup.type.baseStats.health);
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

  // Resorts units so that current unit remains on top, the rest are all alive units with turns left sorted by their speed.
  private resortFigthQueueWithNewUnits(): void {
    this.fightQueue = [this.fightQueue[0], ...this.sortUnitsBySpeed(this.getAllAliveUnitsWithTurnsExcept(this.fightQueue[0]))];
  }

  private getAllAliveUnitsWithTurnsExcept(unit: UnitGroup): UnitGroup[] {
    return this.getAllAliveUnitsExcept(this.fightQueue[0]).filter(unitGroup => unitGroup.turnsLeft);
  }

  private getAllAliveUnitsExcept(unit: UnitGroup): UnitGroup[] {
    return [...this.heroesUnitGroupsMap.values()].flat().filter(unitGroup => unitGroup.fightInfo.isAlive && unitGroup !== unit);
  }
}
