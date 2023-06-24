import { EventGroupUtilTypes, createEventType, createEventsGroup } from 'src/app/store';
import { Player } from '../../players';

const structEvent = createEventType;

export const SturctEventsGroup = createEventsGroup({
  prefix: 'Structure',
  events: {
    NewDayBegins: structEvent(),
    NewWeekBegins: structEvent(),
    StructVisited: structEvent<{visitingPlayer: Player}>(),
  },
});

export const StructEvents = SturctEventsGroup.events;

export type StructEventUtilTypes = EventGroupUtilTypes<typeof SturctEventsGroup>;
