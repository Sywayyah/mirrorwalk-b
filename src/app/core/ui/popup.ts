import { NeutralCampStructure, NeutralSite, ResourceRewardModel } from 'src/app/core/structures';
import { UnitBase } from 'src/app/core/unit-types';

export interface LossModel {
  type: UnitBase;
  count: number;
};

export interface FightEndsPopup {
  isWin: boolean;
  playerLosses: LossModel[];
  enemyLosses: LossModel[];
  struct: NeutralCampStructure;
}

export interface StructRewardPopup {
  struct: NeutralCampStructure;
  selectedRewardGroup?: ResourceRewardModel[];
}

/* some of these can be united */
export interface StructHireRewardPopup {
  struct: NeutralCampStructure;
}

export interface StructItemRewardPopup {
  struct: NeutralCampStructure;
}

export interface PrefightPopup {
  struct: NeutralCampStructure;
}

export interface PreviewPopup {
  struct: NeutralSite;
}

export interface UpgradingPopup {
  struct: NeutralSite;
}

export interface ScriptedRewardPopup {
  struct: NeutralCampStructure;
}
