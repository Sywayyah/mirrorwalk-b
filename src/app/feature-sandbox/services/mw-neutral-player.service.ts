import { Injectable } from '@angular/core';
import { NEUTRAL_FRACTION_UNIT_TYPES, NEUTRAL_TYPES_ENUM } from 'src/app/core/dictionaries/neutral-unit-types.dictionary';
import { HF_TYPES_ENUM, HUMANS_FRACTION_UNIT_TYPES } from 'src/app/core/dictionaries/unit-types.dictionary';
import { PlayerModel, PlayerTypeEnum, UnitGroupModel } from 'src/app/core/model/main.model';

@Injectable({
  providedIn: 'root'
})
export class MwNeutralPlayerService {

  private neutralPlayer: PlayerModel = {
    color: 'rgb(182, 182, 182)',
    type: PlayerTypeEnum.AI,
  };
  private unitGroups: UnitGroupModel[] = [
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
  ];

  constructor() { }

  public getPlayerInfo(): PlayerModel {
    return this.neutralPlayer;
  }
  
  public getUnitGroups(): UnitGroupModel[] {
    this.unitGroups.forEach(unitGroup => unitGroup.ownerPlayerRef = this.neutralPlayer);
    return this.unitGroups;
  }
}
