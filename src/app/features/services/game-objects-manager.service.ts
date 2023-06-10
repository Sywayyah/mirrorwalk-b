import { Injectable, Type } from '@angular/core';
import { CONFIG } from 'src/app/core/config';
import { InitGameObjectApi } from 'src/app/core/events';
import { CreationParams, GameObject } from 'src/app/core/game-objects';
import { EventsService } from 'src/app/store';

function createId(categoryId: string, id: string | number): string {
  return `${categoryId}:${id}`;
}

interface ObjectsRegistry<T extends GameObject = GameObject> {
  latestId: 0;
  objects: Set<T>;
};

@Injectable({
  providedIn: 'root',
})
export class GameObjectsManager {
  // I'll keep id allocation per category, it can be changed after if needed
  private readonly internalRegistries: Map<string, ObjectsRegistry> = new Map();

  private readonly allObjects: Map<string, GameObject> = new Map();

  constructor(private readonly events: EventsService) { }

  createNewGameObject<T extends GameObject>(gameObjectClass: Type<T> & { categoryId: string }, creationParams: CreationParams<T>, id?: string): T {
    const categoryId = gameObjectClass.categoryId;

    const unitsRegistry = this.getOrCreateCategoryRegistry(categoryId);

    let newObjectId: string;

    if (id) {
      const targetedId = createId(categoryId, id);

      if (this.allObjects.has(targetedId)) {
        console.error(`Game object with id '${targetedId}' already exists! New params/old object:`, creationParams, this.allObjects.get(targetedId));
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

  destroyObject(object: GameObject): void {
    const objectProto = Object.getPrototypeOf(object);

    const objectCategoryId = (objectProto as typeof GameObject).categoryId;

    const categoryRegistry = this.internalRegistries.get(objectCategoryId);

    categoryRegistry?.objects.delete(object);

    this.allObjects.delete(object.id);
  }

  getObjectId<T extends GameObject>(gameObjectClass: Type<T> & { categoryId: string }, id: string): string {
    // check if id is already complete
    const idParts = id.split(':');

    if (idParts.length === 2 && idParts[0] === gameObjectClass.categoryId) {
      return id;
    }

    return createId(gameObjectClass.categoryId, id);
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
