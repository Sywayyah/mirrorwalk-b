import { Injectable } from '@angular/core';
import { HF_TYPES_ENUM, HUMANS_FRACTION_UNIT_TYPES } from 'src/app/core/dictionaries/unit-types.dictionary';
import { PlayerModel, UnitGroupModel } from 'src/app/core/model/main.model';

@Injectable({
  providedIn: 'root'
})
export class MwNeutralPlayerService {

  private neutralPlayer: PlayerModel = {
    color: 'rgb(182, 182, 182)',
  };
  private unitGroups: UnitGroupModel[] = [
    {
      count: 15,
      type: HUMANS_FRACTION_UNIT_TYPES[HF_TYPES_ENUM.Pikemans],
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
