import { createEventType } from 'src/app/store';
import { createEventsGroup } from 'src/app/store/events/event-groups';


// it feels like hybrid approach can be used.
// events object above can be used for easy use
// and refactoring, while events group can
// prepare events for logging, give ability to
// get item event by name, etc.
export const ItemsEventsGroup = createEventsGroup({
  prefix: 'Items',
  events: {
    NewRoundBegins: createEventType<{ round: number }>(''),
  },
});


export const ItemEvents = ItemsEventsGroup.events;

// change later
export type ItemEventTypes = keyof typeof ItemEvents;

export type ItemsEventsHandlers = { [K in keyof typeof ItemEvents]?: (target: ReturnType<(typeof ItemEvents)[K]>) => void };

export interface ItemsEventsRef {
  on: (handlers: ItemsEventsHandlers) => void;
}
