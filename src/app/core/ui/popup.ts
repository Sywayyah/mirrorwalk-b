import { ResourceRewardModel, StructureModel } from 'src/app/core/structures';
import { UnitBaseType } from 'src/app/core/unit-types';

export interface LossModel {
  type: UnitBaseType;
  count: number;
};

export interface FightEndsPopup {
  isWin: boolean;
  playerLosses: LossModel[];
  enemyLosses: LossModel[];
  struct: StructureModel;
}

export interface StructRewardPopup {
  struct: StructureModel;
  selectedRewardGroup?: ResourceRewardModel[];
}

/* some of these can be united */
export interface StructHireRewardPopup {
  struct: StructureModel;
}

export interface StructItemRewardPopup {
  struct: StructureModel;
}

export interface PrefightPopup {
  struct: StructureModel;
}

export interface PreviewPopup {
  struct: StructureModel;
}

export interface UpgradingPopup {
  struct: StructureModel;
}

export interface ScriptedRewardPopup {
  struct: StructureModel;
}
