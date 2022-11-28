import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ResourceType } from 'src/app/core/resources';
import { FightEndsPopup } from 'src/app/core/ui';
import { MwPlayersService } from 'src/app/feature-sandbox/services';
import { StructCompleted } from 'src/app/feature-sandbox/services/events';
import { EventsService } from 'src/app/feature-sandbox/services/store';

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
    private readonly players: MwPlayersService,
    private events: EventsService,
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

    this.events.dispatch(StructCompleted({
      struct: popup.struct,
    }))
  }
}
