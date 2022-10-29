import { UnitGroupInstModel } from "src/app/core/model/main.model";
import { eventsForPrefix } from "../state/events";
import { HoverTypeEnum } from "../types";
import { props } from "./battle.types";
import { PlayerHoversCardEvent } from "./ui.types";


const uiEvent = eventsForPrefix('[UI]');

export type PlayerClicksEnemyGroupEvent = props<'attackedGroup' | 'attackingGroup' | 'attackingPlayer'>;

export const PlayerClicksEnemyGroup = uiEvent<PlayerClicksEnemyGroupEvent>();

export type PlayerClicksAllyGroupEvent = props<'unitGroup'>;

export const PlayerClicksAllyGroup = uiEvent<props<'unitGroup'>>();

export const PlayerHoversGroupCard = uiEvent<PlayerHoversCardEvent>();
