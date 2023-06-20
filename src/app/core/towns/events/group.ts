import * as BuildingEvents from './events';
import { EventHandlersMap, EventNames, createEventsGroup } from "src/app/store";

export const BuildingsEventsGroup = createEventsGroup({ prefix: 'Building', events: BuildingEvents });

export type BuildingEventsHandlers = EventHandlersMap<typeof BuildingsEventsGroup>;
export type BuildingEventNames = EventNames<typeof BuildingsEventsGroup>;
