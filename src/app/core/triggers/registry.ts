import { EventType } from 'src/app/store';
import { Trigger } from './types';

export const TriggersRegistry = {
  // event/Trigger mapping
  registryMap: new Map<EventType<any>, Trigger<any>[]>(),

  // maybe some observable.. so the service can subscribe to new triggers
  // dynamically
  register<T extends object>(event: EventType<T>, trigger: Trigger<T>): void {
    if (this.registryMap.has(event)) {
      const triggersForEvent = this.registryMap.get(event)!;
      triggersForEvent.push(trigger);
    } else {
      this.registryMap.set(event, [trigger]);
    }
  },
};
