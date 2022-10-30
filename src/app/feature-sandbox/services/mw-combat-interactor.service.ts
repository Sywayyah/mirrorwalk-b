import { Injectable } from '@angular/core';
import {
  Modifiers, PlayerInstanceModel,
  PlayerModel, SpellActivationType,
  SpellEventHandlers,
  SpellEventsMapping,
  SpellEventTypes,
  SpellInstance,
  SpellModel,
  UnitGroupInstModel
} from 'src/app/core/model';
import { CombatActionsRef, DamageType, PostDamageInfo, SpellCreationOptions } from 'src/app/core/model/combat-api/combat-api.types';
import { EffectType, VfxElemEffect } from 'src/app/core/model/vfx-api/vfx-api.types';
import { CommonUtils } from 'src/app/core/utils/common.utils';
import { VfxService } from '../components/ui-elements/vfx-layer/vfx.service';
import { BattleStateService, FinalDamageInfo, MwBattleLogService, MwPlayersService, MwSpellsService, MwUnitGroupsService, MwUnitGroupStateService } from './';
import { CombatAttackInteraction, CombatInteractionEnum, CombatInteractionStateEvent, GroupCounterAttacked, GroupDamagedByGroup, GroupDies, GroupModifiersChanged, GroupSpeedChanged, GroupSpellsChanged, GroupTakesDamage, PlayerHoversCardEvent } from './events';
import { StoreClient } from './store';
import { ActionHintTypeEnum, AttackActionHintInfo } from './types';


@Injectable({
  providedIn: 'root'
})
export class CombatInteractorService extends StoreClient() {

  private spellsHandlersMap: Map<SpellInstance, SpellEventHandlers> = new Map();
  private unitGroupModifiersMap: Map<UnitGroupInstModel, Modifiers[]> = new Map();

  constructor(
    private readonly battleState: BattleStateService,
    private readonly players: MwPlayersService,
    private readonly battleLog: MwBattleLogService,
    private readonly unitState: MwUnitGroupStateService,
    private readonly spellsService: MwSpellsService,
    private readonly vfxService: VfxService,
    private readonly units: MwUnitGroupsService,
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
          const attackerUnitMods = this.unitGroupModifiersMap.get(options.attackerUnit);

          if (attackerUnitMods) {
            const conditionalCombatModifiers = attackerUnitMods.map(mod => {
              if (mod.attackConditionalModifiers) {
                const generatedMods = mod.attackConditionalModifiers({
                  attacked: target,
                });

                return generatedMods;
              }

              return mod;
            });

            const damagePercentMod = conditionalCombatModifiers
              .filter(mod => mod.baseDamagePercentModifier)
              .reduce((acc, next) => acc + (next.baseDamagePercentModifier as number), 0);

            console.log(`damage reduced by ${damagePercentMod}%`);
            finalDamage = finalDamage + finalDamage * damagePercentMod;
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

    this.triggerEventForAllSpellsHandler(SpellEventTypes.UnitGroupAttacks, {
      attacked,
      attacker,
    });

    const attackDetails = this.unitState.getDetailedAttackInfo(
      attacker,
      attacked,
      this.getModsForUnitGroup(attacker),
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

    this.battleState.hintMessage$.next(actionHint);
  }

  public getTargetAttackActionInfo(target: UnitGroupInstModel): AttackActionHintInfo {
    const currentUnitGroup = this.battleState.currentUnitGroup;
    const attackDetails = this.unitState.getDetailedAttackInfo(
      currentUnitGroup,
      target,
      this.getModsForUnitGroup(currentUnitGroup),
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

  public createActionsApiRef(): CombatActionsRef {
    return {
      dealDamageTo: (target, damage, damageType, postActionFn) => {
        this.dealDamageTo(target, damage, damageType, postActionFn);
      },
      createSpellInstance: <T>(spell: SpellModel<T>, options?: SpellCreationOptions<T>) => {
        return this.spellsService.createSpellInstance(spell, options);
      },
      addModifiersToUnitGroup: (target, modifiers) => {

        const groupModifiers = this.unitGroupModifiersMap.get(target);

        this.units.addModifierToUnitGroup(target, modifiers);

        if (groupModifiers) {
          groupModifiers.push(modifiers);
        } else {
          this.unitGroupModifiersMap.set(target, [modifiers]);
        }

        if (modifiers.unitGroupSpeedBonus) {
          this.events.dispatch(GroupSpeedChanged({
            unitGroup: target
          }));
        }

        this.events.dispatch(GroupModifiersChanged({
          unitGroup: target,
        }));
      },
      createModifiers: (modifiers) => {
        return this.spellsService.createModifiers(modifiers);
      },
      removeModifiresFromUnitGroup: (target, modifiers) => {
        /* todo: solve mods/spells being duplicated in 2 places. */
        const unitGroupMods = this.unitGroupModifiersMap.get(target);

        this.units.removeModifiers(target, modifiers);

        if (unitGroupMods) {
          CommonUtils.removeItem(unitGroupMods, modifiers);
        }

        this.events.dispatch(GroupModifiersChanged({
          unitGroup: target,
        }));
      },
      /* dark magic of types, just so it can work */
      addSpellToUnitGroup: <T>(target: UnitGroupInstModel, spell: SpellInstance<T>, ownerPlayer: PlayerInstanceModel) => {
        this.addSpellToUnitGroup(target, spell as SpellInstance, ownerPlayer);
      },
      removeSpellFromUnitGroup: (target, spell) => {
        this.removeSpellFromUnitGroup(target, spell as SpellInstance);
      },
      getUnitGroupsOfPlayer: (player) => {
        return this.battleState.heroesUnitGroupsMap.get(player) as UnitGroupInstModel[];
      },
      getRandomEnemyPlayerGroup: () => {
        return this.getRandomEnemyUnitGroup();
      },
      getEnemyPlayer: () => {
        return this.players.getEnemyPlayer();
      },
      historyLog: (plainMsg) => {
        this.battleLog.logSimpleMessage(plainMsg);
      },
      healUnit: (unit, healValue) => {
        /* think on resorting queue */
        this.units.healUnit(unit, healValue);
      }
    };
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

  private getModsForUnitGroup(unitGroup: UnitGroupInstModel): Modifiers[] {
    return [
      ...unitGroup.ownerPlayerRef.hero.mods,
      ...this.unitGroupModifiersMap.get(unitGroup) ?? [],
    ];
  }

  private addSpellToUnitGroup(target: UnitGroupInstModel, spell: SpellInstance, ownerPlayer: PlayerInstanceModel): void {
    // console.log('add spell');
    target.spells.push(spell);

    this.events.dispatch(GroupSpellsChanged({
      unitGroup: target,
    }));

    this.initSpell(spell, ownerPlayer);
    this.triggerEventForSpellHandler(spell, SpellEventTypes.SpellPlacedOnUnitGroup, { target: target });
  }

  private removeSpellFromUnitGroup(target: UnitGroupInstModel, spell: SpellInstance): void {
    const spellIndex = target.spells.indexOf(spell);
    target.spells.splice(spellIndex, 1);

    this.spellsHandlersMap.delete(spell);
  }

  public triggerEventForAllSpellsHandler<T extends keyof SpellEventHandlers>(eventType: T, data: SpellEventsMapping[T]): void {
    this.spellsHandlersMap.forEach(spellHandlers => {
      (spellHandlers?.[eventType] as (arg: SpellEventsMapping[T]) => void)?.(data);
    });
  }

  public triggerEventForSpellHandler<T extends keyof SpellEventHandlers>(spell: SpellInstance, eventType: T, data: SpellEventsMapping[T]): void {
    (this.spellsHandlersMap.get(spell)?.[eventType] as (arg: SpellEventsMapping[T]) => void)?.(data);
  }

  private getRandomEnemyUnitGroup(): UnitGroupInstModel {
    const enemyPlayer = this.players.getEnemyPlayer()
    const enemyUnitGroups = this.battleState.heroesUnitGroupsMap.get(enemyPlayer) as UnitGroupInstModel[];
    return CommonUtils.randItem(enemyUnitGroups);
  }

  private initSpell(spell: SpellInstance, player: PlayerInstanceModel, ownerUnitGroup?: UnitGroupInstModel): void {
    spell.baseType.type.spellConfig.init({
      actions: this.createActionsApiRef(),
      events: {
        on: (handlers: SpellEventHandlers) => {
          const spellHandlers = this.spellsHandlersMap.get(spell) ?? {};

          this.spellsHandlersMap.set(spell, { ...spellHandlers, ...handlers });
        },
      },
      vfx: {
        createEffectForUnitGroup: (target, effect, options) => {
          this.vfxService.createVfxForUnitGroup(target, {
            type: EffectType.VfxElement,
            animation: effect,
          } as VfxElemEffect, options);
        },
        createFloatingMessageForUnitGroup: (target, data, options) => {
          this.vfxService.createFloatingMessageForUnitGroup(target, data, options);
        }
      },
      thisSpell: spell.baseType,
      ownerPlayer: player,
      spellInstance: spell,
      ownerHero: player.hero,
      ownerUnit: ownerUnitGroup,
    });
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
}
