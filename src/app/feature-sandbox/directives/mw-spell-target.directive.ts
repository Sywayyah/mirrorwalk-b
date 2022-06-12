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

  /* maybe create some other directive, which turns off default context menu */
  @HostListener('contextmenu', ['$event'])
  public onContextMenu(event: MouseEvent): boolean {
    event.stopPropagation();
    event.preventDefault();
    return false;
  }

  @HostListener('mousedown', ['$event'])
  public onMouseDown(event: MouseEvent): void {
    if (event.button === 2) {
      event.preventDefault();

      this.curPlayerState.cancelCurrentSpell();
    }
  }

  @HostListener('click', ['$event'])
  public onClick(): void {
    if (!this.canActivateCurrentSpell()) {
      this.curPlayerState.cancelCurrentSpell();
    }
  }

  @HostListener('mouseenter')
  public onMouseEnter(): void {
    if (!this.curPlayerState.isSpellBeingCasted()) {
      return;
    }

    if (!this.canActivateCurrentSpell()) {
      this.renderer.addClass(this.elemRef.nativeElement, 'cannot-target');
    }
  }

  @HostListener('mouseleave')
  public onMouseLeave(): void {
    if (!this.curPlayerState.isSpellBeingCasted()) {
      return;
    }

    this.renderer.removeClass(this.elemRef.nativeElement, 'cannot-target');
  }

  private canActivateCurrentSpell(): boolean {
    const spellConfig = this.curPlayerState.currentSpell.type.type.spellConfig;

    const canActivateFn = spellConfig.targetCastConfig?.canActivate;

    if (!canActivateFn) {
      return true;
    }

    return canActivateFn({
      unitGroup: this.spellTargetUnitGroup,
      isEnemy: this.players.isEnemyUnitGroup(this.spellTargetUnitGroup),
    });
  }
}
