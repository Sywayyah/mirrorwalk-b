import { eventsForPrefix } from "../state/events";
import { PlayerHoversCardEvent, props } from "./";


const uiEvent = eventsForPrefix('[UI]');

export type PlayerClicksEnemyGroupEvent = props<'attackedGroup' | 'attackingGroup' | 'attackingPlayer'>;

export const PlayerClicksEnemyGroup = uiEvent<PlayerClicksEnemyGroupEvent>();

export type PlayerClicksAllyGroupEvent = props<'unitGroup'>;

export const PlayerClicksAllyGroup = uiEvent<props<'unitGroup'>>();

export const PlayerHoversGroupCard = uiEvent<PlayerHoversCardEvent>();
