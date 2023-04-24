import { createEventsGroup } from 'src/app/store';
import * as GameEvents from './events';
import * as GameCommands from './commands';

// possible way to dynamically add events to the group
// and to have mixed approaches
const gameEvents = createEventsGroup({
  events: GameEvents,
  prefix: 'GameEvents'
});

const gameCommands = createEventsGroup({
  events: GameCommands,
  prefix: 'GameCommands',
});

