import { UnitTypeModel } from "src/app/core/model/main.model";
import { NeutralCampStructure, NeutralSite, ResourceRewardModel } from "src/app/core/model/structures.types";

export interface LossModel {
  type: UnitTypeModel;
  count: number;
};

export enum PopupTypesEnum {
  FightEnds,
  StructResourcesReward,
  HiringReward,
  UpgradingReward,
  ItemReward,
  /* when there is a guard */
  Prefight,
  /* when there is no guard, just text message */
  Preview,
  /* scripted reward */
  ScriptedReward,
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

export interface StructItemRewardPopup extends PopupModel<PopupTypesEnum.ItemReward> {
  struct: NeutralCampStructure;
}

export interface PrefightPopup extends PopupModel<PopupTypesEnum.Prefight> {
  struct: NeutralCampStructure;
}

export interface PreviewPopup extends PopupModel<PopupTypesEnum.Preview> {
  struct: NeutralSite;
}

export interface UpgradingPopup extends PopupModel<PopupTypesEnum.UpgradingReward> {
  struct: NeutralSite;
}

export interface ScriptedRewardPopup extends PopupModel<PopupTypesEnum.ScriptedReward> {
  struct: NeutralCampStructure;
}
