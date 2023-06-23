import { EventGroupUtilTypes, createEventType, createEventsGroup } from 'src/app/store';

const structEvent = createEventType;

export const SturctEventsGroup = createEventsGroup({
  prefix: 'Structure',
  events: {
    NewDayBegins: structEvent(),
    NewWeekBegins: structEvent(),
    StructVisited: structEvent(),
  },
})

type StructEventUtilTypes = EventGroupUtilTypes<typeof SturctEventsGroup>;
