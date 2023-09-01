import { Injectable } from '@angular/core';
import { CONFIG } from 'src/app/core/config';
import { DisplayUnitGroupInfo, FightEnds, GroupAttacked, HoverTypeEnum, PlayerCastsInstantSpell, PlayerClicksAllyGroup, PlayerClicksAllyGroupEvent, PlayerClicksEnemyGroup, PlayerClicksEnemyGroupEvent, PlayerHoversCardEvent, PlayerHoversGroupCard, PlayerRightClicksUnitGroup, PlayerTargetsInstantSpellEvent, PlayerTargetsSpell, PlayerTargetsSpellEvent, PlayerTurnStartEvent, RoundPlayerTurnStarts, UIEventsTypes } from 'src/app/core/events';
import { PlayerState } from 'src/app/core/players';
import { SpellEvents } from 'src/app/core/spells';
import { ActionHintTypeEnum, SpellTargetActionHint } from 'src/app/core/ui';
import { UnitGroup } from 'src/app/core/unit-types';
import { Notify, StoreClient, WireMethod } from 'src/app/store';
import { ActionHintService } from '../mw-action-hint.service';
import { MwCardsMappingService } from '../mw-cards-mapping.service';
import { CombatInteractorService } from '../mw-combat-interactor.service';
import { MwCurrentPlayerStateService } from '../mw-current-player-state.service';
import { PopupService, UnitGroupInfoPopupComponent } from '../../shared/components';

@Injectable()
export class UiController extends StoreClient() {

  constructor(
    private combatInteractor: CombatInteractorService,
    private actionHint: ActionHintService,
    private curPlayerState: MwCurrentPlayerStateService,
    private cardsMapping: MwCardsMappingService,
    private popupService: PopupService,
  ) {
    super();
  }

  @WireMethod(PlayerClicksEnemyGroup)
  public handleEnemyCardClick(event: PlayerClicksEnemyGroupEvent): void {
    const playerCurrentState = this.curPlayerState.playerCurrentState;
    if (playerCurrentState === PlayerState.Normal) {
      this.events.dispatch(GroupAttacked({
        attackedGroup: event.attackedGroup,
        attackingGroup: event.attackingGroup,
      }));

      return;
    }

    if (playerCurrentState === PlayerState.SpellTargeting) {
      this.curPlayerState.onCurrentSpellCast();

      this.events.dispatch(PlayerTargetsSpell({
        player: event.attackingPlayer,
        spell: this.curPlayerState.currentSpell,
        target: event.attackedGroup,
      }));

      this.curPlayerState.setSpellsOnCooldown();
    }
  }


  @WireMethod(PlayerClicksAllyGroup)
  public handleAllyGroupClick(event: PlayerClicksAllyGroupEvent): void {
    if (this.curPlayerState.playerCurrentState === PlayerState.SpellTargeting) {
      this.curPlayerState.onCurrentSpellCast();

      const unitGroup = event.unitGroup;

      this.events.dispatch(PlayerTargetsSpell({
        player: unitGroup.ownerPlayerRef,
        spell: this.curPlayerState.currentSpell,
        target: unitGroup,
      }));

      this.curPlayerState.setSpellsOnCooldown();
    }
  }

  @WireMethod(PlayerHoversGroupCard)
  public handlePlayerHover(event: PlayerHoversCardEvent): void {
    switch (event.hoverType) {
      case HoverTypeEnum.EnemyCard:
        if (this.curPlayerState.playerCurrentState === PlayerState.Normal) {
          /* fix it */
          this.combatInteractor.setDamageHintMessageOnCardHover(event);
        }
        if (this.curPlayerState.playerCurrentState === PlayerState.SpellTargeting) {
          const spellTargetHint: SpellTargetActionHint = {
            type: ActionHintTypeEnum.OnTargetSpell,
            spell: this.curPlayerState.currentSpell,
            target: event.hoveredCard as UnitGroup,
          };
          this.actionHint.hintMessage$.next(spellTargetHint);
        }
        break;
      case HoverTypeEnum.AllyCard:
        /* similar logic */
        if (this.curPlayerState.playerCurrentState === PlayerState.SpellTargeting) {
          const spellTargetHint: SpellTargetActionHint = {
            type: ActionHintTypeEnum.OnTargetSpell,
            spell: this.curPlayerState.currentSpell,
            target: event.hoveredCard as UnitGroup,
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
    });
  }

  @WireMethod(RoundPlayerTurnStarts)
  public disableActionHintOnEnemyTurn(event: PlayerTurnStartEvent): void {
    if (event.currentPlayer !== this.curPlayerState.currentPlayer) {
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
    this.combatInteractor.triggerEventForSpellHandler(
      event.spell,
      SpellEvents.PlayerTargetsSpell({
        target: event.target,
      }),
    );

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
