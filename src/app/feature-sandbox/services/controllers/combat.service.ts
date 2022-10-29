import { Injectable } from "@angular/core";
import { SpellEventTypes, UnitGroupInstModel } from "src/app/core/model";
import { BattleStateService, CombatInteractorService, MwCurrentPlayerStateService, PlayerState } from "../";
import { CombatAttackInteraction, CombatInteractionEnum, CombatInteractionStateEvent, FightNextRoundStarts, FightStarts, GroupAttacked, GroupAttackedEvent, GroupDies, GroupDiesEvent, NextRoundStarts, PlayerCastsInstantSpell, PlayerHoversCardEvent, PlayerHoversGroupCard, PlayerTargetsInstantSpellEvent, PlayerTargetsSpell, PlayerTargetsSpellEvent, RoundGroupSpendsTurn, StructCompleted } from "../events";
import { Notify, StoreClient, WireMethod } from "../state";
import { ActionHintTypeEnum, HoverTypeEnum, SpellTargetActionHint } from "../types";


@Injectable()
export class CombatController extends StoreClient() {

  constructor(
    private combatInteractor: CombatInteractorService,
    private battleState: BattleStateService,
    private curPlayerState: MwCurrentPlayerStateService,
  ) {
    super();
  }

  @Notify(StructCompleted)
  public dispellAllUnitsOnStructCompleted(): void {
    this.combatInteractor.forEachUnitGroup((unitGroup) => this.combatInteractor.applyDispellToUnitGroup(unitGroup));
  }

  @Notify(FightStarts)
  public initSpells(): void {
    this.combatInteractor.initAllUnitGroupSpells();

    this.combatInteractor.resetAllUnitGroupsCooldowns();
  }

  @WireMethod(GroupAttacked)
  public startInteraction(event: GroupAttackedEvent): void {
    this.events.dispatch(CombatAttackInteraction({
      action: CombatInteractionEnum.GroupAttacks,
      attackedGroup: event.attackedGroup,
      attackingGroup: event.attackingGroup,
    }));
  }

  @WireMethod(CombatAttackInteraction)
  public processAttackInteraction(state: CombatInteractionStateEvent): void {
    switch (state.action) {
      case CombatInteractionEnum.GroupAttacks:
        this.combatInteractor.handleAttackInteraction(state);
        break;
      case CombatInteractionEnum.GroupCounterattacks:
        this.combatInteractor.handleAttackInteraction(state);
        break;
      case CombatInteractionEnum.AttackInteractionCompleted:
        const attackerGroup = state.attackingGroup;
        this.events.dispatch(RoundGroupSpendsTurn({
          group: attackerGroup,
          groupPlayer: attackerGroup.ownerPlayerRef,
          groupStillAlive: Boolean(attackerGroup.count),
          groupHasMoreTurns: Boolean(attackerGroup.turnsLeft),
        }));
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

  @WireMethod(FightNextRoundStarts)
  public nextRoundStarts(event: NextRoundStarts): void {
    this.combatInteractor.triggerEventForAllSpellsHandler(
      SpellEventTypes.NewRoundBegins,
      {
        round: event.round,
      },
    );

    this.combatInteractor.resetAllUnitGroupsCooldowns();
  }

  @WireMethod(GroupDies)
  public onUnitGroupDies(event: GroupDiesEvent): void {
    this.combatInteractor.applyDispellToUnitGroup(event.target);
  }
}
