import { Injectable } from '@angular/core';
import { PLAYER_COLORS } from 'src/app/core/dictionaries/colors.const';
import { ItemDoomstring, ItemModel } from 'src/app/core/dictionaries/items.dictionary';
import {
  HF_TYPES_ENUM,
  HUMANS_FRACTION_UNIT_TYPES,
} from 'src/app/core/dictionaries/unit-types.dictionary';
import { PlayerModel, PlayerTypeEnum, UnitGroupModel } from 'src/app/core/model/main.model';
import { RandomUtils } from 'src/app/core/utils/common.utils';

@Injectable({
  providedIn: 'root',
})
export class MwPlayerStateService {

  public items: ItemModel[] = [
    ItemDoomstring,
  ];
  
  private unitGroups: UnitGroupModel[] = RandomUtils.createRandomArmy({
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

  private mainPlayer: PlayerModel = {
    color: PLAYER_COLORS.BLUE,
    resources: {
      gems: 0,
      gold: 12000,
      redCrystals: 2,
    },
    type: PlayerTypeEnum.Player,
    hero: {},
    unitGroups: this.unitGroups,
  };

  constructor() {}

  public getPlayerInfo(): PlayerModel {
    return this.mainPlayer;
  }

  public getUnitGroups(): UnitGroupModel[] {
    this.unitGroups.forEach(
      (unitGroup) => (unitGroup.ownerPlayerRef = this.mainPlayer)
    );
    return this.unitGroups;
  }
}
