import { Injectable } from '@angular/core';
import { DamageType, PostDamageInfo } from 'src/app/core/api/combat-api/types';
import { CombatAttackInteraction, CombatInteractionEnum, CombatInteractionStateEvent, GroupCounterAttacked, GroupDamagedByGroup, GroupDies, GroupSpellsChanged, GroupTakesDamage, InitSpell, PlayerHoversCardEvent } from 'src/app/core/events';
import { Modifiers, ModsRef, ModsRefsGroup } from 'src/app/core/modifiers';
import { Player } from 'src/app/core/players';
import { Spell, SpellActivationType, SpellEventNames, SpellEventTypeByName, SpellEvents } from 'src/app/core/spells';
import { ActionHintTypeEnum, AttackActionHintInfo } from 'src/app/core/ui';
import { UnitGroup } from 'src/app/core/unit-types';
import { CommonUtils } from 'src/app/core/utils';
import { EventData, StoreClient } from 'src/app/store';
import { BattleStateService, FinalDamageInfo, MwPlayersService, MwUnitGroupStateService, MwUnitGroupsService } from './';
import { ActionHintService } from './mw-action-hint.service';
import { State } from './state.service';

// staying here for now, might move somewhere later
const resistsMapping: Partial<Record<DamageType, keyof Modifiers>> = {
  [DamageType.Cold]: 'resistCold',
  [DamageType.Fire]: 'resistFire',
  [DamageType.Lightning]: 'resistLightning',
  [DamageType.Poison]: 'resistPoison',
};

// defaul cap is 60%
const defaultResistCap = 60;

@Injectable({
  providedIn: 'root'
})
export class CombatInteractorService extends StoreClient() {
  public unitGroupModifiersMap: Map<UnitGroup, Modifiers[]> = new Map();

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
    target: UnitGroup,
    damage: number,
    type: DamageType = DamageType.PhysicalAttack,
    postActionFn?: (actionInfo: PostDamageInfo) => void,
    /* options object, contains values depending on situation */
    options: { attackerUnit?: UnitGroup } = {},
  ): FinalDamageInfo {
    /* todo: OnGroupDamaged isn't dispatched, and reward isn't calculated because of that. */
    let finalDamage = damage;

    switch (type) {
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

        if (resistsMapping[type]) {
          // rethink composition and storing of modifiers
          // unit's modGroup might contain player's mod group as parent
          //  as well as some other groups, like location mods, stuff like that.
          // And I also need to consider modifiers from items/hero

          const targetMods = [...this.unitGroupModifiersMap.get(target) || [], target.type.defaultModifiers || {}];

          if (targetMods) {
            // universal magic damage amplifications
            //  (poison damage might be avoided here)
            const amplifiedMagicDamageMods = targetMods
              .filter(mods => mods.amplifiedTakenMagicDamagePercent);

            amplifiedMagicDamageMods.forEach(mod => {
              finalDamage += damage * (mod.amplifiedTakenMagicDamagePercent as number);
            });

            finalDamage = Math.round(finalDamage);

            // damage resists
            const modsGroup = ModsRefsGroup.withRefs(targetMods.map(mod => ModsRef.fromMods(mod)));

            const resistValue: number = (modsGroup.getModValue(resistsMapping[type] as keyof Modifiers) as number) || 0;
            const allResistValue: number = (modsGroup.getModValue('resistAll')) || 0;

            let finalResistValue = resistValue + allResistValue;

            if (finalResistValue > defaultResistCap) {
              finalResistValue = defaultResistCap;
            }

            console.log(damage, type, 'resist:', finalResistValue);

            // reduce damage basing on
            finalDamage = finalDamage - (finalDamage * (finalResistValue / 100));
          }

          // Idea for auras: aura's might require a function that every unit
          // is going to check against itself, there might also be some utils
          // to calc distance etc.
        }
    }

    const initialUnitCount = target.count;

    // this could become event at some point
    const finalDamageInfo = this.unitState.dealPureDamageToUnitGroup(target, finalDamage);

    if (postActionFn) {
      postActionFn({
        unitLoss: finalDamageInfo.finalUnitLoss,
        finalDamage: finalDamageInfo.finalDamage,
        initialUnitCount,
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
    const actionHint: AttackActionHintInfo = this.getTargetAttackActionInfo(event.hoveredCard as UnitGroup);

    this.actionHint.hintMessage$.next(actionHint);
  }

  public getTargetAttackActionInfo(target: UnitGroup): AttackActionHintInfo {
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

    const targetMods = this.unitGroupModifiersMap.get(target);

    if (targetMods) {
      targetMods.length = 0;
    }

    /* for now, all modifiers on the unit instance are removed */
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

  private getModsForUnitGroup(unitGroup: UnitGroup): Modifiers[] {
    return [
      ...unitGroup.ownerPlayerRef.hero.mods,
      ...this.unitGroupModifiersMap.get(unitGroup) ?? [],
    ];
  }

  public addSpellToUnitGroup(target: UnitGroup, spell: Spell, ownerPlayer: Player): void {
    target.spells.push(spell);

    this.events.dispatch(GroupSpellsChanged({
      unitGroup: target,
    }));

    this.initSpell(spell, ownerPlayer);
    this.triggerEventForSpellHandler(spell, SpellEvents.SpellPlacedOnUnitGroup({ target }));
  }

  public removeSpellFromUnitGroup(target: UnitGroup, spell: Spell): void {
    const spellIndex = target.spells.indexOf(spell);
    target.spells.splice(spellIndex, 1);

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
