import { Directive, ElementRef, Inject, InjectionToken, Renderer2 } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { UnitGroupInstModel } from 'src/app/core/model/main.model';
import { VfxService } from '../components/ui-elements/vfx-layer/vfx.service';
import { MwPlayersService } from '../services';
import { MwCurrentPlayerStateService, PlayerState } from '../services/mw-current-player-state.service';
import { MwSpellsService } from '../services/mw-spells.service';
import { MwCustomCursorDirective } from './mw-custom-cursor.directive';

export interface UIUnitProvider {
  getUnitGroup(): UnitGroupInstModel;
}

export const PROVIDE_UI_UNIT_GROUP: InjectionToken<string> = new InjectionToken('UI provider');


@Directive({
  selector: '[mwUnitEventsCursor]'
})
export class MwUnitEventsCursorDirective extends MwCustomCursorDirective {
  private unitGroup!: UnitGroupInstModel;

  constructor(
    vfx: VfxService,
    hostElem: ElementRef,
    renderer: Renderer2,
    private curPlayerState: MwCurrentPlayerStateService,
    private spells: MwSpellsService,
    private players: MwPlayersService,

    @Inject(PROVIDE_UI_UNIT_GROUP)
    private unitGroupProvider: UIUnitProvider,
  ) {
    super(vfx, hostElem, renderer);
  }

  public ngOnInit(): void {
    this.unitGroup = this.unitGroupProvider.getUnitGroup();

    this.curPlayerState.playerStateChanged$
      .pipe(takeUntil(this.destroyed$))
      .subscribe(() => {
        this.recalcCursorIcon();
      });
  }

  protected getCursorIconToShow(): string {
    const isEnemyUnitGroup = this.players.isEnemyUnitGroup(this.unitGroup);
    const playerState = this.curPlayerState.playerCurrentState;

    if (!isEnemyUnitGroup && playerState === PlayerState.Normal) {
      return '';
    }

    const canCastSpellOnTarget = this.spells.canSpellBeCastOnUnit(this.curPlayerState.currentSpell, this.unitGroup, isEnemyUnitGroup);

    if (playerState === PlayerState.SpellTargeting && !canCastSpellOnTarget) {
      return 'interdiction';
    }

    const mapping: Record<PlayerState, string> = {
      [PlayerState.Normal]: 'sword',
      [PlayerState.SpellTargeting]: 'burning-book',
      [PlayerState.WaitsForTurn]: 'hourglass',
    };
    return mapping[this.curPlayerState.playerCurrentState];
  }
}
