export type EntityId = `#${string}`;

export interface Entity {
  id: EntityId;
}

// todo: need to think if it makes sense to create sub-registries
export class Registry<T extends object = object> {
  private readonly entitiesMap = new Map<string, Entity & T>();

  constructor(private readonly id: string) { }

  registerEntity(entityId: string, entity: T): Entity & T {
    const id = `#${entityId}` as EntityId;
    if (this.entitiesMap.has(id)) {
      throw new Error(`Entity id collision, ${id}, registry: ${this.id}`);
    }

    const newEntity = { id, ...entity };

    this.entitiesMap.set(id, newEntity);

    return newEntity;
  }
}

export class Registries {
  private static readonly allEntitiesMap = new Map<string, Entity>();
  private static readonly registriesMap = new Map<string, Registry>();

  static create<T extends object>(registryId: string): Registry<T> {
    const newRegistry = new Registry<T>(registryId);

    this.registriesMap.set(registryId, newRegistry);

    return newRegistry;
  }

  static resolveEntity<T extends object>(entityId: string): T {
    return {} as T;
  }
  static getEntity<T>(key: EntityId): T {
    const entity = this.allEntitiesMap.get(key);

    if (!entity) {
      throw new Error(`Could not resolve entity by id ${key}`);
    }

    return entity as T;
  }
  static register(entity: Entity): void {
    if (this.allEntitiesMap.has(entity.id)) {
      console.error(`Entity ${entity.id} is already registered, registering:`, entity);
      return;
    }

    this.allEntitiesMap.set(entity.id, entity);
  }
}

(window as any).entities = Registries;

export function registerEntity(entity: Entity): void {
  Registries.register(entity);
}

// test
// const factionsRegistry = Registries.create<{ name: string }>('factions');
// factionsRegistry.registerEntity('ca', { name: 'Castle' });
// factionsRegistry.registerEntity('co', { name: 'Constellation' });
// factionsRegistry.registerEntity('fo', { name: 'Fort' });
