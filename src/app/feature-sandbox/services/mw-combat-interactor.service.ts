import { Injectable } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { BaseAbilitiesTable } from 'src/app/core/dictionaries/abilities.const';
import { AbilityTypesEnum } from 'src/app/core/model/abilities.types';
import { UnitGroupInstModel, UnitGroupModel } from 'src/app/core/model/main.model';
import { CommonUtils } from 'src/app/core/utils/common.utils';
import { BattleEventsService } from './mw-battle-events.service';
import { BattleStateService } from './mw-battle-state.service';
import { MwCurrentPlayerStateService, PlayerState } from './mw-current-player-state.service';
import { BattleEventTypeEnum, CombatGroupAttacked, CombatInteractionEnum, CombatInteractionState, HoverTypeEnum, PlayerTargetsSpell, UIPlayerHoversCard } from './types';
import { ActionHintTypeEnum, AttackActionHint, SpellTargetActionHint } from './types/action-hint.types';

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

export enum DamageType {
  PhysicalAttack = 'physAttack',
  Physical = 'physical',
  Magic = 'magic',
}

@Injectable({
  providedIn: 'root'
})
export class CombatInteractorService {

  constructor(
    private readonly battleState: BattleStateService,
    private readonly battleEvents: BattleEventsService,
    private readonly curPlayerState: MwCurrentPlayerStateService,
  ) {
  }

  public listenEvents(): void {
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
              groupPlayer: state.attackingGroup.ownerPlayerRef,
              group: state.attackingGroup,
              groupStillAlive: Boolean(state.attackingGroup.count),
              groupHasMoreTurns: Boolean(state.attackingGroup.turnsLeft),
            });
        }
      },

      [BattleEventTypeEnum.UI_Player_Hovers_Group_Card]: (event: UIPlayerHoversCard) => {
        switch (event.hoverType) {
          case HoverTypeEnum.EnemyCard:
            if (this.curPlayerState.playerCurrentState === PlayerState.Normal) {
              this.setDamageHintMessageOnCardHover(event);
            }
            if (this.curPlayerState.playerCurrentState === PlayerState.SpellTargeting) {
              const spellTargetHint: SpellTargetActionHint = {
                type: ActionHintTypeEnum.OnTargetSpell,
                spell: this.curPlayerState.currentSpell,
                target: event.hoveredCard as UnitGroupInstModel,
              };
              this.battleState.hintMessage$.next(spellTargetHint);
            }
            break;
          case HoverTypeEnum.Unhover:
            this.battleState.hintMessage$.next(null);
        }
      },

      [BattleEventTypeEnum.Player_Targets_Spell]: (event: PlayerTargetsSpell) => {
        this.dealDamageTo(event.target, 100, DamageType.Magic);
        this.curPlayerState.playerCurrentState = PlayerState.Normal;
        this.curPlayerState.resetCurrentSpell();
      },

    }).pipe(
      takeUntil(this.battleEvents.onEvent(BattleEventTypeEnum.Fight_Ends)),
    ).subscribe();
  }

  public dealDamageTo(target: UnitGroupInstModel, damage: number, type: DamageType = DamageType.PhysicalAttack): void {
    let totalUnitLoss = 0;

    switch (type) {
      case DamageType.Magic:
        totalUnitLoss = this.calcUnitCountLoss(damage, target.type.baseStats.health, target.count);

        break;
      default:
        totalUnitLoss = this.calcUnitCountLoss(damage, target.type.baseStats.health, target.count);
    }

    target.count -= totalUnitLoss;

    if (target.count <= 0) {
      this.battleState.handleDefeatedUnitGroup(target);
      this.battleEvents.dispatchEvent({
        type: BattleEventTypeEnum.On_Group_Dies,
        target: target,
        targetPlayer: target.ownerPlayerRef,
        loss: totalUnitLoss,
      });
    }
  }

  /* when group counterattacks and defeats enemy group, both are gone from queue */
  public handleAttackInteraction(attackActionState: CombatInteractionState): void {
    const {
      attackingGroup,
      attackedGroup,
      action,
    } = attackActionState;

    const isCounterattack = action === CombatInteractionEnum.GroupCounterattacks;

    const attacker = !isCounterattack ? attackingGroup : attackedGroup;
    const attacked = !isCounterattack ? attackedGroup : attackingGroup;

    const attackDetails = this.getDetailedAttackInfo(attacker, attacked);

    /* todo: revisit this. total damage and realUnitLoss aren't related. */
    /* todo: also, implement health tail */
    const totalDamage = this.rollDamage(attackDetails);
    const realUnitLoss = CommonUtils.randIntInRange(attackDetails.minUnitCountLoss, attackDetails.maxUnitCountLoss);

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
        targetPlayer: attacked.ownerPlayerRef,
        loss: realUnitLoss,
      });
      attackActionState.action = CombatInteractionEnum.AttackInteractionCompleted;
      this.battleEvents.dispatchEvent(attackActionState);
      return;
    }

    if (!isCounterattack) {
      if (attackDetails.enemyCanCounterattack) {
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

  public getDetailedAttackInfo(attackingGroup: UnitGroupModel, attackedGroup: UnitGroupModel): DetailedDamageInfo {
    const attackerUnitType = attackingGroup.type;
    const attackedUnitType = attackedGroup.type;

    const attackerBaseStats = attackerUnitType.baseStats;
    const attackedBaseStats = attackedUnitType.baseStats;

    const attackSupperiority = attackerBaseStats.attackRating - attackedBaseStats.defence;

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

  public setDamageHintMessageOnCardHover(event: UIPlayerHoversCard): void {
    const attackDetails = this.getDetailedAttackInfo(this.battleState.currentUnitGroup, event.hoveredCard as UnitGroupModel);

    const actionHint: AttackActionHint = {
      type: ActionHintTypeEnum.OnHoverEnemyCard,
      attackedGroup: attackDetails.attacked,
      minDamage: attackDetails.multipliedMinDamage,
      maxDamage: attackDetails.multipliedMaxDamage,
      noDamageSpread: attackDetails.multipliedMinDamage === attackDetails.multipliedMaxDamage,

      minCountLoss: attackDetails.minUnitCountLoss,
      maxCountLoss: attackDetails.maxUnitCountLoss,
      noLossSpread: attackDetails.minUnitCountLoss === attackDetails.maxUnitCountLoss,

      attackSuperiority: attackDetails.attackSuperiority,
    };

    this.battleState.hintMessage$.next(actionHint);
  }

  public canGroupCounterattack(group: UnitGroupModel): boolean {
    return !!BaseAbilitiesTable.get(group.type)?.some(ability => ability.type === AbilityTypesEnum.BaseCounterAttack);
  }

  public rollDamage(damageDetailsInfo: DamageInfo): number {
    return CommonUtils.randIntInRange(damageDetailsInfo.multipliedMinDamage, damageDetailsInfo.multipliedMaxDamage);
  }

  public calcUnitCountLoss(totalDamage: number, groupTypeHealth: number, groupCount: number): number {
    const unitCountLoss = Math.floor(totalDamage / groupTypeHealth);
    return unitCountLoss > groupCount ? groupCount : unitCountLoss;
  }
}
