import { createEventType, EventType } from './events';

type EventGroupList = Record<string | number, EventType<any>>;

interface EventGroup<T extends EventGroupList> {
  events: T,
  // poor refactoring, but later it feels poor overall
  getEventByName<K extends keyof T>(eventName: K): T[K];
}

export function createEventsGroup<T extends EventGroupList>({ events, prefix }: {
  prefix: string,
  events: T,
}): EventGroup<T> {

  Object.entries(events).forEach(([eventName, event]) => {
    event.__info.__name = `${prefix}:${eventName}, ${event.__info.__name}`;
    // event.toString = function () {
    //   return `[${prefix}] Event:${eventName}`;
    // };
  });

  return {
    events,
    getEventByName<K extends keyof T>(eventName: K) { return events[eventName] }
  };
}

export type KeysOfEventGroup<T extends EventGroup<any>> = keyof T['events'];
export type EventsOfGroup<T extends EventGroup<any>> = T['events'][keyof T['events']];

// Api tests:

// const triggersEvents = createEventsGroup({
//   prefix: 'Triggers',
//   events: {
//     GameStarts: createEventType<{ round: number }>(),
//     GameEnds: createEventType<{ spellsCount: 1, round: number }>(),
//     UnitAttacks: createEventType<{ target: object }>(),
//     NewRoundBegins: createEventType(),
//   },
// });

// it works, but doesn't refactor well
// triggersEvents.getEventByName('GameStarts')({ round: 1 });
// triggersEvents.events['GameStarts']({ round: 1 });
// triggersEvents.events.GameStarts;

// type TriggerKeys = KeysOfEventGroup<typeof triggersEvents>;
// type TriggerEvents = EventsOfGroup<typeof triggersEvents>;

// also refactors a bit poorly
// const key: TriggerKeys = 'GameStarts';
// const events: TriggerEvents = triggersEvents.events.GameStarts;
