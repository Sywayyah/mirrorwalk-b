import { Injectable } from '@angular/core';
import { AbilityTypesEnum } from 'src/app/core/model/abilities.types';
import { PlayerModel, UnitGroupModel } from 'src/app/core/model/main.model';
import { CommonUtils } from 'src/app/core/utils/common.utils';
import { BattleEventsService } from './mw-battle-events.service';
import { BattleStateService } from './mw-battle-state.service';
import { BattleEventTypeEnum, CombatGroupAttacked, CombatInteractionEnum, CombatInteractionState } from './types';

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
        this.battleEvents.dispatchEvent({
          type: BattleEventTypeEnum.Combat_Attack_Interaction,
          attackedGroup: event.attackedGroup,
          attackingGroup: event.attackerGroup,
          action: CombatInteractionEnum.GroupAttacks,
        })
      },
      [BattleEventTypeEnum.Combat_Attack_Interaction]: (state: CombatInteractionState) => {
        switch (state.action) {
          case CombatInteractionEnum.GroupAttacks:
            console.log('group starts attack');
            this.handleAttackInteraction(state);
            break;
          case CombatInteractionEnum.GroupCounterattacks:
            this.handleAttackInteraction(state);
            break;
          case CombatInteractionEnum.AttackInteractionCompleted:
            console.log('group completes attack');
            this.battleEvents.dispatchEvent({
              type: BattleEventTypeEnum.Round_Group_Spends_Turn,
              groupPlayer: state.attackingGroup.ownerPlayerRef as PlayerModel,
              group: state.attackingGroup,
              groupStillAlive: Boolean(state.attackingGroup.count),
              groupHasMoreTurns: Boolean(state.attackingGroup.turnsLeft),
            });
        }
      },
    }).subscribe();
  }

  public handleAttackInteraction(attackActionState: CombatInteractionState) {
    const {
      attackingGroup,
      attackedGroup,
      action,
    } = attackActionState;

    const isCounterattack = action === CombatInteractionEnum.GroupCounterattacks;

    const attacker = !isCounterattack ? attackingGroup : attackedGroup;
    const attacked = !isCounterattack ? attackedGroup : attackingGroup;

    const attackerUnitType = attacker.type;
    const attackedUnitType = attacked.type;

    const attackerBaseStats = attackerUnitType.baseStats;
    const attackedBaseStats = attackedUnitType.baseStats;

    const attackSupperiority = attackerBaseStats.attackRating - attackedBaseStats.defence;

    const damageInfo = this.getUnitGroupDamage(attacker);

    let totalDamage = damageInfo.totalDamage;

    switch (true) {
      case attackSupperiority > 0:
        /* attack is bigger than defence */
        totalDamage = totalDamage + (attackSupperiority * 0.05 * totalDamage);
        break;

      case attackSupperiority < 0:
        /* attack is weaker than defence */
        totalDamage = totalDamage - (attackSupperiority * 0.035 * totalDamage);
        break;
    }

    totalDamage = Math.round(totalDamage);

    const totalUnitLoss = Math.floor(totalDamage / attackedBaseStats.health);
    const realUnitLoss = totalUnitLoss > attacked.count ? attacked.count : totalUnitLoss;

    attacked.count -= realUnitLoss;


    if (!isCounterattack) {
      this.battleState.currentGroupTurnsLeft--;
      attacker.turnsLeft = this.battleState.currentGroupTurnsLeft;

      this.battleEvents.dispatchEvent({
        type: BattleEventTypeEnum.On_Group_Damaged,
        attackerGroup: attacker,
        attackedGroup: attacked,
        loss: realUnitLoss,
        damage: totalDamage,
      });
    } else {
      this.battleEvents.dispatchEvent({
        type: BattleEventTypeEnum.On_Group_Counter_Attacked,
        attackerGroup: attacker,
        attackedGroup: attacked,
        loss: realUnitLoss,
        damage: totalDamage,
      });
    }

    if (attacked.count <= 0) {
      this.battleState.handleDefeatedUnitGroup(attacked);
      this.battleEvents.dispatchEvent({
        type: BattleEventTypeEnum.On_Group_Dies,
        target: attacked,
        targetPlayer: attacked.ownerPlayerRef as PlayerModel,
        loss: realUnitLoss,
      });
      attackActionState.action = CombatInteractionEnum.AttackInteractionCompleted;
      this.battleEvents.dispatchEvent(attackActionState);
      return;
    }

    if (!isCounterattack) {
      if (this.canGroupCounterattack(attacked)) {
        attackActionState.action = CombatInteractionEnum.GroupCounterattacks;
      } else {
        attackActionState.action = CombatInteractionEnum.AttackInteractionCompleted;
      }
      this.battleEvents.dispatchEvent(attackActionState);
      return;
    }

    if (isCounterattack) {
      attackActionState.action = CombatInteractionEnum.AttackInteractionCompleted;
    }
    this.battleEvents.dispatchEvent(attackActionState);
  }

  public canGroupCounterattack(group: UnitGroupModel): boolean {
    return !!group.type.baseAbilities?.some(ability => ability.type === AbilityTypesEnum.BaseCounterAttack);
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

}
