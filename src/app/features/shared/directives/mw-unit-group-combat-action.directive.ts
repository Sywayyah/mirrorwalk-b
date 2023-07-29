import { Directive, HostListener, Inject, Input, OnInit } from '@angular/core';
import { HoverTypeEnum, PlayerClicksAllyGroup, PlayerClicksEnemyGroup, PlayerHoversGroupCard, PlayerRightClicksUnitGroup } from 'src/app/core/events';
import { UnitGroup } from 'src/app/core/unit-types';
import { EventsService } from 'src/app/store';
import { BattleStateService, MwCurrentPlayerStateService, MwPlayersService } from '../../services';
import { PROVIDE_UI_UNIT_GROUP, UIUnitProvider } from './mw-unit-events-cursor.directive';


@Directive({
  selector: '[mwUnitGroupCombatAction]'
})
export class MwUnitGroupCombatActionDirective implements OnInit {

  @Input() public actionTargetUnitGroup!: UnitGroup;

  private isEnemyCard: boolean = false;

  constructor(
    private readonly curPlayerState: MwCurrentPlayerStateService,
    private readonly players: MwPlayersService,
    private readonly mwBattleStateService: BattleStateService,
    private events: EventsService,

    @Inject(PROVIDE_UI_UNIT_GROUP)
    private unitGroupProvider: UIUnitProvider,
  ) {
  }

  public ngOnInit(): void {
    this.actionTargetUnitGroup = this.unitGroupProvider.getUnitGroup();
    this.isEnemyCard = this.players.isEnemyUnitGroup(this.actionTargetUnitGroup);
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

      if (this.curPlayerState.isSpellBeingCasted()) {
        this.curPlayerState.cancelCurrentSpell();

        this.dispatchUnitGroupHovered(this.isEnemyCard ? HoverTypeEnum.EnemyCard : HoverTypeEnum.AllyCard);
      } else {
        this.events.dispatch(PlayerRightClicksUnitGroup({ unitGroup: this.actionTargetUnitGroup }));
      }
    }
  }

  @HostListener('click', ['$event'])
  public onClick(): void {
    if (!this.canActivateCurrentSpell()) {
      this.curPlayerState.cancelCurrentSpell();
      return;
    }

    if (this.isEnemyCard) {
      if (!this.actionTargetUnitGroup.fightInfo.isAlive) {
        return;
      }

      this.events.dispatch(PlayerClicksEnemyGroup({
        attackedGroup: this.actionTargetUnitGroup,
        attackingGroup: this.mwBattleStateService.currentUnitGroup,
        attackingPlayer: this.mwBattleStateService.currentPlayer,
      }));
      this.dispatchUnitGroupHovered(HoverTypeEnum.EnemyCard);
    } else {
      this.events.dispatch(PlayerClicksAllyGroup({
        unitGroup: this.actionTargetUnitGroup
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
      unitGroup: this.actionTargetUnitGroup,
      isEnemy: this.isEnemyCard,
    });
  }

  private dispatchUnitGroupHovered(hoverType: HoverTypeEnum) {
    this.events.dispatch(PlayerHoversGroupCard({
      hoverType: hoverType,
      currentCard: this.mwBattleStateService.currentUnitGroup,
      hoveredCard: this.actionTargetUnitGroup,
    }));
  }
}
