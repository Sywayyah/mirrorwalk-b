import { Component, OnInit } from '@angular/core';
import { Item } from 'src/app/core/items';
import { ItemReward } from 'src/app/core/structures';
import { StructItemRewardPopup } from 'src/app/core/ui';
import { MwItemsService, MwPlayersService } from 'src/app/features/services';
import { BasicPopup } from 'src/app/features/shared/components';

@Component({
  selector: 'mw-item-reward-popup',
  templateUrl: './item-reward-popup.component.html',
  styleUrls: ['./item-reward-popup.component.scss']
})
export class ItemRewardPopupComponent extends BasicPopup<StructItemRewardPopup> implements OnInit {

  public itemGroups!: Item[][];

  public selectedGroup!: Item[];

  constructor(
    private itemsService: MwItemsService,
    private playersService: MwPlayersService,
  ) {
    super();
  }

  public ngOnInit(): void {
    const rewardItemsGroups = this.data.struct.reward as ItemReward;
    this.itemGroups = rewardItemsGroups.itemGroups.map(itemGroup => {
      return itemGroup.map(item => {
        return this.itemsService.createItem(item);
      });
    });
  }

  public setSelectedGroup(group: Item[]): void {
    this.selectedGroup = group;
  }

  public onSubmit(): void {
    this.selectedGroup.forEach(item => {
      this.playersService.addItemToPlayer(this.playersService.getCurrentPlayer(), item);
    });

    this.close();
  }

}
