import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { PlayerModel, UnitGroupModel } from 'src/app/core/model/main.model';
import { MwPlayersService } from '../../services';
import { BattleStateService } from '../../services/mw-battle-state.service';
import { CardEffectsComponent } from '../mw-card-effects/card-effects.component';

@Component({
  selector: 'mw-unit-group-card',
  templateUrl: './mw-unit-group-card.component.html',
  styleUrls: ['./mw-unit-group-card.component.scss']
})
export class MwUnitGroupCardComponent implements OnInit, OnDestroy {

  @Input()
  public unitGroup!: UnitGroupModel;
  @Input()
  public playerInfo!: PlayerModel;

  @Output()
  public cardReady: EventEmitter<MwUnitGroupCardComponent> = new EventEmitter();
  @Output()
  public groupDies: EventEmitter<void> = new EventEmitter();

  @ViewChild('effects', { static: true }) public effectsComponent!: CardEffectsComponent;

  public isCardHovered: boolean = false;
  public isEnemyCard!: boolean;

  public potentialUnitCountLoss: number = 0;
  public attackingUnitGroup!: UnitGroupModel;

  public canCurrentPlayerAttack: boolean = false;
  private destroy$: Subject<void> = new Subject();

  constructor(
    public mwBattleStateService: BattleStateService,
    private playersService: MwPlayersService,
  ) { }

  public ngOnInit(): void {
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
    this.mwBattleStateService.clearHintMessage();
    this.groupDies.next();
  }

  public onCardHover(isHovered: boolean): void {
    this.isCardHovered = isHovered;
    if (this.isEnemyCard) {
      if (isHovered) {
        this.mwBattleStateService.setHintAttackMessage(this.unitGroup);
      } else {
        this.mwBattleStateService.clearHintMessage();
      }
    }
  }

  public onGroupClick(): void {
    if (this.isEnemyCard) {
      this.mwBattleStateService.attackEnemyGroup(this.unitGroup);
      this.mwBattleStateService.setHintAttackMessage(this.unitGroup);
    }
  }

}
