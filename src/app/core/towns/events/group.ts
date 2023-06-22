import * as BuildingEvents from './events';
import { EventGroupUtilTypes, EventHandlersMap, EventNames, createEventsGroup } from "src/app/store";

export const BuildingsEventsGroup = createEventsGroup({ prefix: 'Building', events: BuildingEvents });

export type BuildingEventsHandlers = EventHandlersMap<typeof BuildingsEventsGroup>;
export type BuildingEventNames = EventNames<typeof BuildingsEventsGroup>;

export type Buildings = EventGroupUtilTypes<typeof BuildingsEventsGroup>;

// example, this could rid game of declaring types for events
// const a: Buildings['GroupEventTypes']['NewDayBegins'] = {};
