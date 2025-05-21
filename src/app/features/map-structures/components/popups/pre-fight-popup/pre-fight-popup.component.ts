import { Component, inject, OnInit } from '@angular/core';
import { StructFightConfirmed } from 'src/app/core/events';
import { StructPopupData } from 'src/app/core/ui';
import { CommonUtils } from 'src/app/core/utils';
import { MwPlayersService } from 'src/app/features/services';
import { BasicPopup } from 'src/app/features/shared/components';
import { EventsService } from 'src/app/store';

@Component({
  selector: 'mw-pre-fight-popup',
  templateUrl: './pre-fight-popup.component.html',
  styleUrls: ['./pre-fight-popup.component.scss'],
  standalone: false
})
export class PreFightPopupComponent extends BasicPopup<StructPopupData> implements OnInit {
  private events = inject(EventsService);
  private playersService = inject(MwPlayersService);

  struct = this.data.struct;
  public totalGoldReward: number = 0;
  public totalExpReward: number = 0;

  public readonly experienceGainBonus = this.playersService.getCurrentPlayer().hero.modGroup.getCalcNumModValueOrZero('experienceGainBonus');

  public ngOnInit(): void {
    // can be a service/api method
    this.data.struct.guard?.forEach((unitGroup) => {
      // this.totalGoldReward += Math.round(unitGroup.count * unitGroup.type.neutralReward.gold);
      this.totalExpReward += Math.round(unitGroup.count * unitGroup.type.neutralReward.experience);
    });
    this.totalExpReward = CommonUtils.increaseByPercent(
      this.totalExpReward,
      this.experienceGainBonus,
    );
  }

  public onBattleConfirmed(): void {
    this.close();

    this.events.dispatch(StructFightConfirmed({
      struct: this.popup.data.struct,
    }));
  }

}
