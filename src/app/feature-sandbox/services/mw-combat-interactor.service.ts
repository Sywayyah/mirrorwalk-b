import { Injectable } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import {
  PlayerInstanceModel,
  UnitGroupInstModel,
  UnitGroupModel,
} from 'src/app/core/model/main.model';
import {
  SpellActivationType,
  SpellEventHandlers,
  SpellEventsMapping,
  SpellEventTypes,
  SpellInstance,
  SpellModel,
} from 'src/app/core/model/spells';
import { Modifiers } from 'src/app/core/model/modifiers';
import { CommonUtils } from 'src/app/core/utils/common.utils';
import { BattleEventsService } from './mw-battle-events.service';
import { MwBattleLogService } from './mw-battle-log.service';
import { BattleStateService } from './mw-battle-state.service';
import { MwCurrentPlayerStateService, PlayerState } from './mw-current-player-state.service';
import { MwPlayersService } from './mw-players.service';
import { MwSpellsService } from './mw-spells.service';
import { MwUnitGroupStateService } from './mw-unit-group-state.service';
import {
  BattleEventTypeEnum,
  CombatGroupAttacked,
  CombatInteractionEnum,
  CombatInteractionState,
  HoverTypeEnum,
  PlayerTargetsSpell,
  UIPlayerHoversCard,
} from './types';
import { ActionHintTypeEnum, AttackActionHint, SpellTargetActionHint } from './types/action-hint.types';
import { CombatActionsRef, DamageType, PostDamageInfo, SpellCreationOptions } from 'src/app/core/model/combat-api/combat-api.types';
// import { MwItemsService } from './mw-items-service.service';
// import { GameEventTypes } from 'src/app/core/model/items/items.types';


@Injectable({
  providedIn: 'root'
})
export class CombatInteractorService {

  private spellsHandlersMap: Map<SpellInstance, SpellEventHandlers> = new Map();
  private unitGroupModifiersMap: Map<UnitGroupInstModel, Modifiers[]> = new Map();

  constructor(
    private readonly battleState: BattleStateService,
    private readonly battleEvents: BattleEventsService,
    private readonly curPlayerState: MwCurrentPlayerStateService,
    private readonly players: MwPlayersService,
    private readonly battleLog: MwBattleLogService,
    private readonly unitState: MwUnitGroupStateService,
    private readonly spellsService: MwSpellsService,
  ) {
  }

  public listenEvents(): void {
    this.initPlayersSpells();

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
        this.triggerEventForSpellHandler(event.spell, SpellEventTypes.PlayerTargetsSpell, { target: event.target });
        this.curPlayerState.playerCurrentState = PlayerState.Normal;
        this.curPlayerState.resetCurrentSpell();
      },

      [BattleEventTypeEnum.Player_Casts_Instant_Spell]: (event) => {
        this.triggerEventForSpellHandler(event.spell, SpellEventTypes.PlayerCastsInstantSpell, {
          player: event.player,
          spell: event.spell,
        });
      },

      [BattleEventTypeEnum.Fight_Next_Round_Starts]: (event) => {
        this.triggerEventForAllSpellsHandler(
          SpellEventTypes.NewRoundBegins,
          {
            round: event.round,
          },
        );
        // this.itemsService.triggerEventForAllItemsHandlers(
        //   GameEventTypes.NewRoundBegins,
        //   {
        //     round: event.round,
        //   }
        // );
      },

      [BattleEventTypeEnum.On_Group_Dies]: (event) => {
        const target = event.target;

        /* todo: apply the same when round ends */
        const dispellableTypes: SpellActivationType[] = [
          SpellActivationType.Buff,
          SpellActivationType.Debuff,
        ];

        target.spells.forEach((spell) => {
          if (dispellableTypes.includes(spell.baseType.activationType)) {
            this.removeSpellFromUnitGroup(event.target, spell);
          }
        });

        const targetMods = this.unitGroupModifiersMap.get(target);

        if (targetMods) {
          targetMods.length = 0;
        }
      }
    }).pipe(
      takeUntil(this.battleEvents.onEvent(BattleEventTypeEnum.Fight_Ends)),
    ).subscribe();
  }

  public dealDamageTo(
    target: UnitGroupInstModel,
    damage: number,
    type: DamageType = DamageType.PhysicalAttack,
    postActionFn?: (actionInfo: PostDamageInfo) => void,
  ): void {
    /* todo: OnGroupDamaged isn't dispatched, and reward isn't calculated because of that. */
    let finalDamage = damage;

    switch (type) {
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

    if (finalDamageInfo.isDamageFatal) {
      this.battleState.handleDefeatedUnitGroup(target);
      this.battleEvents.dispatchEvent({
        type: BattleEventTypeEnum.On_Group_Dies,
        target: target,
        targetPlayer: target.ownerPlayerRef,
        loss: finalDamageInfo.finalUnitLoss,
      });
    }

    if (finalDamageInfo.finalUnitLoss) {
      this.battleEvents.dispatchEvent({
        type: BattleEventTypeEnum.On_Group_Takes_Damage,
        unitLoss: finalDamageInfo.finalUnitLoss,
        registerLoss: true,
        group: target,
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

    const attackDetails = this.unitState.getDetailedAttackInfo(
      attacker,
      attacked,
      this.getModsForUnitGroup(attacker),
    );

    const damageInfo = this.unitState.getFinalDamageInfoFromDamageDetailedInfo(attackDetails);

    const finalDamageInfo = this.unitState.dealPureDamageToUnitGroup(attacked, damageInfo.finalDamage);

    if (!isCounterattack) {
      this.battleState.currentGroupTurnsLeft--;
      attacker.turnsLeft = this.battleState.currentGroupTurnsLeft;

      this.battleEvents.dispatchEvent({
        type: BattleEventTypeEnum.On_Group_Damaged_By_Group,
        attackerGroup: attacker,
        attackedGroup: attacked,
        loss: finalDamageInfo.finalUnitLoss,
        damage: finalDamageInfo.finalDamage,
      });
    } else {
      this.battleEvents.dispatchEvent({
        type: BattleEventTypeEnum.On_Group_Counter_Attacked,
        attackerGroup: attacker,
        attackedGroup: attacked,
        loss: finalDamageInfo.finalUnitLoss,
        damage: finalDamageInfo.finalDamage,
      });
    }

    if (finalDamageInfo.isDamageFatal) {
      this.battleState.handleDefeatedUnitGroup(attacked);
      this.battleEvents.dispatchEvent({
        type: BattleEventTypeEnum.On_Group_Dies,
        target: attacked,
        targetPlayer: attacked.ownerPlayerRef,
        loss: finalDamageInfo.finalUnitLoss,
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

  public setDamageHintMessageOnCardHover(event: UIPlayerHoversCard): void {
    const attackDetails = this.unitState.getDetailedAttackInfo(
      this.battleState.currentUnitGroup, event.hoveredCard as UnitGroupModel,
      this.getModsForUnitGroup(this.battleState.currentUnitGroup),
    );

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

        if (groupModifiers) {
          groupModifiers.push(modifiers);
        } else {
          this.unitGroupModifiersMap.set(target, [modifiers]);
        }
      },
      createModifiers: (modifiers) => {
        return this.spellsService.createModifiers(modifiers);
      },
      removeModifiresFromUnitGroup: (target, modifiers) => {
        const unitGroupMods = this.unitGroupModifiersMap.get(target);
        if (unitGroupMods) {
          CommonUtils.removeItem(unitGroupMods, modifiers);
        }
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
      historyLog: (plainMsg) => {
        this.battleLog.logSimpleMessage(plainMsg);
      }
    };
  }

  private getModsForUnitGroup(unitGroup: UnitGroupInstModel): Modifiers[] {
    return [
      ...unitGroup.ownerPlayerRef.hero.mods,
      ...this.unitGroupModifiersMap.get(unitGroup) ?? [],
    ];
  }

  private addSpellToUnitGroup(target: UnitGroupInstModel, spell: SpellInstance, ownerPlayer: PlayerInstanceModel): void {
    // const newSpellRef = this.spellsService.createSpell(spell);
    target.spells.push(spell);

    this.initSpell(spell, ownerPlayer);
    this.triggerEventForSpellHandler(spell, SpellEventTypes.SpellPlacedOnUnitGroup, { target: target });
  }

  private removeSpellFromUnitGroup(target: UnitGroupInstModel, spell: SpellInstance): void {
    const spellIndex = target.spells.indexOf(spell);
    target.spells.splice(spellIndex, 1);

    this.spellsHandlersMap.delete(spell);
  }

  private triggerEventForAllSpellsHandler<T extends keyof SpellEventHandlers>(eventType: T, data: SpellEventsMapping[T]): void {
    this.spellsHandlersMap.forEach(spellHandlers => {
      (spellHandlers?.[eventType] as (arg: SpellEventsMapping[T]) => void)?.(data);
    });
  }

  private triggerEventForSpellHandler<T extends keyof SpellEventHandlers>(spell: SpellInstance, eventType: T, data: SpellEventsMapping[T]): void {
    (this.spellsHandlersMap.get(spell)?.[eventType] as (arg: SpellEventsMapping[T]) => void)?.(data);
  }

  private getRandomEnemyUnitGroup(): UnitGroupInstModel {
    const enemyPlayer = this.players.getEnemyPlayer()
    const enemyUnitGroups = this.battleState.heroesUnitGroupsMap.get(enemyPlayer) as UnitGroupInstModel[];
    return CommonUtils.randItem(enemyUnitGroups);
  }

  private initSpell(spell: SpellInstance, player: PlayerInstanceModel): void {
    spell.baseType.type.spellConfig.init({
      actions: this.createActionsApiRef(),
      events: {
        on: (handlers: SpellEventHandlers) => {
          const spellHandlers = this.spellsHandlersMap.get(spell) ?? {};

          this.spellsHandlersMap.set(spell, { ...spellHandlers, ...handlers });
        },
      },
      thisSpell: spell.baseType,
      ownerPlayer: player,
      spellInstance: spell,
      ownerHero: player.hero,
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
}
