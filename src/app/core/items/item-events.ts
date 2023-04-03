import { createEventType, EventHandlersMap, EventNames, createEventsGroup } from 'src/app/store';

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
