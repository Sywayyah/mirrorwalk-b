import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BattleEventsService, BattleEventTypeEnum, FightEndsPopup } from 'src/app/feature-sandbox/services';

@Component({
  selector: 'mw-post-fight-reward-popup',
  templateUrl: './post-fight-reward-popup.component.html',
  styleUrls: ['./post-fight-reward-popup.component.scss']
})
export class PostFightRewardPopupComponent implements OnInit {

  @Input() public popup!: FightEndsPopup;
  @Output() public close: EventEmitter<void> = new EventEmitter<void>();

  constructor(
    private readonly events: BattleEventsService,
  ) { }

  ngOnInit(): void {
  }

  public closePopup(): void {
    this.close.emit();
  }

  public onContinue(popup: FightEndsPopup): void {
    this.closePopup();

    this.events.dispatchEvent({ type: BattleEventTypeEnum.Struct_Completed, struct: popup.struct });
  }
}
