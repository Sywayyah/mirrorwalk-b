
export interface EventInfo {
  __id: number;
  __name: string;
  // __type: () => void;
}

export interface EventType<T extends object = {}> {
  __info: EventInfo;
  (props?: T): T & EventInfo;
}

let eventId: number = 0;

export function eventType<T extends object = {}>(
  name: string = ''
): EventType<T> {
  const eventInfo: EventInfo = {
    __id: eventId,
    __name: name,
  };

  const event = function eventFn(data: T = {} as any) {
    return {
      ...eventInfo,
      ...data,
    };
  };

  event.__info = eventInfo;

  eventId += 1;

  return event;
}

export function eventsForPrefix(prefix: string): typeof eventType {
  return (name?: string) => eventType(`${prefix} ${name}`);
}

// export function eventsFromKeysOf<T extends object>(prefix: string): <K extends keyof T>(name?: string) => EventType<{ [P in K]: T[P] }> {
//   return <K extends keyof T>(name?: string) => eventType<{ [P in K]: T[P] }>(`${prefix} ${name}`);
// }
