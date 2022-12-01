import { PopupData } from 'src/app/features/shared/components';
import { eventsForPrefix } from 'src/app/store';
import { FightStartsEvent, InitItemAction, InitSpellAction, NeutralStructParams, PlayerEquipsItemAction, PlayerUnequipsItemAction, StructSelectedEvent } from "./types";

const gameEvent = eventsForPrefix('[Game]');

export const StructSelected = gameEvent<StructSelectedEvent>();

export const PlayerStartsFight = gameEvent<FightStartsEvent>();

export const FightStarts = gameEvent();

export const StructCompleted = gameEvent<NeutralStructParams>();

export const DisplayReward = gameEvent<NeutralStructParams>();

export const StructFightConfirmed = gameEvent<NeutralStructParams>();

export const DisplayPopup = gameEvent<PopupData>();

export const PlayerGainsLevel = gameEvent();

export const InitSpell = gameEvent<InitSpellAction>();

export const InitItem = gameEvent<InitItemAction>();

export const PlayerEquipsItem = gameEvent<PlayerEquipsItemAction>();

export const PlayerUnequipsItem = gameEvent<PlayerUnequipsItemAction>();
