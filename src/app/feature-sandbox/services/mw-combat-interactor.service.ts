import { Injectable } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import {
  DamageType,
  PlayerInstanceModel,
  PostDamageInfo,
  SpellActivationType,
  SpellEventHandlers,
  SpellEventsMapping,
  SpellEventTypes,
  SpellModel,
  UnitGroupInstModel,
  UnitGroupModel,
} from 'src/app/core/model/main.model';
import { CommonUtils } from 'src/app/core/utils/common.utils';
import { BattleEventsService } from './mw-battle-events.service';
import { MwBattleLogService } from './mw-battle-log.service';
import { BattleStateService } from './mw-battle-state.service';
import { MwCurrentPlayerStateService, PlayerState } from './mw-current-player-state.service';
import { MwPlayersService } from './mw-players.service';
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


@Injectable({
  providedIn: 'root'
})
export class CombatInteractorService {

  private spellsHandlersMap: Map<SpellModel, SpellEventHandlers> = new Map();

  constructor(
    private readonly battleState: BattleStateService,
    private readonly battleEvents: BattleEventsService,
    private readonly curPlayerState: MwCurrentPlayerStateService,
    private readonly players: MwPlayersService,
    private readonly battleLog: MwBattleLogService,
    private readonly unitState: MwUnitGroupStateService,
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
        // const spellHandlers = this.spellsHandlersMap.get(event.spell);
        // spellHandlers?.[SpellEventTypes.PlayerTargetsSpell]?.({ target: event.target });
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
        this.triggerEventForAllSpellsHandler(SpellEventTypes.NewRoundBegins, { round: event.round });
      },

      [BattleEventTypeEnum.On_Group_Dies]: (event) => {
        event.target.spells.forEach((spell) => {
          if (spell.activationType === SpellActivationType.Debuff) {
            this.removeSpellFromUnitGroup(event.target, spell);
          }
        })
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
        finalDamage = damage;
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

    const attackDetails = this.unitState.getDetailedAttackInfo(attacker, attacked);

    /* todo: revisit this. total damage and realUnitLoss aren't related. */
    /* todo: also, implement health tail */
    const damageInfo = this.unitState.getFinalDamageInfoFromDamageDetailedInfo(attackDetails);
    // const totalDamage = this.rollDamage(attackDetails);
    // const realUnitLoss = CommonUtils.randIntInRange(attackDetails.minUnitCountLoss, attackDetails.maxUnitCountLoss);

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
    const attackDetails = this.unitState.getDetailedAttackInfo(this.battleState.currentUnitGroup, event.hoveredCard as UnitGroupModel);

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

  private addSpellToUnitGroup(target: UnitGroupInstModel, spell: SpellModel, ownerPlayer: PlayerInstanceModel): SpellModel {
    const newSpellRef = { ...spell };
    target.spells.push(newSpellRef);

    this.initSpell(newSpellRef, ownerPlayer);
    this.triggerEventForSpellHandler(newSpellRef, SpellEventTypes.SpellPlacedOnUnitGroup, { target: target });
    return newSpellRef;
  }

  private removeSpellFromUnitGroup(target: UnitGroupInstModel, spell: SpellModel): void {
    const spellIndex = target.spells.indexOf(spell);
    target.spells.splice(spellIndex, 1);

    this.spellsHandlersMap.delete(spell);
  }

  private triggerEventForAllSpellsHandler<T extends keyof SpellEventHandlers>(eventType: T, data: SpellEventsMapping[T]): void {
    this.spellsHandlersMap.forEach(spellHandlers => {
      (spellHandlers?.[eventType] as (arg: SpellEventsMapping[T]) => void)?.(data);
    });
  }

  private triggerEventForSpellHandler<T extends keyof SpellEventHandlers>(spell: SpellModel, eventType: T, data: SpellEventsMapping[T]): void {
    (this.spellsHandlersMap.get(spell)?.[eventType] as (arg: SpellEventsMapping[T]) => void)?.(data);
  }

  private getRandomEnemyUnitGroup(): UnitGroupInstModel {
    const enemyPlayer = this.players.getEnemyPlayer()
    const enemyUnitGroups = this.battleState.heroesUnitGroupsMap.get(enemyPlayer) as UnitGroupInstModel[];
    return CommonUtils.randItem(enemyUnitGroups);
  }

  private initSpell(spell: SpellModel, player: PlayerInstanceModel): void {
    spell.type.spellConfig.init({
      actions: {
        dealDamageTo: (target, damage, damageType, postActionFn) => {
          this.dealDamageTo(target, damage, damageType, postActionFn);
        },
        /* dark magic of types, just so it can work */
        addSpellToUnitGroup: <T>(target: UnitGroupInstModel, spell: SpellModel<T>, ownerPlayer: PlayerInstanceModel) => {
          return this.addSpellToUnitGroup(target, spell as SpellModel, ownerPlayer) as SpellModel<T>;
        },
        removeSpellFromUnitGroup: (target, spell) => {
          this.removeSpellFromUnitGroup(target, spell as SpellModel);
        },
        getRandomEnemyPlayerGroup: () => {
          return this.getRandomEnemyUnitGroup();
        },
        historyLog: (plainMsg) => {
          this.battleLog.logSimpleMessage(plainMsg);
        }
      },
      events: {
        on: (handlers: SpellEventHandlers) => {
          const spellHandlers = this.spellsHandlersMap.get(spell) ?? {};

          this.spellsHandlersMap.set(spell, { ...spellHandlers, ...handlers });
        },
      },
      thisSpell: spell,
      ownerPlayer: player,
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
