import { Injectable } from "@angular/core";
import { SpellEventTypes } from "src/app/core/model";
import { CombatInteractorService } from "../";
import { CombatAttackInteraction, CombatInteractionEnum, CombatInteractionStateEvent, FightNextRoundStarts, FightStarts, GroupAttacked, GroupAttackedEvent, GroupDies, GroupDiesEvent, NextRoundStarts, RoundGroupSpendsTurn, StructCompleted } from "../events";
import { Notify, StoreClient, WireMethod } from "../state";


@Injectable()
export class CombatController extends StoreClient() {

  constructor(
    private combatInteractor: CombatInteractorService,
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
