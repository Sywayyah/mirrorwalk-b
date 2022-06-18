import { Directive, ElementRef, HostListener, Input, OnInit, Renderer2 } from '@angular/core';
import { UnitGroupInstModel } from 'src/app/core/model/main.model';
import { BattleEventsService, BattleEventTypeEnum, BattleStateService, HoverTypeEnum, MwPlayersService } from '../services';
import { MwCurrentPlayerStateService } from '../services/mw-current-player-state.service';

/* 
  considering that this directive handles not only spells, it can be renamed later
*/
@Directive({
  selector: '[mwSpellTarget]'
})
export class MwSpellTargetDirective implements OnInit {

  @Input() public spellTargetUnitGroup!: UnitGroupInstModel;

  private isEnemyCard: boolean = false;

  constructor(
    private readonly curPlayerState: MwCurrentPlayerStateService,
    private readonly players: MwPlayersService,
    private readonly elemRef: ElementRef,
    private readonly renderer: Renderer2,
    private readonly battleEvents: BattleEventsService,
    private readonly mwBattleStateService: BattleStateService,
  ) { }

  public ngOnInit(): void {
    this.isEnemyCard = this.players.isEnemyUnitGroup(this.spellTargetUnitGroup);
  }

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
      this.dispatchUnitGroupHovered();
    }
  }

  @HostListener('click', ['$event'])
  public onClick(): void {
    if (!this.canActivateCurrentSpell()) {
      this.curPlayerState.cancelCurrentSpell();
      return;
    }

    if (this.isEnemyCard) {
      this.battleEvents.dispatchEvent({
        type: BattleEventTypeEnum.UI_Player_Clicks_Enemy_Group,
        attackedGroup: this.spellTargetUnitGroup,
        attackingGroup: this.mwBattleStateService.currentUnitGroup,
        attackingPlayer: this.mwBattleStateService.currentPlayer,
      });
      this.dispatchUnitGroupHovered();
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
      isEnemy: this.isEnemyCard,
    });
  }

  private dispatchUnitGroupHovered() {
    this.battleEvents.dispatchEvent({
      type: BattleEventTypeEnum.UI_Player_Hovers_Group_Card,
      hoverType: HoverTypeEnum.EnemyCard,
      currentCard: this.mwBattleStateService.currentUnitGroup,
      hoveredCard: this.spellTargetUnitGroup,
    });
  }
}
