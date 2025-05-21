import { inject, Injectable } from '@angular/core';
import { CONFIG } from 'src/app/core/config';
import {
  DisplayUnitGroupInfo,
  FightEnds,
  GroupAttacked,
  HoverTypeEnum,
  PlayerCastsInstantSpell,
  PlayerClicksAllyGroup,
  PlayerClicksAllyGroupEvent,
  PlayerClicksEnemyGroup,
  PlayerClicksEnemyGroupEvent,
  PlayerHoversCardEvent,
  PlayerHoversGroupCard,
  PlayerRightClicksUnitGroup,
  PlayerTargetsInstantSpellEvent,
  PlayerTargetsSpell,
  PlayerTargetsSpellEvent,
  PlayerTurnStartEvent,
  RoundPlayerTurnStarts,
  UIEventsTypes,
} from 'src/app/core/events';
import { PlayerState, PlayerTypeEnum } from 'src/app/core/players';
import { SpellEvents } from 'src/app/core/spells';
import { ActionHintTypeEnum, ActionHintVariants } from 'src/app/core/ui';
import { UnitGroup } from 'src/app/core/unit-types';
import { Notify, StoreClient, WireMethod } from 'src/app/store';
import { PopupService, UnitGroupInfoPopupComponent } from '../../shared/components';
import { ActionHintService } from '../mw-action-hint.service';
import { CombatInteractorService } from '../mw-combat-interactor.service';
import { MwCurrentPlayerStateService } from '../mw-current-player-state.service';

@Injectable()
export class UiController extends StoreClient() {
  private readonly combatInteractor = inject(CombatInteractorService);
  private readonly actionHint = inject(ActionHintService);
  private readonly curPlayerState = inject(MwCurrentPlayerStateService);
  private readonly popupService = inject(PopupService);

  @WireMethod(PlayerClicksEnemyGroup)
  public handleEnemyCardClick(event: PlayerClicksEnemyGroupEvent): void {
    const playerCurrentState = this.curPlayerState.state.get().playerCurrentState;
    if (playerCurrentState === PlayerState.Normal) {
      this.events.dispatch(
        GroupAttacked({
          attackedGroup: event.attackedGroup,
          attackingGroup: event.attackingGroup,
        }),
      );

      return;
    }

    if (playerCurrentState === PlayerState.SpellTargeting) {
      this.curPlayerState.onCurrentSpellCast();

      this.events.dispatch(
        PlayerTargetsSpell({
          player: event.attackingPlayer,
          spell: this.curPlayerState.state.get().currentSpell,
          target: event.attackedGroup,
        }),
      );

      this.curPlayerState.setSpellsOnCooldown();
    }
  }

  @WireMethod(PlayerClicksAllyGroup)
  public handleAllyGroupClick(event: PlayerClicksAllyGroupEvent): void {
    if (this.curPlayerState.state.get().playerCurrentState === PlayerState.SpellTargeting) {
      this.curPlayerState.onCurrentSpellCast();

      const unitGroup = event.unitGroup;

      this.events.dispatch(
        PlayerTargetsSpell({
          player: unitGroup.ownerPlayer,
          spell: this.curPlayerState.state.get().currentSpell,
          target: unitGroup,
        }),
      );

      this.curPlayerState.setSpellsOnCooldown();
    }
  }

  @WireMethod(PlayerHoversGroupCard)
  public handlePlayerHover(event: PlayerHoversCardEvent): void {
    const targetGroup = event.hoveredCard as UnitGroup;
    const playerCurrentState = this.curPlayerState.state.get().playerCurrentState;
    const currentSpell = this.curPlayerState.state.get().currentSpell;

    switch (event.hoverType) {
      case HoverTypeEnum.EnemyCard:
        if (playerCurrentState === PlayerState.Normal) {
          /* fix it */
          this.combatInteractor.setDamageHintMessageOnCardHover(event);
        }
        if (playerCurrentState === PlayerState.SpellTargeting) {
          const spellTargetHint: ActionHintVariants['byKey'][ActionHintTypeEnum.OnTargetSpell] = {
            type: ActionHintTypeEnum.OnTargetSpell,
            spell: currentSpell,
            target: targetGroup,
            addedContent: currentSpell.baseType.config.spellConfig.getTargetActionHint?.({
              target: targetGroup,
              ownerHero: event.currentCard?.ownerHero,
              ownerPlayer: event.currentCard?.ownerPlayer,
              spellInstance: currentSpell,
              ownerUnit: this.curPlayerState.state.get().currentCasterUnit,
            }),
          };
          this.actionHint.hintMessage$.next(spellTargetHint);
        }
        break;
      case HoverTypeEnum.AllyCard:
        /* similar logic */
        if (playerCurrentState === PlayerState.SpellTargeting) {
          const spellTargetHint: ActionHintVariants['byKey'][ActionHintTypeEnum.OnTargetSpell] = {
            type: ActionHintTypeEnum.OnTargetSpell,
            spell: currentSpell,
            target: targetGroup,
            addedContent: currentSpell.baseType.config.spellConfig.getTargetActionHint?.({
              target: targetGroup,
              ownerHero: event.currentCard?.ownerHero,
              ownerPlayer: event.currentCard?.ownerPlayer,
              spellInstance: currentSpell,
              ownerUnit: this.curPlayerState.state.get().currentCasterUnit,
            }),
          };

          this.actionHint.hintMessage$.next(spellTargetHint);
        }
        break;
      case HoverTypeEnum.Unhover:
        this.actionHint.hintMessage$.next(null);
    }
  }

  @WireMethod(PlayerRightClicksUnitGroup)
  handleRightClick(event: UIEventsTypes['PlayerRightClicksUnitGroup']): void {
    this.events.dispatch(DisplayUnitGroupInfo({ unitGroup: event.unitGroup }));
  }

  @WireMethod(DisplayUnitGroupInfo)
  displayUnitGroupInfo(event: UIEventsTypes['DisplayUnitGroupInfo']): void {
    if (CONFIG.logObjectsOnRightClick) {
      console.log('show info for:', event);
    }

    this.popupService.createBasicPopup({
      data: { unitGroup: event.unitGroup },
      component: UnitGroupInfoPopupComponent,
      isCloseable: true,
      class: 'small-padding',
    });
  }

  @WireMethod(RoundPlayerTurnStarts)
  public disableActionHintOnEnemyTurn(event: PlayerTurnStartEvent): void {
    if (event.currentPlayer !== this.curPlayerState.state.get().currentPlayer) {
      this.actionHint.disableActionHint$.next(true);
    } else {
      this.actionHint.disableActionHint$.next(false);
    }
  }

  @Notify(FightEnds)
  public enableActionHint(): void {
    this.actionHint.disableActionHint$.next(false);
  }

  @WireMethod(PlayerTargetsSpell)
  public playerTargetsSpell(event: PlayerTargetsSpellEvent): void {
    const casterPlayer = event.player;

    this.combatInteractor.triggerEventForSpellHandler(
      event.spell,
      SpellEvents.PlayerTargetsSpell({
        target: event.target,
      }),
    );

    if (casterPlayer.type === PlayerTypeEnum.AI) {
      return;
    }

    this.curPlayerState.setPlayerState(PlayerState.Normal);
    this.curPlayerState.resetCurrentSpell();
  }

  @WireMethod(PlayerCastsInstantSpell)
  public playerUsesInstantSpell(event: PlayerTargetsInstantSpellEvent): void {
    this.combatInteractor.triggerEventForSpellHandler(
      event.spell,
      SpellEvents.PlayerCastsInstantSpell({
        player: event.player,
        spell: event.spell,
      }),
    );
  }
}
