import { EventGroupUtilTypes, EventHandlersMap, EventNames, createEventType, createEventsGroup } from "src/app/store";

const townEvents = createEventType;

export const BuildingsEventsGroup = createEventsGroup({
  prefix: 'Building', events: {
    NewDayBegins: townEvents(),
    NewWeekStarts: townEvents(),
    Built: townEvents(),
  },
});

export const TownEvents = BuildingsEventsGroup.events;

export type BuildingsUtilTypes = EventGroupUtilTypes<typeof BuildingsEventsGroup>;

export type BuildingEventsHandlers = BuildingsUtilTypes['EventHandlersMap'];
export type BuildingEventNames = BuildingsUtilTypes['EventNames'];

// export type Buildings = EventGroupUtilTypes<typeof BuildingsEventsGroup>;

// example, this could rid game of declaring types for events
// const a: Buildings['GroupEventTypes']['NewDayBegins'] = {};
