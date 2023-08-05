import { EventGroupUtilTypes, createEventsGroup } from 'src/app/store';
import * as UIEvents from './events';

export const UIEventGroup = createEventsGroup({
  events: UIEvents,
  prefix: 'UI'
});

export const uiEvents = UIEventGroup.events;

type UIEventGroupUtilTypes = EventGroupUtilTypes<typeof UIEventGroup>;


export type UIEventsTypes = UIEventGroupUtilTypes['GroupEventTypes'];
