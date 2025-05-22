import { inject, Injectable } from '@angular/core';
import { BattleCommandEvents, CombatAttackInteraction, CombatInteractionEnum, CombatInteractionStateEvent, FightNextRoundStarts, FightStarts, GroupAttacked, GroupAttackedEvent, GroupDies, GroupDiesEvent, NextRoundStarts, RoundGroupSpendsTurn, StructCompleted } from 'src/app/core/events';
import { AddCombatModifiersToUnit, RemoveCombatModifiersFromUnit } from 'src/app/core/events/battle/commands';
import { SpellEvents } from 'src/app/core/spells';
import { Notify, StoreClient, WireMethod } from 'src/app/store';
import { CombatInteractorService } from '../mw-combat-interactor.service';

@Injectable()
export class CombatController extends StoreClient() {
  private combatInteractor = inject(CombatInteractorService);

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
          groupPlayer: attackerGroup.ownerPlayer,
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

  @WireMethod(AddCombatModifiersToUnit)
  public addCombatModsToUnit({ mods, unit }: BattleCommandEvents['AddCombatModifiersToUnit']): void {
    unit.addCombatMods(mods);
  }

  @WireMethod(RemoveCombatModifiersFromUnit)
  public removeCombatModsToUnit({ mods, unit }: BattleCommandEvents['RemoveCombatModifiersFromUnit']): void {
    unit.removeCombatMods(mods);
  }
}
