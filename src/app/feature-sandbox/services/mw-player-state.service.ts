import { Injectable } from '@angular/core';
import {
  HF_TYPES_ENUM,
  HUMANS_FRACTION_UNIT_TYPES,
} from 'src/app/core/dictionaries/unit-types.dictionary';
import { PlayerModel, UnitGroupModel } from 'src/app/core/model/main.model';

@Injectable({
  providedIn: 'root',
})
export class MwPlayerStateService {
  private mainPlayer: PlayerModel = {
    color: 'rgb(255, 138, 138)',
  };

  private unitGroups: UnitGroupModel[] = [
    {
      count: 5,
      type: HUMANS_FRACTION_UNIT_TYPES[HF_TYPES_ENUM.Pikemans],
    },
    {
      count: 7,
      type: HUMANS_FRACTION_UNIT_TYPES[HF_TYPES_ENUM.Archers],
    },
  ];

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
