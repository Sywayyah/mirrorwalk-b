import { createEventsGroup, eventsForPrefix } from 'src/app/store';
import { DefaultGameModes, GamePreparedEvent } from './types';

const createTriggerEvent = eventsForPrefix('[Triggers]');

export const TriggersEventGroup = createEventsGroup({
  prefix: 'Triggers',
  events: {
    PrepareGameEvent: createTriggerEvent<{ gameMode: DefaultGameModes }>(
      'Player started new game, waiting for GamePreparationFinished event to prepare the map.',
    ),
    GamePreparationFinished: createTriggerEvent<GamePreparedEvent>(
      'Map is prepared, player can start the game',
    ),
  },
});

export const Triggers = TriggersEventGroup.events;

/*
export const PrepareGameEvent = createTriggerEvent<{ gameMode: DefaultGameModes }>(
  'Player started new game, waiting for GamePreparationFinished event to prepare the map.',
);

export const GamePreparationFinished = createTriggerEvent<GamePreparedEvent>(
  'Map is prepared, player can start the game',
);
 */
