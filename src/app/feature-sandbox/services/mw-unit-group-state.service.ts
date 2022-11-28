import { Injectable } from '@angular/core';
import { Modifiers, UnitGroupModel } from 'src/app/core/unit-types';
import { CommonUtils } from 'src/app/core/unit-types/utils';

export interface DamageInfo {
  attacker: UnitGroupModel;

  attackingUnitsCount: number;

  minDamage: number;
  maxDamage: number;

  attackSuperiority: number;
  damageMultiplier: number;

  multipliedMinDamage: number;
  multipliedMaxDamage: number;
}

export interface DetailedDamageInfo extends DamageInfo {
  attacked: UnitGroupModel;

  enemyCanCounterattack: boolean;
  minUnitCountLoss: number;
  maxUnitCountLoss: number;

}

export interface FinalDamageInfo {
  finalDamage: number;
  /* unit loss adjusted so it can't be higher than count of attacked units */
  finalUnitLoss: number;
  /* not adjusted value */
  finalTotalUnitLoss: number;
  tailHpLeft: number;
  isDamageFatal: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class MwUnitGroupStateService {

  constructor() { }

  public getUnitGroupTotalHp(unitGroup: UnitGroupModel): number {
    return (unitGroup.count - 1) * unitGroup.type.baseStats.health + (unitGroup.tailUnitHp ?? 0);
  }

  public getUnitGroupDamage(unitGroup: UnitGroupModel, attackSuperiority: number = 0): DamageInfo {
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

  public getDetailedAttackInfo(attackingGroup: UnitGroupModel, attackedGroup: UnitGroupModel, mods: Modifiers[] = []): DetailedDamageInfo {
    const attackerUnitType = attackingGroup.type;
    const attackedUnitType = attackedGroup.type;

    const attackerBaseStats = attackerUnitType.baseStats;
    const attackedBaseStats = attackedUnitType.baseStats;

    const attackBonus = mods
      // .filter(mod => mod.playerBonusAttack)
      .reduce((bonusAttack, nextMod) => bonusAttack +
        (nextMod.playerBonusAttack ?? 0) +
        (nextMod.unitGroupBonusAttack ?? 0),
        0
      );

    const attackSupperiority = (attackerBaseStats.attackRating + attackBonus) - attackedBaseStats.defence;

    const damageInfo = this.getUnitGroupDamage(attackingGroup, attackSupperiority);

    const minUnitCountLoss = this.calcUnitCountLoss(damageInfo.multipliedMinDamage, attackedBaseStats.health, attackedGroup.count);
    const maxUnitCountLoss = this.calcUnitCountLoss(damageInfo.multipliedMaxDamage, attackedBaseStats.health, attackedGroup.count);

    const canAttackedCounterAttack = this.canGroupCounterattack(attackedGroup);

    const damageInfoDetails: DetailedDamageInfo = {
      ...damageInfo,
      attacked: attackedGroup,

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

  public getFinalDamageInfo(target: UnitGroupModel, damage: number): FinalDamageInfo {
    const attackedGroup = target;
    const targetBaseStats = attackedGroup.type.baseStats;

    const previousUnitCount = target.count;

    const targetGroupTotalHealth = this.getUnitGroupTotalHp(attackedGroup);

    const targetGroupHealthAfterDamage = targetGroupTotalHealth - damage;

    const newTailHp = targetGroupHealthAfterDamage % targetBaseStats.health;
    const newUnitsCount = Math.floor(targetGroupHealthAfterDamage / targetBaseStats.health)
      + (newTailHp ? 1 : 0);

    /* second line of this calc is to deal damage when tail hp is less than damage */
    /*  need to think this logic through */
    const unitLoss = previousUnitCount - newUnitsCount;
    // + ((attackedGroup.tailUnitHp && (attackedGroup.tailUnitHp <= damage)) ? 1 : 0);

    console.log(`final damage to ${attackedGroup.type.name},
          current tail: ${attackedGroup.tailUnitHp}
          total target hp: ${targetGroupTotalHealth}
          count ${attackedGroup.count}

          final damage ${damage}
          final target group health ${targetGroupHealthAfterDamage}
          new hp tail ${newTailHp}
          unit loss ${unitLoss}
          `
    );

    return {
      finalDamage: damage,
      finalUnitLoss: unitLoss > target.count ? target.count : unitLoss,
      finalTotalUnitLoss: unitLoss,
      tailHpLeft: newTailHp,
      isDamageFatal: target.count <= unitLoss,
    };
  }

  public dealPureDamageToUnitGroup(target: UnitGroupModel, damage: number): FinalDamageInfo {
    const finalDamageInfo = this.getFinalDamageInfo(target, damage);
    target.count -= finalDamageInfo.finalUnitLoss;
    target.tailUnitHp = finalDamageInfo.tailHpLeft;

    return finalDamageInfo;
  }

  public calcUnitCountLoss(totalDamage: number, groupTypeHealth: number, groupCount: number): number {
    const unitCountLoss = Math.floor(totalDamage / groupTypeHealth);
    return unitCountLoss > groupCount ? groupCount : unitCountLoss;
  }

  public canGroupCounterattack(group: UnitGroupModel): boolean {
    return !!group.type.defaultModifiers?.counterattacks;
  }

  public isUnitGroupRanged(group: UnitGroupModel): boolean {
    return !!group.type.defaultModifiers?.isRanged;
  }

  public rollDamage(damageDetailsInfo: DamageInfo): number {
    return CommonUtils.randIntInRange(damageDetailsInfo.multipliedMinDamage, damageDetailsInfo.multipliedMaxDamage);
  }
}
