import { eventsForPrefix } from 'src/app/store';
import { DefaultGameModes } from './types';

const createCustomEvent = eventsForPrefix('[Custom]');

export const PrepareGameEvent = createCustomEvent<{ gameMode: DefaultGameModes }>(
  'Player started new game, waiting for GamePreparationFinished event to prepare the map.',
);

export const GamePreparationFinished = createCustomEvent<{}>(
  'Map is prepared, player can start the game',
);
