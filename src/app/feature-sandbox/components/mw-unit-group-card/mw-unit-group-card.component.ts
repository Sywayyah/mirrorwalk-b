import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { PlayerModel, UnitGroupModel } from 'src/app/core/model/main.model';
import { BattleStateService } from '../../services/mw-battle-state.service';

@Component({
  selector: 'mw-mw-unit-group-card',
  templateUrl: './mw-unit-group-card.component.html',
  styleUrls: ['./mw-unit-group-card.component.scss']
})
export class MwUnitGroupCardComponent implements OnInit, OnDestroy {

  @Input()
  public unitGroup!: UnitGroupModel;
  @Input()
  public playerInfo!: PlayerModel;

  public isCardHovered: boolean = false;
  public isEnemyCard!: boolean;

  public potentialUnitCountLoss: number = 0;
  public attackingUnitGroup!: UnitGroupModel;

  private destroy$: Subject<void> = new Subject();

  constructor(
    public mwBattleStateService: BattleStateService,
  ) { }

  public ngOnInit(): void {
    this.isEnemyCard = this.mwBattleStateService.currentPlayer !== this.playerInfo;
    this.mwBattleStateService.battleEvent
      .pipe(
        takeUntil(this.destroy$),
      )
      .subscribe(() => {
        const currentUnitGroup = this.mwBattleStateService.currentUnitGroup;
        this.attackingUnitGroup = currentUnitGroup;

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
