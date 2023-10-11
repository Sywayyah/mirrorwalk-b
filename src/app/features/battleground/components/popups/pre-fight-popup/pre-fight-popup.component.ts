import { Component, OnInit } from '@angular/core';
import { StructFightConfirmed } from 'src/app/core/events';
import { StructPopupData } from 'src/app/core/ui';
import { BasicPopup } from 'src/app/features/shared/components';
import { EventsService } from 'src/app/store';

@Component({
  selector: 'mw-pre-fight-popup',
  templateUrl: './pre-fight-popup.component.html',
  styleUrls: ['./pre-fight-popup.component.scss']
})
export class PreFightPopupComponent extends BasicPopup<StructPopupData> implements OnInit {

  public totalGoldReward: number = 0;
  public totalExpReward: number = 0;

  constructor(
    private events: EventsService,
  ) {
    super();
  }

  public ngOnInit(): void {
    // can be a service/api method
    this.data.struct.guard?.forEach((unitGroup) => {
      // this.totalGoldReward += Math.round(unitGroup.count * unitGroup.type.neutralReward.gold);
      this.totalExpReward += Math.round(unitGroup.count * unitGroup.type.neutralReward.experience);
    });
  }

  public onBattleConfirmed(): void {
    this.close();

    this.events.dispatch(StructFightConfirmed({
      struct: this.popup.data.struct,
    }));
  }

}
