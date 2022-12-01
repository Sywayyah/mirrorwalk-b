import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ItemInstanceModel } from 'src/app/core/items';
import { ItemReward } from 'src/app/core/structures';
import { StructItemRewardPopup } from 'src/app/core/ui';
import { MwItemsService, MwPlayersService } from 'src/app/features/services';

@Component({
  selector: 'mw-item-reward-popup',
  templateUrl: './item-reward-popup.component.html',
  styleUrls: ['./item-reward-popup.component.scss']
})
export class ItemRewardPopupComponent implements OnInit {

  @Input() public popup!: StructItemRewardPopup;
  @Output() public close: EventEmitter<void> = new EventEmitter<void>();


  public itemGroups!: ItemInstanceModel[][];

  public selectedGroup!: ItemInstanceModel[];

  constructor(
    private itemsService: MwItemsService,
    private playersService: MwPlayersService,
  ) { }

  public ngOnInit(): void {
    const rewardItemsGroups = this.popup.struct.reward as ItemReward;
    this.itemGroups = rewardItemsGroups.itemGroups.map(itemGroup => {
      return itemGroup.map(item => {
        return this.itemsService.createItem(item);
      });
    });
  }

  public setSelectedGroup(group: ItemInstanceModel[]): void {
    this.selectedGroup = group;
  }

  public onSubmit(): void {
    this.selectedGroup.forEach(item => {
      this.playersService.addItemToPlayer(this.playersService.getCurrentPlayer(), item);
    });

    this.close.emit();
  }

}
