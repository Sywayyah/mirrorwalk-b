import { NeutralCampStructure, PlayerInstanceModel, StructureModel, UnitGroupInstModel } from "src/app/core/model";
import { eventsForPrefix } from "../state/events";
import { PopupModel } from "../types";


const gameEvent = eventsForPrefix('[Game]');

export type StructSelectedEvent = { struct: StructureModel };

export const StructSelected = gameEvent<StructSelectedEvent>();

export type NeutralStructParams = { struct: NeutralCampStructure };

export type FightStartsEvent = { unitGroups: UnitGroupInstModel[], players: PlayerInstanceModel[] };

export const PlayerStartsFight = gameEvent<FightStartsEvent>();

export const FightStarts = gameEvent();

export const StructCompleted = gameEvent<NeutralStructParams>();

export const DisplayReward = gameEvent<NeutralStructParams>();

export const StructFightConfirmed = gameEvent<NeutralStructParams>();

export type DisplayPopupEvent = { popup: PopupModel };

export const DisplayPopup = gameEvent<DisplayPopupEvent>();

export const PlayerGainsLevel = gameEvent();
