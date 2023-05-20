// Practically, a metadata of event type.
export interface EventMetadataInfo {
  // global unique numeric id
  __id: number;

  // text description
  __name: string;

  // it's event type
  __type: (() => void) | null;
}

// Event instance. Contains instance of metadata of its event type.
export type EventData<T extends object = {}> = T & { __eventType: EventMetadataInfo };

// Event type/Event generator fn. Holds metadata info about itself.
export interface EventType<T extends object = object> {
  __typeInfo: EventMetadataInfo;
  (props?: T): EventData<T>;
}

let eventId: number = 0;

export function createEventType<T extends object = {}>(
  name: string = ''
): EventType<T> {
  const eventInfo: EventMetadataInfo = {
    __id: eventId,
    __name: name,
    __type: null,
  };

  const eventType = function (data: T = {} as any): EventData<T> {
    return {
      __eventType: eventInfo,
      ...data,
    };
  };

  eventType.__typeInfo = eventInfo;
  eventInfo.__type = eventType;

  eventId++;

  return eventType;
}

export function eventsForPrefix(prefix: string): typeof createEventType {
  return (name?: string) => createEventType(`${prefix} ${name}`);
}
