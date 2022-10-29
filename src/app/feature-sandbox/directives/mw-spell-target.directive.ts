import { Directive, HostListener, Input, OnInit } from '@angular/core';
import { UnitGroupInstModel } from 'src/app/core/model/main.model';
import { BattleEvent, BattleEventsService, BattleStateService, HoverTypeEnum, MwPlayersService } from '../services';
import { MwCurrentPlayerStateService } from '../services/mw-current-player-state.service';
import { EventsService } from '../services/state';
import { PlayerClicksAllyGroup, PlayerClicksEnemyGroup, PlayerHoversGroupCard } from '../services/state-values/ui-events';

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
    private readonly battleEvents: BattleEventsService,
    private readonly mwBattleStateService: BattleStateService,
    private newEvents: EventsService,
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

      // this.battleEvents.dispatchEvent({
      //   type: BattleEvent.UI_Player_Clicks_Enemy_Group,
      //   attackedGroup: this.spellTargetUnitGroup,
      //   attackingGroup: this.mwBattleStateService.currentUnitGroup,
      //   attackingPlayer: this.mwBattleStateService.currentPlayer,
      // });
      this.newEvents.dispatch(PlayerClicksEnemyGroup({
        attackedGroup: this.spellTargetUnitGroup,
        attackingGroup: this.mwBattleStateService.currentUnitGroup,
        attackingPlayer: this.mwBattleStateService.currentPlayer,
      }));
      this.dispatchUnitGroupHovered(HoverTypeEnum.EnemyCard);
    } else {
      // this.battleEvents.dispatchEvent({
      //   type: BattleEvent.UI_Player_Clicks_Ally_Group,
      //   unitGroup: this.spellTargetUnitGroup
      // });
      this.newEvents.dispatch(PlayerClicksAllyGroup({
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
    // this.battleEvents.dispatchEvent({
    //   type: BattleEvent.UI_Player_Hovers_Group_Card,
    //   hoverType: hoverType,
    //   currentCard: this.mwBattleStateService.currentUnitGroup,
    //   hoveredCard: this.spellTargetUnitGroup,
    // });
    console.log(hoverType);
    this.newEvents.dispatch(PlayerHoversGroupCard({
      hoverType: hoverType,
      currentCard: this.mwBattleStateService.currentUnitGroup,
      hoveredCard: this.spellTargetUnitGroup,
    }));
  }
}
