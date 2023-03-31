
export interface EventInfo {
  // global numeric id
  __id: number;
  // text description
  __name: string;
  // it's event type
  __type: (() => void) | null;
}

export interface EventType<T extends object = object> {
  __info: EventInfo;
  (props?: T): T & EventInfo;
}

let eventId: number = 0;

export function createEventType<T extends object = {}>(
  name: string = ''
): EventType<T> {
  const eventInfo: EventInfo = {
    __id: eventId,
    __name: name,
    __type: null,
  };

  const event = function eventFn(data: T = {} as any) {
    eventInfo.__type = eventFn;

    return {
      ...eventInfo,
      ...data,
    };
  };

  event.__info = eventInfo;

  eventId += 1;

  return event;
}

export function eventsForPrefix(prefix: string): typeof createEventType {
  return (name?: string) => createEventType(`${prefix} ${name}`);
}

// export function eventsFromKeysOf<T extends object>(prefix: string): <K extends keyof T>(name?: string) => EventType<{ [P in K]: T[P] }> {
//   return <K extends keyof T>(name?: string) => eventType<{ [P in K]: T[P] }>(`${prefix} ${name}`);
// }
