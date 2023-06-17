import { MapStructure, ResourceRewardModel } from 'src/app/core/structures';
import { UnitBaseType } from 'src/app/core/unit-types';

export interface LossModel {
  type: UnitBaseType;
  count: number;
};

export interface FightEndsPopup {
  isWin: boolean;
  playerLosses: LossModel[];
  enemyLosses: LossModel[];
  struct: MapStructure;
}

export interface StructRewardPopup {
  struct: MapStructure;
  selectedRewardGroup?: ResourceRewardModel[];
}

export interface StructPopupData {
  struct: MapStructure;
}
