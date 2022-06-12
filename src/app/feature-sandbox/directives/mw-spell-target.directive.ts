import { Directive, ElementRef, HostListener, Input, Renderer2 } from '@angular/core';
import { UnitGroupInstModel } from 'src/app/core/model/main.model';
import { MwPlayersService } from '../services';
import { MwCurrentPlayerStateService } from '../services/mw-current-player-state.service';

@Directive({
  selector: '[mwSpellTarget]'
})
export class MwSpellTargetDirective {

  @Input() public spellTargetUnitGroup!: UnitGroupInstModel;

  constructor(
    private readonly curPlayerState: MwCurrentPlayerStateService,
    private readonly players: MwPlayersService,
    private readonly elemRef: ElementRef,
    private readonly renderer: Renderer2,
  ) { }

  @HostListener('click')
  public onClick(): void {

  }

  @HostListener('mouseenter')
  public onMouseEnter(): void {
    if (!this.curPlayerState.isSpellBeingCasted()) {
      return;
    }

    const spellConfig = this.curPlayerState.currentSpell.type.type.spellConfig;

    const canActivateFn = spellConfig.targetCastConfig?.canActivate;

    if (canActivateFn) {
      const canActivate = canActivateFn({
        unitGroup: this.spellTargetUnitGroup,
        isEnemy: this.players.isEnemyUnitGroup(this.spellTargetUnitGroup),
      });

      if (!canActivate) {
        this.renderer.addClass(this.elemRef.nativeElement, 'cannot-target');
      }
    }
  }

  @HostListener('mouseleave')
  public onMouseLeave(): void {
    if (!this.curPlayerState.isSpellBeingCasted()) {
      return;
    }

    this.renderer.removeClass(this.elemRef.nativeElement, 'cannot-target');
  }

}
