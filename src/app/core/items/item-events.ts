import { createEventType } from 'src/app/store';
import { EventHandlersMap, EventNames, createEventsGroup } from 'src/app/store/events/event-groups';

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
