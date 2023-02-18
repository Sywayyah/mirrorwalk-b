import { Component, OnInit } from '@angular/core';
import { InventoryItems, ItemInstanceModel } from 'src/app/core/items';
import { PlayerInstanceModel } from 'src/app/core/players';
import { MwPlayersService } from 'src/app/features/services';

@Component({
  selector: 'mw-items-panel',
  templateUrl: './mw-items-panel.component.html',
  styleUrls: ['./mw-items-panel.component.scss']
})
export class MwItemsPanelComponent implements OnInit {

  public currentPlayer!: PlayerInstanceModel;
  public equippedItems!: ItemInstanceModel[];

  constructor(
    private readonly players: MwPlayersService,
  ) { }

  ngOnInit(): void {
    this.currentPlayer = this.players.getCurrentPlayer();
    this.equippedItems = this.currentPlayer.hero.inventory.getEquippedItems();
  }

}
