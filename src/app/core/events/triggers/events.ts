import { createEventType } from 'src/app/store';
import { DefaultGameModes, GamePreparedEvent } from './types';

const createTriggerEvent = createEventType;

export const PrepareGameEvent = createTriggerEvent<{ gameMode: DefaultGameModes }>(
  'Player started new game, waiting for GamePreparationFinished event to prepare the map.',
);

export const GamePreparationFinished = createTriggerEvent<GamePreparedEvent>(
  'Map is prepared, player can start the game',
);
