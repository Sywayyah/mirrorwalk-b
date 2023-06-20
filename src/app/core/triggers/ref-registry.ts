import { EventData, EventType } from 'src/app/store';

// this is going to replace { Spell/Item: { Event: Handler } } and some other possible things in the future.
export class RefEventTriggersRegistry<T> {
  // theoretically, handlers can be in a Set instead of array, but not sure yet.
  private triggerMapsByRefsMap: Map<T, Map<EventType, ((data: unknown) => void)[]>> = new Map();

  public registerHandlerByRef<D extends object>(ref: T, event: EventType<D>, handler: (data: D) => void) {
    const refTriggersMap = this.triggerMapsByRefsMap.get(ref);

    if (refTriggersMap) {
      const triggers = refTriggersMap.get(event as any);

      if (triggers) {
        triggers.push(handler as any);
      } else {
        refTriggersMap.set(event as any, [handler as any]);
      }
    } else {
      this.triggerMapsByRefsMap.set(ref, new Map([[event as any, [handler as any]]]));
    }
  }

  public triggerAllHandlersByEvent(event: EventData): void {
    this.triggerMapsByRefsMap.forEach((refTriggersMap) => {
      refTriggersMap.forEach((triggers, eventType) => triggers.forEach(trigger => {
        if (eventType === event.__eventType.__type) {
          trigger(event);
        }
      }));
    });
  }

  public triggerRefEventHandlers(ref: T, event: EventData): void {
    const refTriggersMap = this.triggerMapsByRefsMap.get(ref);

    if (refTriggersMap) {
      refTriggersMap.forEach((triggers, eventType) => {
        triggers.forEach(trigger => {
          if (eventType === event.__eventType.__type) {
            trigger(event);
          }
        });
      })
    }
  }

  public removeAllHandlersForRef(ref: T): void {
    this.triggerMapsByRefsMap.delete(ref);
  }

  public removeAllHandlers(): void {
    this.triggerMapsByRefsMap.clear();
  }
}

// const spellsRegistry = new RefEventTriggersRegistry();
// spellsRegistry.registerHandlerByRef({}, spellEvents.NewRoundBegins, (data) => { console.log(data.round) })
// spellsRegistry.triggerAllHandlersByEvent(spellEvents.NewRoundBegins({ round: 1 }));
// spellsRegistry.triggerHandlersForRef({}, spellEvents.NewRoundBegins({ round: 1 }));
