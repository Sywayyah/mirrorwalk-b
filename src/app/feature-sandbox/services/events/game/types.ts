import { StructureModel, NeutralCampStructure, UnitGroupInstModel, PlayerInstanceModel, SpellInstance, ItemInstanceModel } from "src/app/core/model";
import { PopupModel } from "../../types";

export type StructSelectedEvent = { struct: StructureModel };
export type NeutralStructParams = { struct: NeutralCampStructure };
export type DisplayPopupEvent = { popup: PopupModel };
export type FightStartsEvent = { unitGroups: UnitGroupInstModel[], players: PlayerInstanceModel[] };
export type InitSpellAction = { spell: SpellInstance, player: PlayerInstanceModel, ownerUnit?: UnitGroupInstModel };
export type InitItemAction = { item: ItemInstanceModel, ownerPlayer: PlayerInstanceModel };
