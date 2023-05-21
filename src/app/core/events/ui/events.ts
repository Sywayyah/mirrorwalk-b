import { createEventType } from 'src/app/store';
import { props } from '../common';
import { PlayerClicksEnemyGroupEvent, PlayerHoversCardEvent } from './types';

const uiEvent = createEventType;

export const PlayerClicksEnemyGroup = uiEvent<PlayerClicksEnemyGroupEvent>();

export const PlayerClicksAllyGroup = uiEvent<props<'unitGroup'>>();

export const PlayerHoversGroupCard = uiEvent<PlayerHoversCardEvent>();
