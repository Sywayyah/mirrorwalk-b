import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PrefightPopup } from 'src/app/feature-sandbox/services';
import { EventsService } from 'src/app/feature-sandbox/services/store';
import { StructFightConfirmed } from 'src/app/feature-sandbox/services/events';

@Component({
  selector: 'mw-pre-fight-popup',
  templateUrl: './pre-fight-popup.component.html',
  styleUrls: ['./pre-fight-popup.component.scss']
})
export class PreFightPopupComponent implements OnInit {

  @Input() public popup!: PrefightPopup;
  @Output() public close: EventEmitter<void> = new EventEmitter<void>();

  public totalGoldReward: number = 0;
  public totalExpReward: number = 0;

  constructor(
    private events: EventsService,
  ) { }

  public ngOnInit(): void {
    this.popup.struct.guard.unitGroups.forEach((unitGroup) => {
      this.totalExpReward += Math.round(unitGroup.count * unitGroup.type.neutralReward.experience);
      this.totalGoldReward += Math.round(unitGroup.count * unitGroup.type.neutralReward.experience);
    });
  }

  public closePopup(): void {
    this.close.emit();
  }

  public onBattleConfirmed(): void {
    this.close.emit();

    this.events.dispatch(StructFightConfirmed({
      struct: this.popup.struct,
    }));
  }

}
