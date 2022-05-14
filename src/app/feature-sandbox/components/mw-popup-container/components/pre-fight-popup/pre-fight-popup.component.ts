import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BattleEventsService, BattleEventTypeEnum, PrefightPopup } from 'src/app/feature-sandbox/services';

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
    private readonly events: BattleEventsService,
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

    this.events.dispatchEvent({
      type: BattleEventTypeEnum.Struct_Fight_Confirmed,
      struct: this.popup.struct,
    })
  }

}
