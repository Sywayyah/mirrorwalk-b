import { EventType } from 'src/app/store';
import { Trigger } from './types';

export const TriggersRegistry = {
  // event/Trigger mapping
  registryMap: new Map<EventType<any>, Trigger<any>[]>(),
  register<T extends object>(event: EventType<T>, trigger: Trigger<T>) {
    if (this.registryMap.has(event)) {
      const triggersForEvent = this.registryMap.get(event)!;
      triggersForEvent.push(trigger);
    } else {
      this.registryMap.set(event, [trigger]);
    }
    console.log(event, trigger, this.registryMap);
  },
};
