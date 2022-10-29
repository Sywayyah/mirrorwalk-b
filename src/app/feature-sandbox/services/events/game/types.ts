import { StructureModel, NeutralCampStructure, UnitGroupInstModel, PlayerInstanceModel } from "src/app/core/model";
import { PopupModel } from "../../types";

export type StructSelectedEvent = { struct: StructureModel };
export type NeutralStructParams = { struct: NeutralCampStructure };
export type DisplayPopupEvent = { popup: PopupModel };
export type FightStartsEvent = { unitGroups: UnitGroupInstModel[], players: PlayerInstanceModel[] };