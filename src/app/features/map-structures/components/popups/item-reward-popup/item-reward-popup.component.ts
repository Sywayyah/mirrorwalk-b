import { Component, inject, OnInit } from '@angular/core';
import { Item } from 'src/app/core/items';
import { ItemReward } from 'src/app/core/structures';
import { StructPopupData } from 'src/app/core/ui';
import { MwItemsService, MwPlayersService } from 'src/app/features/services';
import { BasicPopup } from 'src/app/features/shared/components';

@Component({
  selector: 'mw-item-reward-popup',
  templateUrl: './item-reward-popup.component.html',
  styleUrls: ['./item-reward-popup.component.scss'],
  standalone: false,
})
export class ItemRewardPopupComponent extends BasicPopup<StructPopupData> implements OnInit {
  private readonly itemsService = inject(MwItemsService);
  private readonly playersService = inject(MwPlayersService);

  public itemGroups!: Item[][];

  public selectedGroup!: Item[];

  public ngOnInit(): void {
    const rewardItemsGroups = this.data.struct.reward as ItemReward;
    this.itemGroups = rewardItemsGroups.itemGroups.map((itemGroup) => {
      return itemGroup.map((item) => {
        return this.itemsService.createItem(item);
      });
    });
  }

  public setSelectedGroup(group: Item[]): void {
    this.selectedGroup = group;
  }

  public onSubmit(): void {
    this.selectedGroup.forEach((item) => {
      this.playersService.addItemToPlayer(this.playersService.getCurrentPlayer(), item);
    });

    this.close();
  }
}
