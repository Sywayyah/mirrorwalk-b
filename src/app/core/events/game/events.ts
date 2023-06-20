import { PopupData } from 'src/app/features/shared/components';
import { createEventType } from 'src/app/store';
import { FightStartsEvent, NeutralStructParams, NewDayParams, PlayerEquipsItemAction, PlayerLevelsUpEvent, PlayerUnequipsItemAction, StructSelectedEvent } from "./types";

const gameEvent = createEventType;

export const GameStarted = gameEvent();

export const GameCreated = gameEvent();

export const PlayersInitialized = gameEvent();

export const PlayerEntersTown = gameEvent();

export const PlayerLeavesTown = gameEvent();

export const PlayerOpensHeroInfo = gameEvent();

export const StructSelected = gameEvent<StructSelectedEvent>();

export const PlayerStartsFight = gameEvent<FightStartsEvent>();

export const FightStarts = gameEvent();

export const StructCompleted = gameEvent<NeutralStructParams>();

export const ShowGameOverPopup = gameEvent();

export const NewDayStarted = gameEvent<NewDayParams>();

export const DisplayReward = gameEvent<NeutralStructParams>();

export const StructFightConfirmed = gameEvent<NeutralStructParams>();

export const DisplayPopup = gameEvent<PopupData>();

export const PlayerReceivesItem = gameEvent<PlayerEquipsItemAction>();

export const PlayerEquipsItem = gameEvent<PlayerEquipsItemAction>();

export const PlayerUnequipsItem = gameEvent<PlayerUnequipsItemAction>();

export const PlayerLevelsUp = gameEvent<PlayerLevelsUpEvent>();
