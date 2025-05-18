import { inject, Injectable } from '@angular/core';
import { CONFIG } from 'src/app/core/config';
import { UnitTypeId } from 'src/app/core/entities';
import {
  FightNextRoundStarts,
  GroupAttacked,
  PlayerTargetsSpell,
  RoundPlayerCountinuesAttacking,
  RoundPlayerTurnStarts,
} from 'src/app/core/events';
import { Player, PlayerTypeEnum } from 'src/app/core/players';
import { AISpellTag } from 'src/app/core/spells';
import { ReactiveState } from 'src/app/core/state';
import { UnitBaseType, UnitGroup } from 'src/app/core/unit-types';
import { EventsService } from 'src/app/store';
import { MwUnitGroupsService } from './mw-unit-groups.service';

@Injectable({
  providedIn: 'root',
})
export class BattleStateService {
  private readonly units = inject(MwUnitGroupsService);
  private readonly events = inject(EventsService);

  readonly state = new ReactiveState<{
    currentPlayer: Player | null;
    currentUnitGroup: UnitGroup | null;
    round: number;
    currentGroupTurnsLeft: number;
  }>({
    currentPlayer: null,
    currentUnitGroup: null,
    round: 1,
    currentGroupTurnsLeft: 0,
  });

  public heroesUnitGroupsMap: Map<Player, UnitGroup[]> = new Map();

  public playerLosses: Record<string, Map<UnitBaseType, number>> = {};

  private readonly playersRivalryMap: Map<Player, Player> = new Map();

  private fightQueue!: UnitGroup[];
  private players!: Player[];

  public resetCurrentPlayer(): void {
    this.state.patch({ currentPlayer: null });
  }

  public initBattleState(unitGroups: UnitGroup[], players: Player[]): void {
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
    if (removeCurrentGroupFromQueue && this.state.get().currentUnitGroup!.count) {
      this.fightQueue.shift();
    }

    if (!this.fightQueue.length) {
      /* Review this event order later */
      this.getAllUnits().forEach((unitGroup) => {
        if (unitGroup.modGroup.getModValue('defending')) {
          unitGroup.removeDefendingMod();
        }
      });

      this.resetFightQueue();
      this.resetGroupsTurnsLeft();

      this.state.updateWithCopy((state) => state.round++);

      this.events.dispatch(
        FightNextRoundStarts({
          round: this.state.get().round,
        }),
      );
      return;
    }

    const firstUnitGroup = this.fightQueue[0];
    const previousPlayer = this.state.get().currentPlayer!;
    this.state.patch({
      currentPlayer: firstUnitGroup.ownerPlayer,
      currentUnitGroup: firstUnitGroup,
    });

    const currentUnitGroup = this.state.get().currentUnitGroup!;
    if (!currentUnitGroup.modGroup.getModValue('defending')) {
      this.state.patch({ currentGroupTurnsLeft: currentUnitGroup.turnsLeft || 1 });
    } else {
      this.state.patch({ currentGroupTurnsLeft: currentUnitGroup.turnsLeft });
    }

    if (this.state.get().currentPlayer !== previousPlayer) {
      this.events.dispatch(
        RoundPlayerTurnStarts({
          currentPlayer: this.state.get().currentPlayer!,
          previousPlayer: previousPlayer,
        }),
      );
    } else {
      this.events.dispatch(RoundPlayerCountinuesAttacking());
    }
  }

  public getFightQueue(): UnitGroup[] {
    return this.fightQueue;
  }

  public handleDefeatedUnitGroup(unitGroup: UnitGroup): void {
    const enemyPlayer = unitGroup.ownerPlayer;
    const enemyPlayerGroups = this.heroesUnitGroupsMap.get(enemyPlayer) as UnitGroup[];
    // const indexOfUnitGroup = enemyPlayerGroups?.indexOf(unitGroup);
    unitGroup.updateUnitGroupState({ isAlive: false });

    this.heroesUnitGroupsMap.set(enemyPlayer, enemyPlayerGroups);

    const indexOfRemovedGroupInQueue = this.fightQueue.indexOf(unitGroup);
    if (indexOfRemovedGroupInQueue !== -1) {
      this.fightQueue.splice(indexOfRemovedGroupInQueue, 1);
    }
  }

  public getEnemyOfPlayer(player: Player): Player {
    return this.playersRivalryMap.get(player)!;
  }

  public canUnitGroupBeAttackedByCurrentPlayerAICheck(unitGroup: UnitGroup): boolean {
    const targetingData = this.getTargetingData(unitGroup);

    if (!targetingData.stateInitialized) {
      return false;
    }

    if (targetingData.isCurrentPlayerAI && !targetingData.isOpponentAI && !CONFIG.allowNeutralAIControl) {
      return false;
    }

    return !targetingData.doesUnitBelongToActivePlayer;
  }

  public getTargetingData(unitGroup: UnitGroup):
    | {
        stateInitialized: true;
        isCurrentPlayerAI: boolean;
        isOpponentAI: boolean;
        doesUnitBelongToActivePlayer: boolean;
      }
    | { stateInitialized: false } {
    const currentPlayer = this.state.get().currentPlayer;

    if (!currentPlayer) {
      return {
        stateInitialized: false,
      };
    }
    return {
      stateInitialized: true,
      isCurrentPlayerAI: currentPlayer.type === PlayerTypeEnum.AI,
      isOpponentAI: this.getEnemyOfPlayer(currentPlayer).type === PlayerTypeEnum.AI,
      doesUnitBelongToActivePlayer: unitGroup.ownerPlayer === currentPlayer,
    };
  }

  public processAiPlayer(): void {
    setTimeout(() => {
      const enemyUnitGroups = this.getAliveUnitsOfPlayer(this.getEnemyOfPlayer(this.state.get().currentPlayer!));
      const randomGroupIndex = Math.round(Math.random() * (enemyUnitGroups.length - 1));
      const targetGroup = enemyUnitGroups[randomGroupIndex];

      // enhance this logic
      const attackingGroup = this.state.get().currentUnitGroup!;
      if (attackingGroup.ownerPlayer.type === PlayerTypeEnum.AI) {
        const attackSpell = attackingGroup.spells.find((spell) =>
          spell.baseType.config.aiTags?.includes(AISpellTag.RegularAttackSpell),
        );

        if (targetGroup && attackSpell && !attackSpell.cooldown) {
          this.events.dispatch(
            PlayerTargetsSpell({
              player: attackingGroup.ownerPlayer,
              spell: attackSpell,
              target: targetGroup,
            }),
          );

          if (attackingGroup.turnsLeft) {
            this.processAiPlayer();
          }
          return;
        }
      }

      this.events.dispatch(
        GroupAttacked({
          attackedGroup: targetGroup,
          attackingGroup: this.state.get().currentUnitGroup!,
        }),
      );
    }, 3_000);
  }

  public getUnitGroupTotalDamage(unitGroup: UnitGroup): number {
    return unitGroup.count * unitGroup.type.baseStats.damageInfo.maxDamage;
  }

  public resortFightQueue(includeFirst: boolean = false): void {
    if (includeFirst) {
      this.fightQueue = this.getUnitsSortedBySpeed(this.fightQueue);
      return;
    }

    this.fightQueue = [this.fightQueue[0], ...this.getUnitsSortedBySpeed(this.fightQueue.slice(1))];
  }

  public removeUnitsWithoutTurnsFromFightQueue(): void {
    this.fightQueue = this.fightQueue.filter((unit) => unit.turnsLeft);
  }

  public getAliveUnitsOfPlayer(player: Player): UnitGroup[] {
    return (this.heroesUnitGroupsMap.get(player) as UnitGroup[]).filter((unitGroup) => unitGroup.isAlive);
  }

  public getDeadUnitsOfPlayer(player: Player): UnitGroup[] {
    return (this.heroesUnitGroupsMap.get(player) as UnitGroup[]).filter((unitGroup) => !unitGroup.isAlive);
  }

  public getSummonsOfPlayer(player: Player): UnitGroup[] {
    return (this.heroesUnitGroupsMap.get(player) as UnitGroup[]).filter((unitGroup) =>
      unitGroup.modGroup.getModValue('isSummon'),
    );
  }

  public playerHasAnyAliveUnits(player: Player): boolean {
    return this.getAliveUnitsOfPlayer(player).length !== 0;
  }

  public addTurnsToUnitGroup(unitGroup: UnitGroup, turns: number): void {
    const previousTurnsLeft = unitGroup.turnsLeft;

    unitGroup.updateUnitGroupState({ turnsLeft: unitGroup.turnsLeft + turns });

    if (this.state.get().currentUnitGroup === unitGroup) {
      this.state.updateWithCopy((state) => (state.currentGroupTurnsLeft += turns));
    }

    if (previousTurnsLeft <= 0 && unitGroup.turnsLeft > 0) {
      this.resortFigthQueueWithNewUnits();
    }
  }

  public summonUnitForPlayer(ownerPlayer: Player, unitType: UnitTypeId, unitNumber: number): UnitGroup {
    const summonedUnitGroup = this.units.createUnitGroup(unitType, { count: unitNumber }, ownerPlayer.hero);

    const playerUnitGroups = this.heroesUnitGroupsMap.get(ownerPlayer)!;

    const initialGroupsCount = playerUnitGroups.length;
    playerUnitGroups.push(summonedUnitGroup);
    summonedUnitGroup.setPosition(initialGroupsCount);

    this.units.addModifierToUnitGroup(summonedUnitGroup, { isSummon: true });

    this.resortFigthQueueWithNewUnits();

    return summonedUnitGroup;
  }

  public registerPlayerUnitLoss(attackedGroup: UnitGroup, unitLoss: number): void {
    /* todo: Final reward seems to not match reward preview */
    const playersLossesMap = this.playerLosses[attackedGroup.ownerPlayer.id];
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
    this.players.forEach((player) => {
      this.playerLosses[player.id] = new Map();
    });
  }

  private resetGroupsTurnsLeft(): void {
    // add method on game object level
    this.fightQueue.forEach((unitGroup: UnitGroup) =>
      unitGroup.updateUnitGroupState({ turnsLeft: unitGroup.turnsLeft + (unitGroup.type.defaultTurnsPerRound || 1) }),
    );
  }

  private getUnitsSortedBySpeed(units: UnitGroup[]): UnitGroup[] {
    return [...units].sort((a, b) => {
      return this.units.getUnitGroupSpeed(b) - this.units.getUnitGroupSpeed(a);
    });
  }

  private resetFightQueue(): void {
    this.fightQueue = this.getUnitsSortedBySpeed([
      ...this.getAliveUnitsOfPlayer(this.players[0]),
      ...this.getAliveUnitsOfPlayer(this.players[1]),
    ]);
  }

  private getAllUnits(): UnitGroup[] {
    return [...this.getAliveUnitsOfPlayer(this.players[0]), ...this.getAliveUnitsOfPlayer(this.players[1])];
  }

  private initPlayerUnitGroupsMap(unitGroups: UnitGroup[]): void {
    this.heroesUnitGroupsMap.clear();
    unitGroups.forEach((unitGroup) => {
      const unitGroupPlayer = unitGroup.ownerPlayer;
      const playerGroups = this.heroesUnitGroupsMap.get(unitGroupPlayer);

      if (playerGroups) {
        playerGroups.push(unitGroup);
      } else {
        this.heroesUnitGroupsMap.set(unitGroupPlayer, [unitGroup]);
      }
    });

    this.heroesUnitGroupsMap.forEach((unitGroups) => {
      unitGroups.forEach((unit, i) => {
        unit.setPosition(i);
      });
    });
  }

  private updateGroupsTailHpAndCombatInfo(): void {
    this.players.forEach((player) => {
      player.hero.unitGroups.forEach((unitGroup) => {
        if (!unitGroup.tailUnitHp) {
          unitGroup.setTailUnitHp(unitGroup.type.baseStats.health);
        }
        // unitGroup.fightInfo.initialCount = unitGroup.count;
        unitGroup.updateUnitGroupState({ initialCount: unitGroup.count });
      });
    });
  }

  private refreshUnitGroups(): void {
    this.players.forEach((player) => {
      player.hero.unitGroups.forEach((unitGroup) => {
        // unitGroup.turnsLeft = unitGroup.type.defaultTurnsPerRound || 1;
        unitGroup.updateUnitGroupState({
          turnsLeft: unitGroup.type.defaultTurnsPerRound || 1,
        });
      });
    });
  }

  // Resorts units so that current unit remains on top, the rest are all alive units with turns left sorted by their speed.
  private resortFigthQueueWithNewUnits(): void {
    this.fightQueue = [
      this.fightQueue[0],
      ...this.getUnitsSortedBySpeed(this.getAllAliveUnitsWithTurnsExcept(this.fightQueue[0])),
    ];
  }

  private getAllAliveUnitsWithTurnsExcept(unit?: UnitGroup): UnitGroup[] {
    const unitToRemove = unit || this.fightQueue[0];

    return this.getAllAliveUnitsExcept(unitToRemove).filter((unitGroup) => unitGroup.turnsLeft);
  }

  private getAllAliveUnitsExcept(unit: UnitGroup): UnitGroup[] {
    return [...this.heroesUnitGroupsMap.values()].flat().filter((unitGroup) => unitGroup.isAlive && unitGroup !== unit);
  }
}
