import { Injectable } from '@angular/core';
import { PlayerInstanceModel, UnitGroupInstModel } from 'src/app/core/model/main.model';
import { MwPlayersService, PLAYER_IDS } from './mw-players.service';

@Injectable({
  providedIn: 'root'
})
export class MwNeutralPlayerService {

  private neutralPlayer: PlayerInstanceModel = this.playersService.getEnemyPlayer();
  
  constructor(private readonly playersService: MwPlayersService) { }

  public getPlayerInfo(): PlayerInstanceModel {
    return this.neutralPlayer;
  }
  
  public getUnitGroups(): UnitGroupInstModel[] {
    return this.playersService.getUnitGroupsOfPlayer(PLAYER_IDS.Neutral);
  }
}
