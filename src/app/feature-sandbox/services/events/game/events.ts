import { eventsForPrefix } from "../../store";
import { DisplayPopupEvent, FightStartsEvent, NeutralStructParams, StructSelectedEvent } from "./types";

const gameEvent = eventsForPrefix('[Game]');

export const StructSelected = gameEvent<StructSelectedEvent>();

export const PlayerStartsFight = gameEvent<FightStartsEvent>();

export const FightStarts = gameEvent();

export const StructCompleted = gameEvent<NeutralStructParams>();

export const DisplayReward = gameEvent<NeutralStructParams>();

export const StructFightConfirmed = gameEvent<NeutralStructParams>();

export const DisplayPopup = gameEvent<DisplayPopupEvent>();

export const PlayerGainsLevel = gameEvent();
