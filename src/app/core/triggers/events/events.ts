import { eventsForPrefix } from 'src/app/store';
import { DefaultGameModes } from '../types';
import { GamePreparedEvent } from './types';

const createTriggerEvent = eventsForPrefix('[Triggers]');

export const PrepareGameEvent = createTriggerEvent<{ gameMode: DefaultGameModes }>(
  'Player started new game, waiting for GamePreparationFinished event to prepare the map.',
);

export const GamePreparationFinished = createTriggerEvent<GamePreparedEvent>(
  'Map is prepared, player can start the game',
);
