import { EventType } from './events';

type EventGroupList = Record<string | number, EventType<any>>;

export interface EventGroup<T extends EventGroupList> {
  events: T,
  // poor refactoring, but later it feels poor overall
  getEventByName<K extends keyof T>(eventName: K): T[K];
}

export function createEventsGroup<T extends EventGroupList>({ events, prefix }: {
  prefix: string,
  events: T,
}): EventGroup<T> {

  Object.entries(events).forEach(([eventName, event]) => {
    const description = event.__typeInfo.__name;

    event.__typeInfo.__name = `${prefix}:${eventName}` + (description ? `, ${description}` : '');
  });

  return {
    events,
    getEventByName<K extends keyof T>(eventName: K) { return events[eventName] }
  };
}

// hmm, maybe some complex type can be returned, and then indexed access be used...
export type EventNames<T extends EventGroup<any>> = keyof T['events'];
export type EventsOfGroup<T extends EventGroup<any>> = T['events'][keyof T['events']];
export type EventTypeByName<T extends EventGroup<any>, K extends keyof T['events']> = ReturnType<T['events'][K]>;

export type EventHandlersMap<T extends EventGroup<any>> = { [K in keyof T['events']]?: (target: ReturnType<T['events'][K]>) => void };

type DataOfEvent<T extends EventType> = T extends EventType<infer U> ? U : never;

// this could simplify usage of Events
export type EventGroupUtilTypes<T extends EventGroup<any>> = {
  EventNames: EventNames<T>,
  EventsOfGroup: EventsOfGroup<T>,
  EventHandlersMap: EventHandlersMap<T>,

  // this could potentially remove type files for events
  GroupEventTypes: { [K in keyof T['events']]: DataOfEvent<T['events'][K]> },
  // GroupEventTypes: { [K in keyof T['events']]: T extends T['events'][K]<infer U> ? U : never },
};

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
