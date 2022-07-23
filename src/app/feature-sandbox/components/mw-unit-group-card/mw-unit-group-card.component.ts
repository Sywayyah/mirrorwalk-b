import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { PlayerModel, UnitGroupInstModel } from 'src/app/core/model/main.model';
import { BattleEventsService, BattleEvent, BattleStateService, HoverTypeEnum, MwPlayersService } from '../../services';
import { MwUnitGroupStateService } from '../../services/mw-unit-group-state.service';
import { CardEffectsComponent } from '../mw-card-effects/card-effects.component';

@Component({
  selector: 'mw-unit-group-card',
  templateUrl: './mw-unit-group-card.component.html',
  styleUrls: ['./mw-unit-group-card.component.scss']
})
export class MwUnitGroupCardComponent implements OnInit, OnDestroy {

  @Input()
  public unitGroup!: UnitGroupInstModel;
  @Input()
  public playerInfo!: PlayerModel;
  @Input()
  public side: 'left' | 'right' = 'left';

  @Output()
  public cardReady: EventEmitter<MwUnitGroupCardComponent> = new EventEmitter();
  @Output()
  public groupDies: EventEmitter<void> = new EventEmitter();

  @ViewChild('effects', { static: true }) public effectsComponent!: CardEffectsComponent;

  public isCardHovered: boolean = false;
  public isEnemyCard!: boolean;

  public potentialUnitCountLoss: number = 0;
  public attackingUnitGroup!: UnitGroupInstModel;

  public canCurrentPlayerAttack: boolean = false;
  public isGroupMelee: boolean = false;
  private destroy$: Subject<void> = new Subject();

  constructor(
    public mwBattleStateService: BattleStateService,
    private playersService: MwPlayersService,
    private readonly battleEvents: BattleEventsService,
    private readonly unitsService: MwUnitGroupStateService,
  ) { }

  public ngOnInit(): void {
    this.isGroupMelee = !this.unitsService.isUnitGroupRanged(this.unitGroup);
    this.isEnemyCard = this.playersService.getCurrentPlayer() !== this.playerInfo;
    this.cardReady.next(this);

    this.mwBattleStateService.battleEvent$
      .pipe(
        takeUntil(this.destroy$),
      )
      .subscribe(() => {
        const currentUnitGroup = this.mwBattleStateService.currentUnitGroup;
        this.attackingUnitGroup = currentUnitGroup;
        this.canCurrentPlayerAttack = this.mwBattleStateService.currentPlayer === this.playersService.getCurrentPlayer();

        if (this.isEnemyCard) {
          const potentialTotalMaxDamage = this.mwBattleStateService.getUnitGroupTotalDamage(currentUnitGroup);

          this.potentialUnitCountLoss = Math.floor(potentialTotalMaxDamage / this.unitGroup.type.baseStats.health);
          if (this.potentialUnitCountLoss > this.unitGroup.count) {
            this.potentialUnitCountLoss = this.unitGroup.count;
          }
        }
      });
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.battleEvents.dispatchEvent({ type: BattleEvent.UI_Player_Hovers_Group_Card, hoverType: HoverTypeEnum.Unhover });
    this.groupDies.next();
  }

  public onCardHover(isHovered: boolean): void {
    this.isCardHovered = isHovered;
    if (this.isEnemyCard) {
      if (isHovered) {
        this.battleEvents.dispatchEvent({
          type: BattleEvent.UI_Player_Hovers_Group_Card,
          hoverType: HoverTypeEnum.EnemyCard,
          currentCard: this.mwBattleStateService.currentUnitGroup,
          hoveredCard: this.unitGroup,
        });
      } else {
        this.battleEvents.dispatchEvent({ type: BattleEvent.UI_Player_Hovers_Group_Card, hoverType: HoverTypeEnum.Unhover });
      }
    }
  }

  public onGroupClick(): void {
    /* previously, it was handling click action, now directive handles it */
  }

}
