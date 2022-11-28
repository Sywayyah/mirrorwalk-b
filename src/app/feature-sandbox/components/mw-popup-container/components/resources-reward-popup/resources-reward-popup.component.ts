import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ResourceRewardModel, ResourcesReward } from 'src/app/core/structures';
import { MwPlayersService, StructRewardPopup } from 'src/app/feature-sandbox/services';

@Component({
  selector: 'mw-resources-reward-popup',
  templateUrl: './resources-reward-popup.component.html',
  styleUrls: ['./resources-reward-popup.component.scss']
})
export class ResourcesRewardPopupComponent implements OnInit {

  @Input() public popup!: StructRewardPopup;
  @Output() public close: EventEmitter<void> = new EventEmitter();

  public resourceGroups!: ResourceRewardModel[][];

  constructor(
    private readonly playersService: MwPlayersService,
  ) { }

  ngOnInit(): void {
    this.resourceGroups = (this.popup.struct.reward as ResourcesReward).resourceGroups;
  }

  public setCurrentReward(popup: StructRewardPopup, rewardGroup: ResourceRewardModel[]): void {
    popup.selectedRewardGroup = rewardGroup;
  }

  public confirmResources(popup: StructRewardPopup): void {
    this.close.emit();

    if (popup.selectedRewardGroup) {
      popup.selectedRewardGroup.forEach(selectedReward => {
        this.playersService.getCurrentPlayer().resources[selectedReward.type] += selectedReward.count;
      })
    }
  }
}
