import { inject, Injectable } from '@angular/core';
import { CONFIG } from 'src/app/core/config';
import { InitGameObjectApi } from 'src/app/core/events';
import {
  CreationParams,
  GameObject,
  GameObjectClass,
} from 'src/app/core/game-objects';
import { EventsService } from 'src/app/store';

const ID_SEPARATOR = ':';

function createId(categoryId: string, id: string | number): string {
  return `${categoryId}${ID_SEPARATOR}${id}`;
}

function getIdParts(fullId: string): [categoryId: string, objectId: string] {
  return fullId.split(ID_SEPARATOR) as [string, string];
}

interface ObjectsRegistry<T extends GameObject = GameObject> {
  latestId: 0;
  objects: Set<T>;
}

@Injectable({
  providedIn: 'root',
})
export class GameObjectsManager {
  private readonly events = inject(EventsService);

  private readonly internalRegistries: Map<string, ObjectsRegistry> = new Map();

  private readonly allObjects: Map<string, GameObject> = new Map();

  // allows to attach custom data to any game object
  private readonly objectsCustomData = new Map<string, object>();

  constructor() {
    // expose game object into window for debugging
    (window as any).gameObjects = this;
  }

  createNewGameObject<T extends GameObject>(
    gameObjectClass: GameObjectClass<T>,
    creationParams: CreationParams<T>,
    id?: string
  ): T {
    const categoryId = gameObjectClass.categoryId;

    const unitsRegistry = this.getOrCreateCategoryRegistry(categoryId);

    let newObjectId: string;

    if (id) {
      const targetedId = createId(categoryId, id);

      if (this.allObjects.has(targetedId)) {
        console.error(
          `Game object with id '${targetedId}' already exists! New params/old object:`,
          creationParams,
          this.allObjects.get(targetedId)
        );
        throw new Error(`Game object with id '${targetedId}' already exists!`);
      }

      newObjectId = targetedId;
    } else {
      newObjectId = createId(categoryId, unitsRegistry.latestId++);
    }

    const newGameObject = new gameObjectClass(newObjectId);

    this.events.dispatch(InitGameObjectApi({ gameObject: newGameObject }));

    newGameObject.create(creationParams);

    unitsRegistry.objects.add(newGameObject);

    this.allObjects.set(newObjectId, newGameObject);

    if (CONFIG.logGameObjects) {
      console.log(newGameObject);
    }

    return newGameObject;
  }

  getObjectById<T extends GameObject>(
    gameObjectClass: GameObjectClass<T>,
    id: string
  ): T {
    return this.getObjectByFullId(createId(gameObjectClass.categoryId, id));
  }

  getObjectByFullId<T extends GameObject>(fullId: string): T {
    const idParts = getIdParts(fullId);

    if (idParts.length !== 2) {
      throw new Error(
        `Getting object by id '${fullId}' failed, id doesn't follow format 'CategoryId${ID_SEPARATOR}ObjectId'`
      );
    }

    const object = this.allObjects.get(fullId);

    if (!object) {
      throw new Error(
        `Failed to get object by '${fullId}' id: Object doens't exist`
      );
    }

    return object as T;
  }

  destroyObject(object: GameObject): void {
    const objectProto = Object.getPrototypeOf(object);

    const objectCategoryId = (objectProto as typeof GameObject).categoryId;

    const categoryRegistry = this.internalRegistries.get(objectCategoryId);

    categoryRegistry?.objects.delete(object);

    object.onDestroy();

    this.objectsCustomData.delete(object.id);

    this.allObjects.delete(object.id);
  }

  getObjectId<T extends GameObject>(
    gameObjectClass: GameObjectClass<T>,
    id: string
  ): string {
    // check if id is already complete
    const idParts = id.split(':');

    if (idParts.length === 2 && idParts[0] === gameObjectClass.categoryId) {
      return id;
    }

    return createId(gameObjectClass.categoryId, id);
  }

  /** Attaches some custom data to game object by id. Data is merged in shallow approach. */
  addCustomData<T extends object>(idOrObject: string | GameObject, newData: T): void {
    const id = typeof idOrObject === 'object' ? idOrObject.id : idOrObject;

    const objectCustomData = this.objectsCustomData.get(id) as T | undefined;

    this.objectsCustomData.set(id, { ...objectCustomData, ...newData });
  }

  getCustomData<T extends object>(idOrObject: string | GameObject): T | undefined {
    const newLocal = this.objectsCustomData.get(typeof idOrObject === 'string' ? idOrObject : idOrObject.id) as T | undefined;
    console.log('Getting custom data:', newLocal);
    return newLocal;
  }

  private getOrCreateCategoryRegistry(categoryId: string): ObjectsRegistry {
    const category = this.internalRegistries.get(categoryId);

    if (!category) {
      this.initializeRegistryForCategory(categoryId);

      return this.internalRegistries.get(categoryId)!;
    }

    return category;
  }

  private initializeRegistryForCategory(categoryId: string): void {
    this.internalRegistries.set(categoryId, {
      latestId: 0,
      objects: new Set(),
    });
  }
}
