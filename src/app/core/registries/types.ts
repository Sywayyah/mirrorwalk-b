declare global {
  interface A {
    heroes: 1 | 2;
  }
}

export class Registry {
  constructor(private readonly id: string) { }

  registerEntity<T>(entityId: string, entity: T): void {

  }
}


export class Registries {
  private static readonly registriesMap = new Map<string, Registry>();

  static create(registryId: string): Registry {
    const newRegistry = new Registry(registryId);

    this.registriesMap.set(registryId, newRegistry);

    return newRegistry;
  }

  static resolveEntity<T extends object>(entityId: string): T {
    return {} as T;
  }
  static getEntity(key: keyof A): void { }
}

// Registries.getEntity('units');
// Registries.create('h').registerEntity('qe', {});
