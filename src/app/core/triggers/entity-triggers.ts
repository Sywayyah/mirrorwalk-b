import { EventData, EventType } from 'src/app/store';
import { CommonUtils } from '../utils';

// in theory, may shift event handling to game objects themselves, instead of having
// them rely on mappings.
export class EventHandlers {
  // initialize lazily
  private eventHandlersMap?: Map<EventType<object>, ((data: EventData) => void)[]>;

  addEventHandler<D extends object>(eventType: EventType<D>, handler: (data: EventData<D>) => void): void {
    if (!this.eventHandlersMap) {
      this.eventHandlersMap = new Map();
    }

    const handlers = this.eventHandlersMap.get(eventType as unknown as EventType);

    if (handlers) {
      handlers.push(handler as (data: unknown) => void);
    } else {
      this.eventHandlersMap.set(eventType as unknown as EventType<object>, [handler as (data: unknown) => void]);
    }
  }

  triggerEvent(event: EventData): void {
    if (!this.eventHandlersMap) {
      return;
    }

    this.eventHandlersMap.get(event.__eventType.__type as EventType)?.forEach((handler) => handler(event));
  }

  removeAllHandlers(): void {
    this.eventHandlersMap?.clear();
  }

  removeEventHandler(eventType: EventType, handler: (data: EventData) => void): void {
    const handlers = this.eventHandlersMap?.get(eventType);

    if (!handlers) {
      return;
    }

    CommonUtils.removeItem(handlers, handler);
  }

  removeEventHandlers(eventType: EventType): void {
    this.eventHandlersMap?.delete(eventType);
  }
}
