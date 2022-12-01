import { Directive, ElementRef, Inject, InjectionToken, NgZone, Renderer2 } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { UnitGroupInstModel } from 'src/app/core/unit-types';
import { SpellCastCursorAnimation, StaticCursorAnimation } from 'src/app/core/vfx';
import { MwCurrentPlayerStateService, MwPlayersService, MwSpellsService, PlayerState } from '../../services';
import { CursorService } from '../components/custom-cursor/cursor.service';
import { AnimatedCursor, MwCustomCursorDirective } from './mw-custom-cursor.directive';

export interface UIUnitProvider {
  getUnitGroup(): UnitGroupInstModel;
}

export const PROVIDE_UI_UNIT_GROUP: InjectionToken<string> = new InjectionToken('UI element unit group provider');


@Directive({
  selector: '[mwUnitEventsCursor]'
})
export class MwUnitEventsCursorDirective extends MwCustomCursorDirective {
  private unitGroup!: UnitGroupInstModel;

  constructor(
    vfx: CursorService,
    hostElem: ElementRef,
    renderer: Renderer2,
    private curPlayerState: MwCurrentPlayerStateService,
    private spells: MwSpellsService,
    private players: MwPlayersService,

    @Inject(PROVIDE_UI_UNIT_GROUP)
    private unitGroupProvider: UIUnitProvider,
    protected ngZone: NgZone,
  ) {
    super(vfx, hostElem, renderer, ngZone);
  }

  public ngOnInit(): void {
    this.unitGroup = this.unitGroupProvider.getUnitGroup();

    this.curPlayerState.playerStateChanged$
      .pipe(takeUntil(this.destroyed$))
      .subscribe(() => {
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

    if (playerState === PlayerState.Normal && (!isEnemyUnitGroup || isEnemyUnitGroup && !this.unitGroup.fightInfo.isAlive)) {
      return this.createStaticCursor('interdiction');
    }

    const canCastSpellOnTarget = this.spells.canSpellBeCastOnUnit(this.curPlayerState.currentSpell, this.unitGroup, isEnemyUnitGroup);

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
        }
      };
    }


    return this.createStaticCursor(mapping[this.curPlayerState.playerCurrentState]);
  }

  private createStaticCursor(cursorIcon: string): AnimatedCursor {
    return {
      animation: StaticCursorAnimation,
      data: {
        custom: {
          parts: [
            { color: 'white', icon: cursorIcon, text: '', type: 'plainPart' },
          ],
        }
      },
    }
  }
}
