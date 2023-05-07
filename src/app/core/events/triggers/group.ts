import { createEventsGroup } from 'src/app/store';
import * as TriggerEvents from './events';

export const TriggersEventGroup = createEventsGroup({
  events: TriggerEvents,
  prefix: 'Triggers'
});

export const Triggers = TriggersEventGroup.events;
