import { Directive, HostListener, Input, OnInit } from '@angular/core';
import { HoverTypeEnum, PlayerClicksAllyGroup, PlayerClicksEnemyGroup, PlayerHoversGroupCard } from 'src/app/core/events';
import { UnitGroup } from 'src/app/core/unit-types';
import { EventsService } from 'src/app/store';
import { BattleStateService, MwCurrentPlayerStateService, MwPlayersService } from '../../services';

/*
  considering that this directive handles not only spells, it can be renamed later
*/
@Directive({
  selector: '[mwSpellTarget]'
})
export class MwSpellTargetDirective implements OnInit {

  @Input() public spellTargetUnitGroup!: UnitGroup;

  private isEnemyCard: boolean = false;

  constructor(
    private readonly curPlayerState: MwCurrentPlayerStateService,
    private readonly players: MwPlayersService,
    private readonly mwBattleStateService: BattleStateService,
    private events: EventsService,
  ) {
  }

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
      this.dispatchUnitGroupHovered(this.isEnemyCard ? HoverTypeEnum.EnemyCard : HoverTypeEnum.AllyCard);
    }
  }

  @HostListener('click', ['$event'])
  public onClick(): void {
    if (!this.canActivateCurrentSpell()) {
      this.curPlayerState.cancelCurrentSpell();
      return;
    }

    if (this.isEnemyCard) {
      if (!this.spellTargetUnitGroup.fightInfo.isAlive) {
        return;
      }

      this.events.dispatch(PlayerClicksEnemyGroup({
        attackedGroup: this.spellTargetUnitGroup,
        attackingGroup: this.mwBattleStateService.currentUnitGroup,
        attackingPlayer: this.mwBattleStateService.currentPlayer,
      }));
      this.dispatchUnitGroupHovered(HoverTypeEnum.EnemyCard);
    } else {
      this.events.dispatch(PlayerClicksAllyGroup({
        unitGroup: this.spellTargetUnitGroup
      }));
      this.dispatchUnitGroupHovered(HoverTypeEnum.Unhover);
    }
  }

  private canActivateCurrentSpell(): boolean {
    const spellConfig = this.curPlayerState.currentSpell.baseType.type.spellConfig;

    const canActivateFn = spellConfig.targetCastConfig?.canActivate;

    if (!canActivateFn) {
      return true;
    }

    return canActivateFn({
      unitGroup: this.spellTargetUnitGroup,
      isEnemy: this.isEnemyCard,
    });
  }

  private dispatchUnitGroupHovered(hoverType: HoverTypeEnum) {
    this.events.dispatch(PlayerHoversGroupCard({
      hoverType: hoverType,
      currentCard: this.mwBattleStateService.currentUnitGroup,
      hoveredCard: this.spellTargetUnitGroup,
    }));
  }
}
