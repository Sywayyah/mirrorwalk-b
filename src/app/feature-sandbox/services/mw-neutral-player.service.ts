import { Injectable } from '@angular/core';
import { NEUTRAL_FRACTION_UNIT_TYPES, NEUTRAL_TYPES_ENUM } from 'src/app/core/dictionaries/neutral-unit-types.dictionary';
import { HF_TYPES_ENUM, HUMANS_FRACTION_UNIT_TYPES } from 'src/app/core/dictionaries/unit-types.dictionary';
import { PlayerModel, PlayerTypeEnum, UnitGroupModel } from 'src/app/core/model/main.model';
import { RandomUtils } from 'src/app/core/utils/common.utils';

@Injectable({
  providedIn: 'root'
})
export class MwNeutralPlayerService {

  private neutralPlayer: PlayerModel = {
    color: 'rgb(182, 182, 182)',
    type: PlayerTypeEnum.AI,
  };

  private unitGroups: UnitGroupModel[] = RandomUtils.createRandomArmy({
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
  /* private unitGroups: UnitGroupModel[] = [
    {
      count: 21,
      type: NEUTRAL_FRACTION_UNIT_TYPES[NEUTRAL_TYPES_ENUM.Gnolls],
    },
    {
      count: 21,
      type: NEUTRAL_FRACTION_UNIT_TYPES[NEUTRAL_TYPES_ENUM.Gnolls],
    },
    {
      count: 7,
      type: NEUTRAL_FRACTION_UNIT_TYPES[NEUTRAL_TYPES_ENUM.Thiefs],
    },
    {
      count: 13,
      type: NEUTRAL_FRACTION_UNIT_TYPES[NEUTRAL_TYPES_ENUM.ForestTrolls],
    }
  ]; */

  constructor() { }

  public getPlayerInfo(): PlayerModel {
    return this.neutralPlayer;
  }
  
  public getUnitGroups(): UnitGroupModel[] {
    this.unitGroups.forEach(unitGroup => unitGroup.ownerPlayerRef = this.neutralPlayer);
    return this.unitGroups;
  }
}
