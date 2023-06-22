import { EventGroupUtilTypes, createEventsGroup } from 'src/app/store';
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

// type GameEventGroupUtilTypes = EventGroupUtilTypes<typeof gameEvents>;

// const a: GameEventGroupUtilTypes['GroupEventTypes']['PlayerEquipsItem'] = { item: {} as any, player: {} as any, __eventType: {} as any };
