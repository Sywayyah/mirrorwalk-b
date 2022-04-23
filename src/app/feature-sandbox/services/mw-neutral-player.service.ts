import { Injectable } from '@angular/core';
import { PlayerModel, UnitGroupModel } from 'src/app/core/model/main.model';
import { MwPlayersService, PLAYER_IDS } from './mw-players.service';

@Injectable({
  providedIn: 'root'
})
export class MwNeutralPlayerService {

  private neutralPlayer: PlayerModel = this.playersService.getEnemyPlayer();
  
  constructor(private readonly playersService: MwPlayersService) { }

  public getPlayerInfo(): PlayerModel {
    return this.neutralPlayer;
  }
  
  public getUnitGroups(): UnitGroupModel[] {
    return this.playersService.getUnitGroupsOfPlayer(PLAYER_IDS.Neutral);
  }
}
