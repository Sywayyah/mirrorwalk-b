import { PopupData } from 'src/app/features/shared/components';
import { createEventType } from 'src/app/store';
import { Hero, UnitGroupSlot } from '../../heroes';
import { UnitGroup } from '../../unit-types';
import { FightStartsEvent, NeutralStructParams, NewDayParams, NewWeekParams, PlayerEquipsItemAction, PlayerLevelsUpEvent, PlayerUnequipsItemAction, StructSelectedEvent } from "./types";

const gameEvent = createEventType;

export const GameStarted = gameEvent();

export const GameCreated = gameEvent();

export const PlayersInitialized = gameEvent();

export const PlayerEntersTown = gameEvent();

export const PlayerLeavesTown = gameEvent();

export const PlayerOpensHeroInfo = gameEvent();

export const OpenActiviesAndSpecialtiesDialog = gameEvent();

// can be command
export const OpenSplitUnitGroupPopup = gameEvent<{ unitGroup: UnitGroup }>();

export const OpenUnitSlotsActionPopup = gameEvent<{ sourceSlot: UnitGroupSlot, targetSlot: UnitGroupSlot, postAction: () => void }>();

export const PlayerOpensActionCards = gameEvent();

export const StructSelected = gameEvent<StructSelectedEvent>();

export const PlayerStartsFight = gameEvent<FightStartsEvent>();

export const BeforeBattleInit = gameEvent();

export const FightStarts = gameEvent();

export const StructCompleted = gameEvent<NeutralStructParams>();

export const ShowGameOverPopup = gameEvent();

export const NewDayStarted = gameEvent<NewDayParams>();

export const NewWeekStarted = gameEvent<NewWeekParams>();

export const DisplayReward = gameEvent<NeutralStructParams>();

export const StructFightConfirmed = gameEvent<NeutralStructParams>();

export const DisplayPopup = gameEvent<PopupData>();

export const OpenGarrisonPopup = gameEvent();

export const PlayerReceivesItem = gameEvent<PlayerEquipsItemAction>();

export const PlayerLosesItem = gameEvent<PlayerEquipsItemAction>();

export const PlayerEquipsItem = gameEvent<PlayerEquipsItemAction>();

export const PlayerUnequipsItem = gameEvent<PlayerUnequipsItemAction>();

export const PlayerLevelsUp = gameEvent<PlayerLevelsUpEvent>();

export const UnitGroupAddedToHero = gameEvent<{ hero: Hero, unitGroup: UnitGroup }>();

export const UnitGroupRemovedFromHero = gameEvent<{ hero: Hero, unitGroup: UnitGroup }>();

export const ScheduleAction = gameEvent<{ action: () => void, dayOffset: number }>();
