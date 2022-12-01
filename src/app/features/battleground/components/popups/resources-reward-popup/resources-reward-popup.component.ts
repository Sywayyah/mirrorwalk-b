import { Component, OnInit } from '@angular/core';
import { ResourceRewardModel, ResourcesReward } from 'src/app/core/structures';
import { StructRewardPopup } from 'src/app/core/ui';
import { MwPlayersService } from 'src/app/features/services';
import { BasicPopup } from 'src/app/features/shared/components';

@Component({
  selector: 'mw-resources-reward-popup',
  templateUrl: './resources-reward-popup.component.html',
  styleUrls: ['./resources-reward-popup.component.scss']
})
export class ResourcesRewardPopupComponent extends BasicPopup<StructRewardPopup> implements OnInit {

  public resourceGroups!: ResourceRewardModel[][];

  constructor(
    private readonly playersService: MwPlayersService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.resourceGroups = (this.data.struct.reward as ResourcesReward).resourceGroups;
  }

  public setCurrentReward(popup: StructRewardPopup, rewardGroup: ResourceRewardModel[]): void {
    popup.selectedRewardGroup = rewardGroup;
  }

  public confirmResources(popup: StructRewardPopup): void {
    this.close();

    if (popup.selectedRewardGroup) {
      popup.selectedRewardGroup.forEach(selectedReward => {
        this.playersService.getCurrentPlayer().resources[selectedReward.type] += selectedReward.count;
      })
    }
  }
}
