import { Injectable } from '@angular/core';
import { SpellEvents } from 'src/app/core/spells';
import { Notify, StoreClient, WireMethod } from 'src/app/store';
import { CombatAttackInteraction, CombatInteractionEnum, CombatInteractionStateEvent, FightNextRoundStarts, FightStarts, GroupAttacked, GroupAttackedEvent, GroupDies, GroupDiesEvent, NextRoundStarts, RoundGroupSpendsTurn, StructCompleted } from '../events';
import { CombatInteractorService } from '../mw-combat-interactor.service';

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
  public prepareSpellsOnFightStart(): void {
    this.combatInteractor.initAllUnitGroupSpells();

    this.combatInteractor.resetAllUnitGroupsCooldowns();
  }

  @WireMethod(GroupAttacked)
  public startCombatInteraction(event: GroupAttackedEvent): void {
    this.events.dispatch(CombatAttackInteraction({
      action: CombatInteractionEnum.GroupAttacks,
      attackedGroup: event.attackedGroup,
      attackingGroup: event.attackingGroup,
    }));
  }

  @WireMethod(CombatAttackInteraction)
  public processCombatInteraction(state: CombatInteractionStateEvent): void {
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
  public resetCooldownsAndEmitNewRoundEventToSpells(event: NextRoundStarts): void {
    this.combatInteractor.triggerEventForAllSpellsHandler(
      SpellEvents.NewRoundBegins({ round: event.round }),
    );

    this.combatInteractor.resetAllUnitGroupsCooldowns();
  }

  @WireMethod(GroupDies)
  public dispelUnitOnDeath(event: GroupDiesEvent): void {
    this.combatInteractor.applyDispellToUnitGroup(event.target);
  }
}
