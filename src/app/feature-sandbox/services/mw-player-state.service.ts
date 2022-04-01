import { Injectable } from '@angular/core';
import { ItemDoomstring, ItemModel } from 'src/app/core/dictionaries/items.dictionary';
import {
  HF_TYPES_ENUM,
  HUMANS_FRACTION_UNIT_TYPES,
} from 'src/app/core/dictionaries/unit-types.dictionary';
import { PlayerModel, PlayerTypeEnum, UnitGroupModel } from 'src/app/core/model/main.model';

@Injectable({
  providedIn: 'root',
})
export class MwPlayerStateService {

  public items: ItemModel[] = [
    ItemDoomstring,
  ];
  
  private mainPlayer: PlayerModel = {
    color: 'rgb(255, 138, 138)',
    resources: {
      gems: 0,
      gold: 12000,
      redCrystals: 2,
    },
    type: PlayerTypeEnum.Player,
  };

  private unitGroups: UnitGroupModel[] = [
    {
      count: 35,
      type: HUMANS_FRACTION_UNIT_TYPES[HF_TYPES_ENUM.Pikemans],
    },
    {
      count: 21 ,
      type: HUMANS_FRACTION_UNIT_TYPES[HF_TYPES_ENUM.Archers],
    },
    {
      count: 6,
      type: HUMANS_FRACTION_UNIT_TYPES[HF_TYPES_ENUM.Knights],
    },
    { 
      count: 4,
      type: HUMANS_FRACTION_UNIT_TYPES[HF_TYPES_ENUM.Cavalry],
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
