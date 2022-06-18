import { Injectable } from '@angular/core';
import { PlayerInstanceModel, UnitGroupInstModel } from 'src/app/core/model/main.model';
import { MwPlayersService, PLAYER_IDS } from './mw-players.service';

@Injectable({
  providedIn: 'root',
})
export class MwPlayerStateService {
  private mainPlayer: PlayerInstanceModel = this.playersService.getCurrentPlayer();

  constructor(
    private playersService: MwPlayersService,
  ) {}

  public getPlayerInfo(): PlayerInstanceModel {
    return this.mainPlayer;
  }

  public getUnitGroups(): UnitGroupInstModel[] {
    return this.playersService.getUnitGroupsOfPlayer(PLAYER_IDS.Main);
  }
}
