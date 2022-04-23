import { Injectable } from '@angular/core';
import { ItemDoomstring, ItemModel } from 'src/app/core/dictionaries/items.dictionary';
import { PlayerModel, UnitGroupModel } from 'src/app/core/model/main.model';
import { MwPlayersService, PLAYER_IDS } from './mw-players.service';

@Injectable({
  providedIn: 'root',
})
export class MwPlayerStateService {

  public items: ItemModel[] = [
    ItemDoomstring,
  ];

  private mainPlayer: PlayerModel = this.playersService.getCurrentPlayer();

  constructor(
    private playersService: MwPlayersService,
  ) { }

  public getPlayerInfo(): PlayerModel {
    return this.mainPlayer;
  }

  public getUnitGroups(): UnitGroupModel[] {
    return this.playersService.getUnitGroupsOfPlayer(PLAYER_IDS.Main);
  }
}
