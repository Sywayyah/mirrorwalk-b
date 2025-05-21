import { Component, inject, OnInit } from '@angular/core';
import { ShowGameOverPopup, StructCompleted } from 'src/app/core/events';
import { ResourceType } from 'src/app/core/resources';
import { FightEndsPopup } from 'src/app/core/ui';
import { CommonUtils } from 'src/app/core/utils';
import { MwPlayersService } from 'src/app/features/services';
import { BasicPopup } from 'src/app/features/shared/components';
import { EventsService } from 'src/app/store';

@Component({
  selector: 'mw-post-fight-reward-popup',
  templateUrl: './post-fight-reward-popup.component.html',
  styleUrls: ['./post-fight-reward-popup.component.scss'],
  standalone: false
})
export class PostFightRewardPopupComponent extends BasicPopup<FightEndsPopup> implements OnInit {
  private readonly players = inject(MwPlayersService);
  private events = inject(EventsService);

  public totalGoldReward: number = 0;
  public totalExperienceReward: number = 0;

  public readonly experienceGainBonus = this.players.getCurrentPlayer().hero.modGroup.getCalcNumModValueOrZero('experienceGainBonus');

  ngOnInit(): void {
    this.data.enemyLosses.forEach(group => {
      // maybe this can be a good thing.
      // this.totalGoldReward += Math.round(group.count * group.type.neutralReward.gold);
      this.totalExperienceReward += CommonUtils.increaseByPercent(Math.round(group.count * group.type.neutralReward.experience), this.experienceGainBonus);
    });
  }


  public onContinue(popup: FightEndsPopup): void {
    if (!popup.isWin) {
      this.close();

      this.events.dispatch(ShowGameOverPopup());

      return;
    }

    this.close();

    /* Add defeat scenario, show defeat popup, return to main screen. */
    this.players.addExperienceToPlayersHero(this.players.getCurrentPlayerId(), this.totalExperienceReward);
    const currentPlayer = this.players.getCurrentPlayer();
    const playerResources = currentPlayer.resources;
    playerResources[ResourceType.Gold] += this.totalGoldReward;

    this.events.dispatch(StructCompleted({
      struct: popup.struct,
    }));
  }
}
