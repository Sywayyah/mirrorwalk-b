import { Directive, InjectionToken, OnInit, inject } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { PlayerState } from 'src/app/core/players';
import { UnitGroup } from 'src/app/core/unit-types';
import { CenteredStaticCursorAnimation, SpellCastCursorAnimation, StaticCursorAnimation } from 'src/app/core/vfx';
import { MwCurrentPlayerStateService, MwPlayersService, MwSpellsService } from '../../services';
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
  private readonly players = inject(MwPlayersService);
  private readonly unitGroupProvider = inject(PROVIDE_UI_UNIT_GROUP);

  private unitGroup!: UnitGroup;

  public ngOnInit(): void {
    this.unitGroup = this.unitGroupProvider.getUnitGroup();

    this.curPlayerState.playerStateChanged$.pipe(takeUntil(this.destroyed$)).subscribe(() => {
      this.recalcCursorIcon();
    });
  }

  protected getCursorToShow(): AnimatedCursor | null {
    // todo: maybe some way to use normal cursor

    const isEnemyUnitGroup = this.players.isEnemyUnitGroup(this.unitGroup);
    const playerState = this.curPlayerState.playerCurrentState;

    if (this.curPlayerState.playerCurrentState !== PlayerState.SpellTargeting && !isEnemyUnitGroup) {
      return null;
    }

    if (
      playerState === PlayerState.Normal &&
      (!isEnemyUnitGroup || (isEnemyUnitGroup && !this.unitGroup.isAlive))
    ) {
      return this.createStaticCursor('interdiction');
    }

    const canCastSpellOnTarget = this.spells.canSpellBeCastOnUnit(
      this.curPlayerState.currentSpell,
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

    if (this.curPlayerState.playerCurrentState === PlayerState.SpellTargeting) {
      return {
        animation: SpellCastCursorAnimation,
        options: {
          duration: 2000,
          iterations: Infinity,
        },
      };
    }

    return this.createStaticCursor(mapping[this.curPlayerState.playerCurrentState]);
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
