import { createEventsGroup } from 'src/app/store';
import * as GameCommands from './commands';
import * as GameEvents from './events';

const gameEvents = createEventsGroup({
  events: GameEvents,
  prefix: 'GameEvents'
});

const gameCommands = createEventsGroup({
  events: GameCommands,
  prefix: 'GameCommands',
});

export const Game = { ...gameEvents.events, ...gameCommands.events };
