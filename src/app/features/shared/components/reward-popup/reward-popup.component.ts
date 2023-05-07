import { Component } from '@angular/core';
import { DisplayPlayerRewardAction, RewardModel } from 'src/app/core/events';
import { BasicPopup } from '../popup-container';

@Component({
  selector: 'mw-reward-popup',
  templateUrl: './reward-popup.component.html',
  styleUrls: ['./reward-popup.component.scss']
})
export class RewardPopupComponent extends BasicPopup<DisplayPlayerRewardAction> {

  public activeReward!: RewardModel;

  public setActiveReward(reward: RewardModel) {
    this.activeReward = reward;
  }

  public acceptReward() {
    this.activeReward.onSumbit();
    this.close();
  }
}
