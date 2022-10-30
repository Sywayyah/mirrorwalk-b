import { Injectable } from "@angular/core";
import { SpellEventTypes, UnitGroupInstModel } from "src/app/core/model";
import { GroupAttacked, PlayerCastsInstantSpell, PlayerClicksAllyGroup, PlayerClicksAllyGroupEvent, PlayerClicksEnemyGroup, PlayerClicksEnemyGroupEvent, PlayerHoversCardEvent, PlayerHoversGroupCard, PlayerTargetsInstantSpellEvent, PlayerTargetsSpell, PlayerTargetsSpellEvent } from "../events";
import { BattleStateService } from "../mw-battle-state.service";
import { CombatInteractorService } from "../mw-combat-interactor.service";
import { MwCurrentPlayerStateService, PlayerState } from "../mw-current-player-state.service";
import { StoreClient, WireMethod } from "../store";
import { ActionHintTypeEnum, HoverTypeEnum, SpellTargetActionHint } from "../types";

@Injectable()
export class UiController extends StoreClient() {

  constructor(
    private combatInteractor: CombatInteractorService,
    private battleState: BattleStateService,
    private curPlayerState: MwCurrentPlayerStateService,
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
            target: event.hoveredCard as UnitGroupInstModel,
          };
          this.battleState.hintMessage$.next(spellTargetHint);
        }
        break;
      case HoverTypeEnum.AllyCard:
        /* similar logic */
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
  }


  @WireMethod(PlayerTargetsSpell)
  public playerTargetsSpell(event: PlayerTargetsSpellEvent): void {
    this.combatInteractor.triggerEventForSpellHandler(
      event.spell,
      SpellEventTypes.PlayerTargetsSpell,
      { target: event.target },
    );

    this.curPlayerState.setPlayerState(PlayerState.Normal);
    this.curPlayerState.resetCurrentSpell();
  }

  @WireMethod(PlayerCastsInstantSpell)
  public playerUsesInstantSpell(event: PlayerTargetsInstantSpellEvent): void {
    this.combatInteractor.triggerEventForSpellHandler(
      event.spell,
      SpellEventTypes.PlayerCastsInstantSpell,
      {
        player: event.player,
        spell: event.spell,
      }
    );
  }


}
