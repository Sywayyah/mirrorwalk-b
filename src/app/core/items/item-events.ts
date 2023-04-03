import { createEventType } from 'src/app/store';
import { EventHandlersMap, EventNames, createEventsGroup } from 'src/app/store/events/event-groups';


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

export type ItemGroupType = typeof ItemsEventsGroup;

export type ItemEventNames = EventNames<ItemGroupType>;
export type ItemsEventsHandlers = EventHandlersMap<ItemGroupType>;

export interface ItemsEventsRef {
  on: (handlers: ItemsEventsHandlers) => void;
}
