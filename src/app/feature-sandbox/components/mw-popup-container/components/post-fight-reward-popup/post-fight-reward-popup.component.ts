import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ResourceType } from 'src/app/core/model/resources.types';
import { BattleEventsService, BattleEvent, FightEndsPopup, MwPlayersService } from 'src/app/feature-sandbox/services';
import { EventsService } from 'src/app/feature-sandbox/services/state';
import { StructCompleted } from 'src/app/feature-sandbox/services/state-values/game-events';

@Component({
  selector: 'mw-post-fight-reward-popup',
  templateUrl: './post-fight-reward-popup.component.html',
  styleUrls: ['./post-fight-reward-popup.component.scss']
})
export class PostFightRewardPopupComponent implements OnInit {

  @Input() public popup!: FightEndsPopup;
  @Output() public close: EventEmitter<void> = new EventEmitter<void>();

  public totalGoldReward: number = 0;
  public totalExperienceReward: number = 0;

  constructor(
    // private readonly events: BattleEventsService,
    private readonly players: MwPlayersService,
    private newEvents: EventsService,
  ) { }

  ngOnInit(): void {
    this.popup.enemyLosses.forEach(group => {
      this.totalGoldReward += Math.round(group.count * group.type.neutralReward.gold);
      this.totalExperienceReward += Math.round(group.count * group.type.neutralReward.experience);
    });
  }

  public closePopup(): void {
    this.close.emit();
  }

  public onContinue(popup: FightEndsPopup): void {
    this.closePopup();

    this.players.addExperienceToPlayer(this.players.getCurrentPlayerId(), this.totalExperienceReward);
    const currentPlayer = this.players.getCurrentPlayer();
    const playerResources = currentPlayer.resources;
    playerResources[ResourceType.Gold] += this.totalGoldReward;

    // this.events.dispatchEvent({ type: BattleEvent.Struct_Completed, struct: popup.struct });
    this.newEvents.dispatch(StructCompleted({
      struct: popup.struct,
    }))
  }
}
