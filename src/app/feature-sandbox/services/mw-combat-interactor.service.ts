import { Injectable } from '@angular/core';
import { PlayerModel, UnitGroupModel } from 'src/app/core/model/main.model';
import { CommonUtils } from 'src/app/core/utils/common.utils';
import { BattleEventsService } from './mw-battle-events.service';
import { BattleStateService } from './mw-battle-state.service';
import { BattleEventTypeEnum, CombatGroupAttacked } from './types';

interface DamageInfo {
  attacker: UnitGroupModel;
  unitsCount: number;
  minDamage: number;
  maxDamage: number;
  rolledDamage: number;
  totalDamage: number;
}


@Injectable({
  providedIn: 'root'
})
export class CombatInteractorService {

  constructor(
    private readonly battleState: BattleStateService,
    private readonly battleEvents: BattleEventsService,
  ) {
    this.battleEvents.onEvents({
      [BattleEventTypeEnum.Combat_Group_Attacked]: (event: CombatGroupAttacked) => {
        this.attackEnemyGroup(event);
      },
    }).subscribe();
  }
  
  public getUnitGroupDamage(unitGroup: UnitGroupModel): DamageInfo {

    const groupBaseStats = unitGroup.type.baseStats;
    const groupDamageInfo = groupBaseStats.damageInfo;
    const unitsCount = unitGroup.count;

    const minDamage = groupDamageInfo.minDamage * unitGroup.count;
    const maxDamage = groupDamageInfo.maxDamage * unitGroup.count;

    const rolledDamage = CommonUtils.randIntInRange(0, maxDamage - minDamage);

    return {
      attacker: unitGroup,
      unitsCount: unitsCount,
      minDamage: minDamage,
      maxDamage: maxDamage,
      rolledDamage: rolledDamage,
      totalDamage: minDamage + rolledDamage,
    };
  }

  public attackEnemyGroup(attackEvent: CombatGroupAttacked): void {
    const attackingGroup = attackEvent.attackerGroup;
    const enemyGroup = attackEvent.attackedGroup;

    const attackerDamageInfo = this.getUnitGroupDamage(attackingGroup);

    const finalDamage = attackerDamageInfo.totalDamage;
    const totalUnitLoss = Math.floor(finalDamage / enemyGroup.type.baseStats.health);

    const finalTotalUnitLoss = totalUnitLoss > enemyGroup.count ? enemyGroup.count : totalUnitLoss;

    this.battleEvents.dispatchEvent({
      type: BattleEventTypeEnum.On_Group_Damaged,
      attackedGroup: enemyGroup,
      attackerGroup: attackingGroup,
      loss: finalTotalUnitLoss,
      damage: finalDamage,
    });

    enemyGroup.count -= finalTotalUnitLoss;

    if (enemyGroup.count <= 0) {
      this.battleState.removeEnemyPlayerUnitGroup(enemyGroup);
      this.battleEvents.dispatchEvent({
        type: BattleEventTypeEnum.On_Group_Dies,
        target: enemyGroup,
        targetPlayer: enemyGroup.ownerPlayerRef as PlayerModel,
        loss: finalTotalUnitLoss,
      })
    }

    this.battleState.currentGroupTurnsLeft--;
    attackingGroup.turnsLeft = this.battleState.currentGroupTurnsLeft;

    this.battleEvents.dispatchEvent({
      type: BattleEventTypeEnum.Round_Group_Spends_Turn,
      groupPlayer: attackingGroup.ownerPlayerRef as PlayerModel,
      groupHasMoreTurns: Boolean(attackingGroup.turnsLeft),
    });
  }

}
