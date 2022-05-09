import { UnitTypeModel } from "src/app/core/model/main.model";
import { NeutralCampStructure, ResourceRewardModel } from "src/app/core/model/structures.types";

export interface LossModel {
  type: UnitTypeModel;
  count: number;
};

export enum PopupTypesEnum {
  FightEnds,
  StructResourcesReward,
  HiringReward,
}

export interface PopupModel<T extends PopupTypesEnum = PopupTypesEnum> {
  type: T;
}

export interface FightEndsPopup extends PopupModel<PopupTypesEnum.FightEnds> {
  isWin: boolean;
  playerLosses: LossModel[];
  enemyLosses: LossModel[];
  struct: NeutralCampStructure;
}

export interface StructRewardPopup extends PopupModel<PopupTypesEnum.StructResourcesReward> {
  struct: NeutralCampStructure;
  selectedRewardGroup?: ResourceRewardModel[];
}

export interface StructHireRewardPopup extends PopupModel<PopupTypesEnum.HiringReward> {
  struct: NeutralCampStructure;
}