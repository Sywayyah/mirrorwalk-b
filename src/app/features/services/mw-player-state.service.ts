import { Injectable } from '@angular/core';
import { PlayerInstanceModel } from 'src/app/core/players';
import { UnitGroupInstModel } from 'src/app/core/unit-types';
import { MwPlayersService, PLAYER_IDS } from './mw-players.service';

@Injectable({
  providedIn: 'root',
})
export class MwPlayerStateService {
  constructor(
    private playersService: MwPlayersService,
  ) { }

  public getPlayerInfo(): PlayerInstanceModel {
    return this.playersService.getCurrentPlayer();
  }

  public getUnitGroups(): UnitGroupInstModel[] {
    return this.playersService.getUnitGroupsOfPlayer(PLAYER_IDS.Main);
  }
}
