import { Directive, InjectionToken, OnInit, inject } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { PlayerState } from 'src/app/core/players';
import { UnitGroup } from 'src/app/core/unit-types';
import { CenteredStaticCursorAnimation, SpellCastCursorAnimation, StaticCursorAnimation } from 'src/app/core/vfx';
import { BattleStateService, MwCurrentPlayerStateService, MwSpellsService } from '../../services';
import { State } from '../../services/state.service';
import { AnimatedCursor, MwCustomCursorDirective } from './mw-custom-cursor.directive';

export interface UIUnitProvider {
  getUnitGroup(): UnitGroup;
}

export const PROVIDE_UI_UNIT_GROUP: InjectionToken<UIUnitProvider> = new InjectionToken(
  'UI element unit group provider',
);

@Directive({
  selector: '[mwUnitEventsCursor]',
  standalone: false,
})
export class MwUnitEventsCursorDirective extends MwCustomCursorDirective implements OnInit {
  private readonly curPlayerState = inject(MwCurrentPlayerStateService);
  private readonly spells = inject(MwSpellsService);
  private readonly battleState = inject(BattleStateService);
  private readonly unitGroupProvider = inject(PROVIDE_UI_UNIT_GROUP);
  private readonly state = inject(State);

  private unitGroup!: UnitGroup;

  public ngOnInit(): void {
    this.unitGroup = this.unitGroupProvider.getUnitGroup();

    this.curPlayerState.state
      .select((state) => state.playerCurrentState)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(() => this.recalcCursorIcon());
  }

  // todo: maybe some way to use normal cursor
  protected getCursorToShow(): AnimatedCursor | null {
    const targetingData = this.battleState.getTargetingData(this.unitGroup);

    if (!targetingData.stateInitialized) {
      return null;
    }

    // keep thinking of current player as enemy if it is uncontrollable AI and opponent isn't AI
    const isEnemyUnitGroup = !targetingData.isCurrentPlayerAI
      ? !targetingData.doesUnitBelongToActivePlayer
      : !targetingData.isOpponentAI &&
        targetingData.doesUnitBelongToActivePlayer &&
        !this.state.gameSettings.get().allowNeutralControl;

    const playerState = this.curPlayerState.state.get().playerCurrentState;

    if (playerState !== PlayerState.SpellTargeting && !isEnemyUnitGroup) {
      return null;
    }

    if (playerState === PlayerState.Normal && (!isEnemyUnitGroup || (isEnemyUnitGroup && !this.unitGroup.isAlive))) {
      return this.createStaticCursor('interdiction');
    }

    const canCastSpellOnTarget = this.spells.canSpellBeCastOnUnit(
      this.curPlayerState.state.get().currentSpell,
      this.unitGroup,
      isEnemyUnitGroup,
    );

    if (playerState === PlayerState.SpellTargeting && !canCastSpellOnTarget) {
      return this.createStaticCursor('interdiction');
    }

    const mapping: Record<PlayerState, string> = {
      [PlayerState.Normal]: 'sword',
      [PlayerState.SpellTargeting]: 'burning-book',
      [PlayerState.WaitsForTurn]: 'hourglass',
    };

    if (playerState === PlayerState.SpellTargeting) {
      return {
        animation: SpellCastCursorAnimation,
        options: {
          duration: 2000,
          iterations: Infinity,
        },
      };
    }
    return this.createStaticCursor(mapping[playerState]);
  }

  private createStaticCursor(cursorIcon: string): AnimatedCursor {
    if (cursorIcon === 'interdiction') {
      return {
        animation: CenteredStaticCursorAnimation,
        data: {
          custom: {
            parts: [{ color: 'white', icon: cursorIcon, text: '', type: 'plainPart' }],
          },
        },
      };
    }
    return {
      animation: StaticCursorAnimation,
      data: {
        custom: {
          parts: [{ color: 'white', icon: cursorIcon, text: '', type: 'plainPart' }],
        },
      },
    };
  }
}
