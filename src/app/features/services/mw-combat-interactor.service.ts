import { Injectable } from '@angular/core';
import { DamageType, PostDamageInfo } from 'src/app/core/api/combat-api/types';
import { CombatAttackInteraction, CombatInteractionEnum, CombatInteractionStateEvent, GroupCounterAttacked, GroupDamagedByGroup, GroupDies, GroupSpellsChanged, GroupTakesDamage, InitSpell, PlayerHoversCardEvent } from 'src/app/core/events';
import { PlayerInstanceModel, PlayerModel } from 'src/app/core/players';
import { SpellActivationType, SpellEventNames, SpellEventTypeByName, SpellEvents, SpellInstance } from 'src/app/core/spells';
import { ActionHintTypeEnum, AttackActionHintInfo } from 'src/app/core/ui';
import { Modifiers, UnitGroupInstModel } from 'src/app/core/unit-types';
import { CommonUtils } from 'src/app/core/unit-types/utils';
import { EventInfo, StoreClient } from 'src/app/store';
import { BattleStateService, FinalDamageInfo, MwPlayersService, MwUnitGroupStateService, MwUnitGroupsService } from './';
import { ActionHintService } from './mw-action-hint.service';
import { State } from './state.service';


@Injectable({
  providedIn: 'root'
})
export class CombatInteractorService extends StoreClient() {
  public unitGroupModifiersMap: Map<UnitGroupInstModel, Modifiers[]> = new Map();

  constructor(
    private readonly battleState: BattleStateService,
    private readonly actionHint: ActionHintService,
    private readonly players: MwPlayersService,
    private readonly unitState: MwUnitGroupStateService,
    private readonly units: MwUnitGroupsService,
    private readonly state: State
  ) {
    super();
    /* Dispell buffs and debuffs when location is left. May change in future. */
  }

  public onBattleBegins(): void {
    this.initPlayersSpells();
  }

  public dealDamageTo(
    target: UnitGroupInstModel,
    damage: number,
    type: DamageType = DamageType.PhysicalAttack,
    postActionFn?: (actionInfo: PostDamageInfo) => void,
    /* options object, contains values depending on situation */
    options: { attackerUnit?: UnitGroupInstModel } = {},
  ): FinalDamageInfo {
    /* todo: OnGroupDamaged isn't dispatched, and reward isn't calculated because of that. */
    let finalDamage = damage;

    switch (type) {
      /* Damage coming from spells mostly */
      case DamageType.Magic:
        const targetGroupModifiers = this.unitGroupModifiersMap.get(target);

        if (targetGroupModifiers) {
          const amplifiedMagicDamageMods = targetGroupModifiers
            .filter(mods => mods.amplifiedTakenMagicDamage);

          amplifiedMagicDamageMods.forEach(mod => {
            finalDamage += damage * (mod.amplifiedTakenMagicDamage as number);
          });

          finalDamage = Math.round(finalDamage);
        }
        break;

      /* Normal Unit Group attack */
      case DamageType.PhysicalAttack:

        if (options.attackerUnit) {
          console.log('attacker?', options.attackerUnit);

          const attackerUnitMods = this.unitGroupModifiersMap.get(options.attackerUnit);

          if (attackerUnitMods) {
            // all modifiers mixed (normal/conditional)
            const combatModifiers = attackerUnitMods.map(mod => {
              if (mod.attackConditionalModifiers) {
                const conditionalModifiers = mod.attackConditionalModifiers({
                  attacked: target,
                });

                return conditionalModifiers;
              }

              return mod;
            });

            const damagePercentMod = combatModifiers
              .filter(mod => mod.baseDamagePercentModifier)
              .reduce((acc, next) => acc + (next.baseDamagePercentModifier as number), 0);

            console.log(`damage reduced by ${damagePercentMod}%`);
            finalDamage = Math.round(finalDamage + finalDamage * damagePercentMod);
          }
        }

        break;
      default:
        finalDamage = damage;
    }

    const finalDamageInfo = this.unitState.dealPureDamageToUnitGroup(target, finalDamage);

    if (postActionFn) {
      postActionFn({
        unitLoss: finalDamageInfo.finalUnitLoss,
        finalDamage: finalDamageInfo.finalDamage,
      });
    }

    /* don't handle rest if this is a phys attack */
    if (type === DamageType.PhysicalAttack) {
      return finalDamageInfo;
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
        registerLoss: true,
        group: target,
      }));
    }

    return finalDamageInfo;
  }

  /* when group counterattacks and defeats enemy group, both are gone from queue */
  public handleAttackInteraction(attackActionState: CombatInteractionStateEvent): void {
    const {
      attackingGroup,
      attackedGroup,
      action,
    } = attackActionState;

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
      this.getModsForUnitGroup(attacker),
      this.getModsForUnitGroup(attacked),
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
    const actionHint: AttackActionHintInfo = this.getTargetAttackActionInfo(event.hoveredCard as UnitGroupInstModel);

    this.actionHint.hintMessage$.next(actionHint);
  }

  public getTargetAttackActionInfo(target: UnitGroupInstModel): AttackActionHintInfo {
    const currentUnitGroup = this.battleState.currentUnitGroup;
    const attackDetails = this.unitState.getDetailedAttackInfo(
      currentUnitGroup,
      target,
      this.getModsForUnitGroup(currentUnitGroup),
      this.getModsForUnitGroup(target),
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

  public forEachUnitGroup(callback: (unitGroup: UnitGroupInstModel, player: PlayerModel) => void): void {
    this.battleState.heroesUnitGroupsMap.forEach((playerGroups, player) => {
      playerGroups.forEach((group) => {
        callback(group, player);
      });
    });
  }

  public applyDispellToUnitGroup(target: UnitGroupInstModel): void {
    const dispellableTypes: SpellActivationType[] = [
      SpellActivationType.Buff,
      SpellActivationType.Debuff,
    ];

    target.spells.forEach((spell) => {
      if (dispellableTypes.includes(spell.baseType.activationType)) {
        this.removeSpellFromUnitGroup(target, spell);
      }
    });

    const targetMods = this.unitGroupModifiersMap.get(target);

    if (targetMods) {
      targetMods.length = 0;
    }

    /* for now, all modifiers on the unit instance are removed */
    this.units.clearUnitModifiers(target);
  }

  public triggerEventForAllSpellsHandler(event: EventInfo): void {
    this.state.eventHandlers.spells.triggerAllHandlersByEvent(event);
  }

  public triggerEventForSpellHandler<T extends SpellEventNames>(spell: SpellInstance, event: SpellEventTypeByName<T>): void {
    this.state.eventHandlers.spells.triggerRefEventHandlers(spell, event);
  }

  public initAllUnitGroupSpells(): void {
    this.forEachUnitGroup((unitGroup, player) => {
      if (unitGroup.spells) {
        unitGroup.spells.forEach(spell => this.initSpell(
          spell,
          player as PlayerInstanceModel,
          unitGroup,
        ));
      }
    })
  }

  public resetAllUnitGroupsCooldowns(): void {
    this.forEachUnitGroup(unitGroup => unitGroup.fightInfo.spellsOnCooldown = false);
  }

  public getRandomEnemyUnitGroup(): UnitGroupInstModel {
    const enemyPlayer = this.players.getEnemyPlayer()
    const enemyUnitGroups = this.battleState.heroesUnitGroupsMap.get(enemyPlayer) as UnitGroupInstModel[];
    return CommonUtils.randItem(enemyUnitGroups.filter(group => group.fightInfo.isAlive));
  }

  private getModsForUnitGroup(unitGroup: UnitGroupInstModel): Modifiers[] {
    return [
      ...unitGroup.ownerPlayerRef.hero.mods,
      ...this.unitGroupModifiersMap.get(unitGroup) ?? [],
    ];
  }

  public addSpellToUnitGroup(target: UnitGroupInstModel, spell: SpellInstance, ownerPlayer: PlayerInstanceModel): void {
    target.spells.push(spell);

    this.events.dispatch(GroupSpellsChanged({
      unitGroup: target,
    }));

    this.initSpell(spell, ownerPlayer);
    this.triggerEventForSpellHandler(spell, SpellEvents.SpellPlacedOnUnitGroup({ target }));
  }

  public removeSpellFromUnitGroup(target: UnitGroupInstModel, spell: SpellInstance): void {
    const spellIndex = target.spells.indexOf(spell);
    target.spells.splice(spellIndex, 1);

    this.state.eventHandlers.spells.removeAllHandlersForRef(spell);

    this.events.dispatch(GroupSpellsChanged({
      unitGroup: target,
    }));
  }

  private initSpell(spell: SpellInstance, player: PlayerInstanceModel, ownerUnitGroup?: UnitGroupInstModel): void {
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
