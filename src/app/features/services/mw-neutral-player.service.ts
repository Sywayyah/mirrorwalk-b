import { Injectable } from '@angular/core';
import { Player } from 'src/app/core/players';
import { UnitGroup } from 'src/app/core/unit-types';
import { MwPlayersService, PLAYER_IDS } from './mw-players.service';

@Injectable({
  providedIn: 'root'
})
export class MwNeutralPlayerService {
  constructor(private readonly playersService: MwPlayersService) { }

  public getPlayerInfo(): Player {
    return this.playersService.getEnemyPlayer();
  }

  public getUnitGroups(): UnitGroup[] {
    return this.playersService.getUnitGroupsOfPlayer(PLAYER_IDS.Neutral);
  }
}
