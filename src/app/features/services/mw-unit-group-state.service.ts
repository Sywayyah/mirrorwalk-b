import { Injectable } from '@angular/core';
import { Modifiers } from 'src/app/core/modifiers';
import { UnitGroup } from 'src/app/core/unit-types';
import { CommonUtils } from 'src/app/core/utils';
import { MwUnitGroupsService } from './mw-unit-groups.service';

export interface DamageInfo {
  attacker: UnitGroup;

  attackingUnitsCount: number;

  minDamage: number;
  maxDamage: number;

  attackSuperiority: number;
  damageMultiplier: number;

  multipliedMinDamage: number;
  multipliedMaxDamage: number;
}

export interface DetailedDamageInfo extends DamageInfo {
  attacked: UnitGroup;

  enemyCanCounterattack: boolean;
  minUnitCountLoss: number;
  maxUnitCountLoss: number;

  originalAttackersCount: number;
  originalAttackedCount: number;
}

export interface FinalDamageInfo {
  finalDamage: number;

  /* unit loss adjusted so it can't be higher than count of attacked units */
  finalUnitLoss: number;
  /* not adjusted value, may exceed the amount of units left in target group */
  finalTotalUnitLoss: number;

  tailHpLeft: number;
  isDamageFatal: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class MwUnitGroupStateService {

  constructor(
    private units: MwUnitGroupsService,
  ) { }

  public getTailUnitHealth(unitGroup: UnitGroup): number {
    const { tailUnitHp } = unitGroup;

    if (tailUnitHp === 0) {
      return 0;
    }

    if (tailUnitHp === undefined) return unitGroup.type.baseStats.health;

    return tailUnitHp;
  }

  public getUnitGroupTotalHp(unitGroup: UnitGroup): number {
    return (unitGroup.count - 1) * unitGroup.type.baseStats.health + this.getTailUnitHealth(unitGroup);
  }

  public getUnitGroupDamage(unitGroup: UnitGroup, attackSuperiority: number = 0): DamageInfo {
    const groupBaseStats = unitGroup.type.baseStats;
    const groupDamageInfo = groupBaseStats.damageInfo;
    const unitsCount = unitGroup.count;

    const minDamage = groupDamageInfo.minDamage * unitGroup.count;
    const maxDamage = groupDamageInfo.maxDamage * unitGroup.count;

    /* influence of attack/defence difference on damage */
    const damageMultiplier = attackSuperiority * (attackSuperiority >= 0 ? 0.05 : 0.035);

    const multipliedMinDamage = minDamage + (minDamage * damageMultiplier);
    const multipliedMaxDamage = maxDamage + (maxDamage * damageMultiplier);

    return {
      attacker: unitGroup,
      attackingUnitsCount: unitsCount,

      minDamage: minDamage,
      maxDamage: maxDamage,

      attackSuperiority: attackSuperiority,
      damageMultiplier: damageMultiplier,

      multipliedMinDamage: Math.round(multipliedMinDamage),
      multipliedMaxDamage: Math.round(multipliedMaxDamage),
    };
  }

  public getDetailedAttackInfo(
    attackingGroup: UnitGroup,
    attackedGroup: UnitGroup,
  ): DetailedDamageInfo {
    const attackedUnitType = attackedGroup.type;

    const attackedBaseStats = attackedUnitType.baseStats;

    const attackerStats = attackingGroup.getStats();
    const attackedStats = attackedGroup.getStats();


    const totalAttack = attackerStats.finalAttack;
    const totalTargetDefence = attackedStats.finalDefence;

    const attackSupperiority = totalAttack - totalTargetDefence;

    const damageInfo = this.getUnitGroupDamage(attackingGroup, attackSupperiority);

    const minUnitCountLoss = this.calcUnitCountLoss(damageInfo.multipliedMinDamage, attackedBaseStats.health, attackedGroup.count);
    const maxUnitCountLoss = this.calcUnitCountLoss(damageInfo.multipliedMaxDamage, attackedBaseStats.health, attackedGroup.count);

    const canAttackedCounterAttack = this.canGroupCounterattack(attackedGroup);

    const damageInfoDetails: DetailedDamageInfo = {
      ...damageInfo,
      attacked: attackedGroup,

      originalAttackedCount: attackedGroup.count,
      originalAttackersCount: attackingGroup.count,

      enemyCanCounterattack: canAttackedCounterAttack,

      minUnitCountLoss: minUnitCountLoss,
      maxUnitCountLoss: maxUnitCountLoss,
    };

    return damageInfoDetails;
  }

  public getFinalDamageInfoFromDamageDetailedInfo(damageInfo: DetailedDamageInfo): FinalDamageInfo {
    const rolledMultipliedDamage = CommonUtils.randIntInRange(damageInfo.multipliedMinDamage, damageInfo.multipliedMaxDamage);

    return this.getFinalDamageInfo(damageInfo.attacked, rolledMultipliedDamage);
  }

  /*
    Tail Hp basic idea:
      Given ug of 5 units, base hp 10
      tail hp is going to be 10

      Deal 5 damage -> ug count will still be 5, tail hp === 5

      Deal 5 more damage -> ug count goes down by one, tail hp is 10 again

      So, it will always represent the hp of the tail unit group,
      and while there is at least one unit, it cannot be 0

      It becomes 0 only when the full group is defeated.
  */
  public getFinalDamageInfo(target: UnitGroup, damage: number): FinalDamageInfo {
    const attackedGroup = target;
    const targetBaseStats = attackedGroup.type.baseStats;

    const previousUnitCount = target.count;

    const targetGroupTotalHealth = this.getUnitGroupTotalHp(attackedGroup);

    const targetGroupHealthAfterDamage = targetGroupTotalHealth - damage;
    const isDamageFatal = damage >= targetGroupTotalHealth;

    const targetNewTailHp = targetGroupHealthAfterDamage % targetBaseStats.health;

    const finalTargetTailHp = isDamageFatal
      ? 0
      :
      targetNewTailHp === 0
        ? targetBaseStats.health
        : targetNewTailHp;

    const newUnitsCount = Math.ceil(targetGroupHealthAfterDamage / targetBaseStats.health);

    /* second line of this calc is to deal damage when tail hp is less than damage */
    /*  need to think this logic through */
    const unitLoss = previousUnitCount - newUnitsCount;
    // + ((attackedGroup.tailUnitHp && (attackedGroup.tailUnitHp <= damage)) ? 1 : 0);

    // console.log(`final damage to ${attackedGroup.type.name},
    //       current tail: ${attackedGroup.tailUnitHp}
    //       total target hp: ${targetGroupTotalHealth}
    //       count ${attackedGroup.count}

    //       final damage ${damage}
    //       final target group health ${targetGroupHealthAfterDamage}
    //       new hp tail ${newTailHp}
    //       unit loss ${unitLoss}
    //       `
    // );

    return {
      finalDamage: damage,
      finalUnitLoss: unitLoss > target.count ? target.count : unitLoss,
      finalTotalUnitLoss: unitLoss,
      tailHpLeft: finalTargetTailHp,
      isDamageFatal: damage >= targetGroupTotalHealth,
    };
  }

  public dealPureDamageToUnitGroup(target: UnitGroup, damage: number): FinalDamageInfo {
    const finalDamageInfo = this.getFinalDamageInfo(target, damage);
    target.addUnitsCount(-finalDamageInfo.finalTotalUnitLoss);
    target.setTailUnitHp(finalDamageInfo.tailHpLeft);

    return finalDamageInfo;
  }

  public calcUnitCountLoss(totalDamage: number, groupTypeHealth: number, groupCount: number): number {
    const unitCountLoss = Math.floor(totalDamage / groupTypeHealth);
    return unitCountLoss > groupCount ? groupCount : unitCountLoss;
  }

  public canGroupCounterattack(group: UnitGroup): boolean {
    return !!group.type.defaultModifiers?.counterattacks;
  }

  public isUnitGroupRanged(group: UnitGroup): boolean {
    return !!group.type.defaultModifiers?.isRanged;
  }

  public rollDamage(damageDetailsInfo: DamageInfo): number {
    return CommonUtils.randIntInRange(damageDetailsInfo.multipliedMinDamage, damageDetailsInfo.multipliedMaxDamage);
  }
}
