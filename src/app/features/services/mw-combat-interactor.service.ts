import { Injectable } from '@angular/core';
import { DamageType, PostDamageInfo } from 'src/app/core/api/combat-api/types';
import { CombatAttackInteraction, CombatInteractionEnum, CombatInteractionStateEvent, GroupCounterAttacked, GroupDamagedByGroup, GroupDies, GroupSpellsChanged, GroupTakesDamage, InitSpell, PlayerHoversCardEvent } from 'src/app/core/events';
import { RegisterUnitLoss } from 'src/app/core/events/battle/commands';
import { ModsRef, ModsRefsGroup } from 'src/app/core/modifiers';
import { defaultResistCap, resistsMapping } from 'src/app/core/modifiers/resists';
import { Player } from 'src/app/core/players';
import { Spell, SpellActivationType, SpellEventNames, SpellEventTypeByName, SpellEvents } from 'src/app/core/spells';
import { ActionHintTypeEnum, AttackActionHintInfo } from 'src/app/core/ui';
import { UnitGroup, UnitStatsInfo } from 'src/app/core/unit-types';
import { CommonUtils } from 'src/app/core/utils';
import { EventData, StoreClient } from 'src/app/store';
import { BattleStateService, FinalDamageInfo, MwPlayersService, MwUnitGroupStateService, MwUnitGroupsService } from './';
import { ActionHintService } from './mw-action-hint.service';
import { State } from './state.service';

interface ExtendedFinalDamageInfo extends FinalDamageInfo {
  blockedDamage: number;
}
@Injectable({
  providedIn: 'root'
})
export class CombatInteractorService extends StoreClient() {
  constructor(
    private readonly battleState: BattleStateService,
    private readonly actionHint: ActionHintService,
    private readonly players: MwPlayersService,
    private readonly unitState: MwUnitGroupStateService,
    private readonly units: MwUnitGroupsService,
    private readonly state: State
  ) {
    super();
  }

  public onBattleBegins(): void {
    this.initPlayersSpells();
  }

  public dealDamageTo(
    target: UnitGroup,
    damage: number,
    damageType: DamageType = DamageType.PhysicalAttack,
    postActionFn?: (actionInfo: PostDamageInfo) => void,
    /* options object, contains values depending on situation */
    options: { attackerUnit?: UnitGroup } = {},
  ): ExtendedFinalDamageInfo {
    let finalDamage = damage;
    let blockedDamage = 0;

    switch (damageType) {
      /* Normal Unit Group attack */
      case DamageType.PhysicalAttack:

        if (options.attackerUnit) {
          console.log('attacker?', options.attackerUnit);

          const conditionalAttackData = { attacked: target, attacker: options.attackerUnit };

          const attackerConditionalModifiers = options.attackerUnit.modGroup
            .getAllModValues('attackConditionalModifiers')
            .map((mod) => mod!(conditionalAttackData));

          const targetConditionalModifiers = target.modGroup
            .getAllModValues('attackConditionalModifiers')
            .map((mod) => mod!(conditionalAttackData));

          // another thing: conditional + non-conditional, should be added together
          const targetConditionalModsGroup = ModsRefsGroup.withRefs(targetConditionalModifiers.map(ModsRef.fromMods));

          const chanceToBlock = targetConditionalModsGroup.getModValue('chanceToBlock');
          const damageBlockMin = targetConditionalModsGroup.getModValue('damageBlockMin');
          const damageBlockMax = targetConditionalModsGroup.getModValue('damageBlockMax');

          if (chanceToBlock) {
            const blockChanceWorked = CommonUtils.chanceRoll(chanceToBlock);
            console.log('blocking -> chance to block', chanceToBlock, blockChanceWorked);

            if (blockChanceWorked) {
              const damageBlockValue = CommonUtils.randIntInRange(damageBlockMin!, damageBlockMax!);

              blockedDamage = damageBlockValue;
            }

          }

          // todo: practically, attacker modifiers can also be united under new ModGroup, so there will be no need
          // to recalc values like this
          const damagePercentMod = attackerConditionalModifiers
            .filter(mod => mod.baseDamagePercentModifier)
            .reduce((acc, next) => acc + (next.baseDamagePercentModifier as number), 0);

          console.log(`damage reduced by ${damagePercentMod}%`);

          finalDamage = CommonUtils.nonNegative(Math.round(finalDamage + finalDamage * damagePercentMod) - blockedDamage);
        }
        break;

      default:
        // reduce damage by resistances
        if (resistsMapping[damageType]) {
          const modsGroup = target.modGroup;

          // universal magic damage amplification
          //  (poison damage might be avoided here in future)
          const amplifiedMagicDamagePercent = modsGroup.getModValue('amplifiedTakenMagicDamagePercent') || 0;

          finalDamage += damage * amplifiedMagicDamagePercent;

          finalDamage = Math.round(finalDamage);

          // damage resists
          let finalResistValue = target.getStats()[resistsMapping[damageType] as keyof UnitStatsInfo];

          if (finalResistValue > defaultResistCap) {
            finalResistValue = defaultResistCap;
          }

          console.log(damage, damageType, 'resist:', finalResistValue);

          // reduce damage basing on
          finalDamage = finalDamage - (finalDamage * (finalResistValue / 100));
        }
    }

    const initialUnitCount = target.count;

    // round the final damage
    finalDamage = Math.round(finalDamage);

    // this could become event at some point
    const finalDamageInfo = this.unitState.dealPureDamageToUnitGroup(target, finalDamage);

    if (finalDamageInfo.finalUnitLoss) {
      this.events.dispatch(RegisterUnitLoss({ unit: target, loss: finalDamageInfo.finalUnitLoss }));
    }

    if (postActionFn) {
      postActionFn({
        unitLoss: finalDamageInfo.finalUnitLoss,
        finalDamage: finalDamageInfo.finalDamage,
        initialUnitCount,
      });
    }

    /* don't handle rest if this is a normal phys attack */
    if (damageType === DamageType.PhysicalAttack) {
      return { ...finalDamageInfo, blockedDamage };
    }

    if (finalDamageInfo.isDamageFatal) {
      this.battleState.handleDefeatedUnitGroup(target);
      this.events.dispatch(GroupDies({
        target: target,
        targetPlayer: target.ownerPlayerRef,
        loss: finalDamageInfo.finalUnitLoss,
      }));
    }

    if (finalDamageInfo.finalUnitLoss) {
      this.events.dispatch(GroupTakesDamage({
        unitLoss: finalDamageInfo.finalUnitLoss,
        group: target,
      }));
    }

    return { ...finalDamageInfo, blockedDamage };
  }

  /* when group counterattacks and defeats enemy group, both are gone from queue */
  public handleAttackInteraction(attackActionState: CombatInteractionStateEvent): void {
    const {
      attackingGroup,
      attackedGroup,
      action,
    } = attackActionState;

    // todo: history log for counterattack action
    const isCounterattack = action === CombatInteractionEnum.GroupCounterattacks;

    const attacker = !isCounterattack ? attackingGroup : attackedGroup;
    const attacked = !isCounterattack ? attackedGroup : attackingGroup;

    this.triggerEventForAllSpellsHandler(SpellEvents.UnitGroupAttacks({
      attacked,
      attacker,
    }));

    const attackDetails = this.unitState.getDetailedAttackInfo(
      attacker,
      attacked,
    );

    const damageInfo = this.unitState.getFinalDamageInfoFromDamageDetailedInfo(attackDetails);

    const finalDamageInfo = this.dealDamageTo(
      attacked,
      damageInfo.finalDamage,
      DamageType.PhysicalAttack,
      undefined,
      { attackerUnit: attacker },
    );

    if (!isCounterattack) {
      this.battleState.currentGroupTurnsLeft--;
      attacker.turnsLeft = this.battleState.currentGroupTurnsLeft;

      this.events.dispatch(GroupDamagedByGroup({
        attackingGroup: attacker,
        damageBlocked: finalDamageInfo.blockedDamage,
        attackedGroup: attacked,
        loss: finalDamageInfo.finalUnitLoss,
        damage: finalDamageInfo.finalDamage,
        attackedCount: attackDetails.originalAttackedCount,
        attackersCount: attackDetails.originalAttackersCount,
      }));
    } else {
      this.events.dispatch(GroupCounterAttacked({
        attackingGroup: attacker,
        attackedGroup: attacked,
        loss: finalDamageInfo.finalUnitLoss,
        damage: finalDamageInfo.finalDamage,
      }));
    }

    if (finalDamageInfo.isDamageFatal) {
      this.battleState.handleDefeatedUnitGroup(attacked);
      this.events.dispatch(GroupDies({
        target: attacked,
        targetPlayer: attacked.ownerPlayerRef,
        loss: finalDamageInfo.finalUnitLoss,
      }));
      attackActionState.action = CombatInteractionEnum.AttackInteractionCompleted;

      // todo: redispatching object
      this.events.dispatch(CombatAttackInteraction(attackActionState));
      return;
    }

    if (!isCounterattack) {
      if (attackDetails.enemyCanCounterattack) {
        attackActionState.action = CombatInteractionEnum.GroupCounterattacks;
      } else {
        attackActionState.action = CombatInteractionEnum.AttackInteractionCompleted;
      }
      this.events.dispatch(CombatAttackInteraction(attackActionState));
      return;
    }

    if (isCounterattack) {
      attackActionState.action = CombatInteractionEnum.AttackInteractionCompleted;
    }
    this.events.dispatch(CombatAttackInteraction(attackActionState));
  }

  public setDamageHintMessageOnCardHover(event: PlayerHoversCardEvent): void {
    const actionHint: AttackActionHintInfo = this.getTargetAttackActionInfo(event.hoveredCard as UnitGroup);

    this.actionHint.hintMessage$.next(actionHint);
  }

  public getTargetAttackActionInfo(target: UnitGroup): AttackActionHintInfo {
    const currentUnitGroup = this.battleState.currentUnitGroup;
    const attackDetails = this.unitState.getDetailedAttackInfo(
      currentUnitGroup,
      target,
    );

    const attackActionInfo: AttackActionHintInfo = {
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

    return attackActionInfo;
  }

  public forEachUnitGroup(callback: (unitGroup: UnitGroup, player: Player) => void): void {
    this.battleState.heroesUnitGroupsMap.forEach((playerGroups, player) => {
      playerGroups.forEach((group) => {
        callback(group, player);
      });
    });
  }

  public applyDispellToUnitGroup(target: UnitGroup): void {
    const dispellableTypes: SpellActivationType[] = [
      SpellActivationType.Buff,
      SpellActivationType.Debuff,
    ];

    target.spells.forEach((spell) => {
      if (dispellableTypes.includes(spell.baseType.activationType)) {
        this.removeSpellFromUnitGroup(target, spell);
      }
    });

    /* for now, all modifiers on the unit instance are removed */
    // todo: review later
    this.units.clearUnitModifiers(target);
  }

  public triggerEventForAllSpellsHandler(event: EventData): void {
    this.state.eventHandlers.spells.triggerAllHandlersByEvent(event);
  }

  public triggerEventForSpellHandler<T extends SpellEventNames>(spell: Spell, event: SpellEventTypeByName<T>): void {
    this.state.eventHandlers.spells.triggerRefEventHandlers(spell, event);
  }

  public initAllUnitGroupSpells(): void {
    this.forEachUnitGroup((unitGroup, player) => {
      if (unitGroup.spells) {
        unitGroup.spells.forEach(spell => this.initSpell(
          spell,
          player as Player,
          unitGroup,
        ));
      }
    })
  }

  public resetAllUnitGroupsCooldowns(): void {
    this.forEachUnitGroup(unitGroup => unitGroup.fightInfo.spellsOnCooldown = false);
  }

  public getRandomEnemyUnitGroup(): UnitGroup {
    const enemyPlayer = this.players.getEnemyPlayer()
    const enemyUnitGroups = this.battleState.heroesUnitGroupsMap.get(enemyPlayer) as UnitGroup[];
    return CommonUtils.randItem(enemyUnitGroups.filter(group => group.fightInfo.isAlive));
  }

  public addSpellToUnitGroup(target: UnitGroup, spell: Spell, ownerPlayer: Player): void {
    target.addSpell(spell);


    this.events.dispatch(GroupSpellsChanged({
      unitGroup: target,
    }));

    this.initSpell(spell, ownerPlayer);

    this.triggerEventForSpellHandler(spell, SpellEvents.SpellPlacedOnUnitGroup({ target }));
  }

  public removeSpellFromUnitGroup(target: UnitGroup, spell: Spell): void {
    target.removeSpell(spell);

    this.state.eventHandlers.spells.removeAllHandlersForRef(spell);

    this.events.dispatch(GroupSpellsChanged({
      unitGroup: target,
    }));
  }

  private initSpell(spell: Spell, player: Player, ownerUnitGroup?: UnitGroup): void {
    this.events.dispatch(InitSpell({
      spell,
      player,
      ownerUnit: ownerUnitGroup,
    }));
  }

  private initPlayersSpells(): void {
    [
      this.players.getCurrentPlayer(),
      this.players.getEnemyPlayer(),
    ].forEach(player => {
      player.hero.spells.forEach(spell => {
        this.initSpell(spell, player);
      });
    });
  }
}
