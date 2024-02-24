import { Entity, EntityId } from './types';

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

export class EntitiesRegisty {
  private static readonly allEntitiesMap = new Map<EntityId, Entity>();
  private static readonly entitiesByPrefixMap = new Map<string, Entity[]>();
  // private static readonly registriesMap = new Map<string, Registry>();

  // todo: check if sub-registries are needed
  // static create<T extends object>(registryId: string): Registry<T> {
  //   const newRegistry = new Registry<T>(registryId);

  //   this.registriesMap.set(registryId, newRegistry);

  //   return newRegistry;
  // }

  static resolve<T extends object>(entityId: string): T {
    const entity = this.allEntitiesMap.get(entityId as EntityId);

    if (!entity) {
      console.error(`Couldn't resolve entity ${entityId}`);
    }

    return entity as T;
  }

  static register(entity: Entity): void {
    if (this.allEntitiesMap.has(entity.id)) {
      console.error(`Entity ${entity.id} is already registered, registering:`, entity);
      return;
    }

    const idPrefix = getIdPrefix(entity.id);

    const entitiesByPrefix = this.entitiesByPrefixMap.get(idPrefix);

    if (entitiesByPrefix) {
      entitiesByPrefix.push(entity);
    } else {
      this.entitiesByPrefixMap.set(idPrefix, [entity]);
    }

    this.allEntitiesMap.set(entity.id, entity);
  }
}

(window as any).entities = EntitiesRegisty;

function getIdPrefix(entityId: string): string {
  return entityId.split('-')[0];
}

export function registerEntity(entity: Entity): void {
  EntitiesRegisty.register(entity);
}

export function resolveEntity<T extends Entity>(id: string | EntityId): T {
  return EntitiesRegisty.resolve<T>(id);
}

// test
// const factionsRegistry = Registries.create<{ name: string }>('factions');
// factionsRegistry.registerEntity('ca', { name: 'Castle' });
// factionsRegistry.registerEntity('co', { name: 'Constellation' });
// factionsRegistry.registerEntity('fo', { name: 'Fort' });
