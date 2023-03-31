import { createEventType } from 'src/app/store';
import { createEventsGroup } from 'src/app/store/events/event-groups';

export const itemEvents = {
  NewRoundBegins: createEventType<{ round: number }>(''),
};

// it feels like hybrid approach can be used.
// events object above can be used for easy use
// and refactoring, while events group can
// prepare events for logging, give ability to
// get item event by name, etc.
export const ItemsEvents = createEventsGroup({
  prefix: 'Items',
  events: itemEvents,
});

// change later
export type ItemEventTypes = keyof typeof itemEvents;

export type ItemsEventsHandlers = { [K in keyof typeof itemEvents]?: (target: ReturnType<(typeof itemEvents)[K]>) => void };

export interface ItemsEventsRef {
  on: (handlers: ItemsEventsHandlers) => void;
}
