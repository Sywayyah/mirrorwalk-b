import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ResourceType } from 'src/app/core/resources';
import { FightEndsPopup } from 'src/app/core/ui';
import { MwPlayersService } from 'src/app/features/services';
import { StructCompleted } from 'src/app/features/services/events';
import { BasicPopup } from 'src/app/features/shared/components';
import { EventsService } from 'src/app/store';

@Component({
  selector: 'mw-post-fight-reward-popup',
  templateUrl: './post-fight-reward-popup.component.html',
  styleUrls: ['./post-fight-reward-popup.component.scss']
})
export class PostFightRewardPopupComponent extends BasicPopup<FightEndsPopup> implements OnInit {

  public totalGoldReward: number = 0;
  public totalExperienceReward: number = 0;

  constructor(
    private readonly players: MwPlayersService,
    private events: EventsService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.data.enemyLosses.forEach(group => {
      this.totalGoldReward += Math.round(group.count * group.type.neutralReward.gold);
      this.totalExperienceReward += Math.round(group.count * group.type.neutralReward.experience);
    });
  }


  public onContinue(popup: FightEndsPopup): void {
    this.close();

    this.players.addExperienceToPlayer(this.players.getCurrentPlayerId(), this.totalExperienceReward);
    const currentPlayer = this.players.getCurrentPlayer();
    const playerResources = currentPlayer.resources;
    playerResources[ResourceType.Gold] += this.totalGoldReward;

    this.events.dispatch(StructCompleted({
      struct: popup.struct,
    }))
  }
}
