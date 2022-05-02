import { Injectable } from '@angular/core';
import { PLAYER_COLORS } from 'src/app/core/dictionaries/colors.const';
import { NEUTRAL_FRACTION_UNIT_TYPES, NEUTRAL_TYPES_ENUM } from 'src/app/core/dictionaries/neutral-unit-types.dictionary';
import { HF_TYPES_ENUM, HUMANS_FRACTION_UNIT_TYPES } from 'src/app/core/dictionaries/unit-types.dictionary';
import { PlayerInstanceModel, PlayerModel, PlayerTypeEnum, UnitGroupInstModel, UnitGroupModel } from 'src/app/core/model/main.model';
import { RandomUtils } from 'src/app/core/utils/common.utils';


const mainPlayerGroups = RandomUtils.createRandomArmy({
  fraction: HUMANS_FRACTION_UNIT_TYPES,
  maxUnitGroups: 5,
  minUnitGroups: 3,
  units: [
    [HF_TYPES_ENUM.Pikemans, 10, 60, 3],
    [HF_TYPES_ENUM.Archers, 14, 36, 2],
    [HF_TYPES_ENUM.Knights, 8, 17, 2],
    [HF_TYPES_ENUM.Cavalry, 3, 7, 2],
  ],
});

const neutralGroups = RandomUtils.createRandomArmy({
  fraction: NEUTRAL_FRACTION_UNIT_TYPES,
  maxUnitGroups: 5,
  minUnitGroups: 2,
  units: [
    [NEUTRAL_TYPES_ENUM.Gnolls, 10, 40, 3],
    // [NEUTRAL_TYPES_ENUM.Gnolls, 10, 15, 3],
    [NEUTRAL_TYPES_ENUM.ForestTrolls, 10, 25, 2],
    [NEUTRAL_TYPES_ENUM.Thiefs, 12, 37, 2],
    [NEUTRAL_TYPES_ENUM.Ghosts, 24, 42, 3],
  ],
});

export enum PLAYER_IDS {
  Main = 'main',
  Neutral = 'neutral',
}

@Injectable({
  providedIn: 'root'
})
export class MwPlayersService {
  public players: Map<string, PlayerInstanceModel> = new Map([
    this.createPlayerEntry(PLAYER_IDS.Main, {
      color: PLAYER_COLORS.BLUE,
      resources: {
        gems: 0,
        wood: 0,
        gold: 12000,
        redCrystals: 2,
      },
      type: PlayerTypeEnum.Player,
      hero: {},
      unitGroups: mainPlayerGroups,
    }),
    this.createPlayerEntry(PLAYER_IDS.Neutral, {
      color: PLAYER_COLORS.GRAY,
      type: PlayerTypeEnum.AI,
      hero: {},
      unitGroups: neutralGroups,
    }),
  ]);

  private currentPlayerId: string = PLAYER_IDS.Main;

  constructor() { }

  public getCurrentPlayer(): PlayerInstanceModel {
    return this.players.get(this.currentPlayerId) as PlayerInstanceModel;
  }

  public getCurrentPlayerId(): string {
    return this.currentPlayerId;
  }

  public getEnemyPlayer(): PlayerInstanceModel {
    return this.players.get(PLAYER_IDS.Neutral) as PlayerInstanceModel;
  }

  public getUnitGroupsOfPlayer(playerId: string): UnitGroupInstModel[] {
    const player = this.players.get(playerId) as PlayerInstanceModel;
    return player.unitGroups.map((unitGroup: UnitGroupModel) => {
      unitGroup.ownerPlayerRef = player;
      return unitGroup as UnitGroupInstModel;
    })
  }

  private createPlayer(id: string, playerInfo: PlayerModel): PlayerInstanceModel {
    const player: PlayerInstanceModel = {
      id,
      ...playerInfo,
    }

    return player;
  }

  private createPlayerEntry(id: string, playerInfo: PlayerModel): [string, PlayerInstanceModel] {
    return [id, this.createPlayer(id, playerInfo)];
  }
}
